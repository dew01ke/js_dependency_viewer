const path = require('path');
const {
    getFiles,
    getContent
} = require('./filesystem');
const { parseContent } = require('./extractor');
const {
    flatten,
    filterExternalDependencies
} = require('../common/helpers');
const {
    DEFAULT_EXTENSIONS
} = require('../common/constants');


function filterFiles(extensions = DEFAULT_EXTENSIONS) {
    return (files) => {
        return files.filter((file) => {
            return extensions.includes(path.extname(file));
        });
    }
}

function getDependenciesObject(target, extensions, excludeRelative = true) {
    return getFiles(target)
        .then(filterFiles(extensions))
        .then(async (files) => await Promise.all(files.map((file) => getContent(file))))
        .then((contents) => contents.map(({ content, filename, relativePath }) => parseContent(content, filename, relativePath)))
        .then(flatten)
        .then((deps) => {
            return excludeRelative ? filterExternalDependencies(deps) : deps;
        });
}

module.exports = {
    getDependenciesObject
};
