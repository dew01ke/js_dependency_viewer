const { COLORS, PACKAGE_NAME } = require('../common/constants');


const log = {
    info: (...text) => {
        return console.log(COLORS.default, `[${PACKAGE_NAME}]:`, text.join(' '), COLORS.reset);
    },
    success: (...text) => {
        return console.log(COLORS.success, `[${PACKAGE_NAME}]:`, text.join(' '), COLORS.reset);
    },
    error: (...text) => {
        return console.log(COLORS.error, `[${PACKAGE_NAME}]:`, text.join(' '), COLORS.reset);
    }
};

function flatten(arrays) {
    return [].concat.apply([], arrays);
}

function safeJSONParse(data) {
    let output = {};
    try {
        output = JSON.parse(data);
    } catch(ett) {}
    return output;
}

function splitNames(input) {
    return input.split(',');
}

function filterExternalDependencies(deps) {
    return deps.filter((dep) => !/^\./.test(dep.module));
}

async function asyncReduce(array, handler, startingValue) {
    let result = startingValue;

    for (value of array) {
        result = await handler(result, value);
    }

    return result;
}

function join(keys, values) {
    return values.reduce((result, field, index) => {
        result[keys[index]] = field;
        return result;
    }, {});
}

function buildExtensionsArray(str) {
    const extensions = str.replace(/["|']/g, '').split(',');
    return extensions.map((extension) => {
        const ext = extension.trim();
        return (ext.startsWith('.')) ? ext : `.${ext}`;
    });
}

module.exports = {
    join,
    log,
    flatten,
    safeJSONParse,
    splitNames,
    filterExternalDependencies,
    asyncReduce,
    buildExtensionsArray
};
