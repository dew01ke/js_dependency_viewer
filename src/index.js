const { find } = require('./modules/find');
const { saveData } = require('./modules/filesystem');
const { log } = require('./common/helpers');


const args = process.argv.slice(2);
const options = {};

args.forEach((arg) => {
    const [key, value] = arg.split('=');

    switch (key) {
        case '--target':
            options.target = value;
            break;

        case '--out':
            options.out = value;
            break;
    }
});


if (options.target) {
    log.info('Processing... Target path = ' + options.target);
    find(options.target).then((dependencyObject) => {
        if (!dependencyObject) {
            return false;
        }

        if (Array.isArray(dependencyObject) && !dependencyObject.length) {
            return log.info('No external dependencies found');
        }

        if (options.out) {
            return saveData(options.out, JSON.stringify(dependencyObject)).then(() => {
                log.success('The result has been save to ' + options.out);
            });
        } else {
            log.success(JSON.stringify(dependencyObject));
        }
    });
} else {
    log.error('One or more required parameters are missing');
}

process.on('unhandledRejection', () => {
    log.error('Ooops, unhandled rejection');
});
