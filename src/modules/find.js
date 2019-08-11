const path = require('path');
const { getFiles, getContent, isExists } = require('./filesystem');
const { parseContent } = require('./extractor');
const { flatten, filterExternalDependencies, safeJSONParse, asyncReduce, _DIRTY_getPackageSize, log } = require('../common/helpers');


function filterFiles(files, extensions = ['.vue', '.js', '.ts', '.js6', '.es6']) {
    return files.filter((file) => {
        return extensions.includes(path.extname(file));
    });
}

function getDependenciesObject(target) {
    return getFiles(target)
        .then(filterFiles)
        .then(async (files) => await Promise.all(files.map((file) => getContent(file))))
        .then((contents) => contents.map(({ content, filename }) => parseContent(content, filename)))
        .then(flatten)
        .then(filterExternalDependencies);
}

async function parsePackageJson(targetPath = './') {
    return getContent(path.join(targetPath, 'package.json'))
        .then(({ content }) => safeJSONParse(content))
        .then((json) => json.dependencies || {})
        .then(async (packageObject) => {
            return asyncReduce(
                Object.keys(packageObject),
                async (object, module) => {
                    object[module] = await _DIRTY_getPackageSize(module);

                    return object;
                },
                {}
            );
        });
}

async function find(targetPath) {
    const isTargetExists = await isExists(targetPath);

    if (!isTargetExists) {
        return log.error('Target path does not exist');
    }

    const packages = await parsePackageJson(targetPath);
    const deps = await getDependenciesObject(targetPath);
    const output = {};

    deps.forEach((dep) => {
        if (!packages.hasOwnProperty(dep.module)) {
            return;
        }

        const moduleKey = dep.module;
        if (!output[moduleKey]) {
            output[moduleKey] = {
                module: dep.module,
                size: packages[dep.module],
                methods: {}
            };
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
