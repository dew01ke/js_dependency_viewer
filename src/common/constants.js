const PATTERN_IMPORT = /import\s(?:{)*(.*?)(?:})*\sfrom\s(?:"|')(.*)(?:"|')/gi;

const COLORS = {
    reset: "\x1b[0m",
    error: "\x1b[31m",
    base: "\x1b[37m",
    success: "\x1b[32m"
};

module.exports = {
    PATTERN_IMPORT,
    COLORS
};
