const { PATTERN_IMPORT } = require('../common/constants');
const { flatten, splitNames } = require('../common/helpers');


function findDependencies(content, pattern) {
    let result;
    let extractArray = [];

    while (result = pattern.exec(content)) {
        const [dep, name, module] = result;

        extractArray.push({
            name,
            module
        });
    }

    return extractArray;
}

function getNameObject(input) {
    const separated = input.trim().split(' as ');

    return {
        originalName: separated[0],
        shadowName: separated[1] || null
    };
}

function buildDependenciesObject(extractArray, filename) {
    return extractArray.map((dependency) => {
        const name = splitNames(dependency.name);

        return name.map((n) => {
            return {
                ...getNameObject(n),
                ...dependency,
                filename
            };
        })
    });
}

function parseContent(content, filename) {
    return flatten(buildDependenciesObject(findDependencies(content, PATTERN_IMPORT), filename));
}

module.exports = {
    parseContent
};
