const https = require('https');
const { COLORS } = require('../common/constants');


const log = {
    info: (text) => {
        return console.log(COLORS.default, text, COLORS.reset);
    },
    success: (text) => {
        return console.log(COLORS.success, text, COLORS.reset);
    },
    error: (text) => {
        return console.log(COLORS.error, text, COLORS.reset);
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

function _DIRTY_getPackageSize(module, version) {
    return new Promise((resolve, reject) => {
        https.get(`https://packagephobia.now.sh/result?p=${module}`, (resp) => {
            let data = '';

            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                const pattern = /\| Publish Size: (.*?) \|/;
                const found = pattern.exec(data);
                let size = (found && found.length > 1) ? found[1] : 0;

                if (/mb/i.test(size)) {
                    size = parseFloat(size.split(/mb/i)) * 1024;
                }

                if (/kb/i.test(size)) {
                    size = parseFloat(size.split(/kb/i));
                }

                return resolve(size);
            });
        }).on('error', (err) => {
            return resolve(0);
        });
    });
}

module.exports = {
    log,
    flatten,
    safeJSONParse,
    splitNames,
    filterExternalDependencies,
    asyncReduce,
    _DIRTY_getPackageSize
};
