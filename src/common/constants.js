const PATTERN_IMPORT = /import\s(?:{)*(.*?)(?:})*\sfrom\s(?:"|')(.*)(?:"|')/gi;

const COLORS = {
    default: "\x1b[33m",
    reset: "\x1b[0m",
    error: "\x1b[31m",
    base: "\x1b[37m",
    success: "\x1b[32m"
};

const PACKAGE_NAME = 'js-dependency-viewer';

module.exports = {
    PACKAGE_NAME,
    PATTERN_IMPORT,
    COLORS
};
