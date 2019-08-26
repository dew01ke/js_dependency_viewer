const path = require('path');
const {
    getFiles,
    getContent,
    isExists,
    getFileSize
} = require('./filesystem');
const { parseContent } = require('./extractor');
const {
    flatten,
    filterExternalDependencies,
    safeJSONParse,
    asyncReduce,
    log,
    join
} = require('../common/helpers');
const {
    DEFAULT_PACKAGE_JSON,
    DEFAULT_NODE_MODULES,
    DEFAULT_EXTENSIONS
} = require('../common/constants');


function filterFiles(extensions = DEFAULT_EXTENSIONS) {
    return (files) => {
        return files.filter((file) => {
            return extensions.includes(path.extname(file));
        });
    }
}

function getDependenciesObject(target, extensions) {
    return getFiles(target)
        .then(filterFiles(extensions))
        .then(async (files) => await Promise.all(files.map((file) => getContent(file))))
        .then((contents) => contents.map(({ content, filename }) => parseContent(content, filename)))
        .then(flatten)
        .then(filterExternalDependencies);
}

function getPackagesSize(targetPath) {
    return async (packageObject) => {
        if (!(await isExists(path.resolve(targetPath, DEFAULT_NODE_MODULES)))) {
            log.info(`Make sure you run 'npm install' in ${targetPath} folder`);

            return Object.keys(packageObject).reduce((object, key) => {
                object[key] = null;
                return object;
            }, {})
        }

        const packages = Object.keys(packageObject);
        const folders = packages.map((pack) => path.resolve(targetPath, DEFAULT_NODE_MODULES, pack));
        const dirs = await Promise.all(folders.map((folder) => getFiles(folder)));
        const sizes = await Promise.all(dirs.map((dir) => {
            return asyncReduce(
                dir,
                async (size, path) => {
                    size += await getFileSize(path);
                    return size;
                },
                0
            );
        }));

        return join(packages, sizes);
    }
}

async function parsePackageJson(targetPath = './') {
    return getContent(path.join(targetPath, DEFAULT_PACKAGE_JSON))
        .then(({ content }) => safeJSONParse(content))
        .then((json) => json.dependencies || {})
        .then(getPackagesSize(targetPath));
}

async function find(targetPath, extensions) {
    if (!(await isExists(targetPath))) {
        return log.error('Target path does not exist');
    }

    if (!(await isExists(path.join(targetPath, DEFAULT_PACKAGE_JSON)))) {
        return log.error('Target path should contain a valid package.json');
    }

    const packages = await parsePackageJson(targetPath);
    const deps = await getDependenciesObject(targetPath, extensions);
    const output = {};

    deps.forEach((dep) => {
        if (!packages.hasOwnProperty(dep.module)) {
            return;
        }

        const moduleKey = dep.module;
        if (!output[moduleKey]) {
            output[moduleKey] = {
                module: dep.module,
                methods: {}
            };
            if (packages[dep.module]) {
                output[moduleKey].size = packages[dep.module];
            }
        }

        const methodKey = `${dep.module}_${dep.originalName}`;
        if (!output[moduleKey].methods[methodKey]) {
            output[moduleKey].methods[methodKey] = {
                name: dep.originalName,
                location: [],
            };
        }

        output[moduleKey].methods[methodKey].location.push(dep.filename)
    });

    return Object.values(output).map((out) => {
        return {
            ...out,
            methods: Object.values(out.methods)
        };
    });
}

module.exports = {
    find
};
