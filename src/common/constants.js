const PATTERN_IMPORT = /import\s(?:{)*(.*?)(?:})*\sfrom\s(?:"|')(.*)(?:"|')/gi;

const COLORS = {
    default: "\x1b[33m",
    reset: "\x1b[0m",
    error: "\x1b[31m",
    base: "\x1b[37m",
    success: "\x1b[32m"
};

const PACKAGE_NAME = 'js-dependency-viewer';

const DEFAULT_PACKAGE_JSON = 'package.json';
const DEFAULT_NODE_MODULES = 'node_modules';
const DEFAULT_EXTENSIONS = ['.vue', '.js', '.ts', '.js6', '.es6'];

module.exports = {
    PACKAGE_NAME,
    PATTERN_IMPORT,
    COLORS,
    DEFAULT_PACKAGE_JSON,
    DEFAULT_NODE_MODULES,
    DEFAULT_EXTENSIONS
};
