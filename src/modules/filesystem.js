const { promisify } = require('util');
const { resolve } = require('path');
const path = require('path');
const fs = require('fs');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);


async function getFiles(dir, excludePath = ['node_modules']) {
    const subdirs = await readdir(dir);
    const files = await Promise.all(subdirs.map(async (subdir) => {
        const res = resolve(dir, subdir);

        // TODO
        if (excludePath.includes(subdir)) {
            return '';
        }

        return (await stat(res)).isDirectory() ? getFiles(res) : res;
    }));
    return files.reduce((a, f) => a.concat(f), []);
}

function getFileSize(path) {
    return stat(path)
        .then((result) => {
            return result.size;
        })
        .catch(() => {
            return 0;
        });
}

async function getContent(filename) {
    return {
        filename: path.relative(process.cwd(), filename),
        content: await readFile(filename, { encoding: 'utf8' })
    };
}

async function isExists(path) {
    let isReal = false;

    try {
        await stat(path);
        isReal = true;
    } catch (err) {}

    return  isReal;
}

function saveData(filename, data) {
    return writeFile(filename, data, 'utf8');
}

module.exports = {
    getFileSize,
    getFiles,
    getContent,
    saveData,
    isExists
};
