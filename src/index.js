const { find } = require('./modules/find');
const { frequencyDependencies } = require('./modules/frequency');
const { saveData } = require('./modules/filesystem');
const { log, buildExtensionsArray } = require('./common/helpers');


const isRunningAsGlobal = !module.parent;
const args = process.argv.slice(2);
const options = {
    mode: 'd'
};

args.forEach((arg) => {
    const [key, value] = arg.split('=');

    switch (key) {
        case '--target':
            options.target = value;
            break;

        case '--out':
            options.out = value;
            break;

        case '--mode':
            options.mode = ['d', 'f'].includes(value.toLowerCase()) ? value : 'd';
            break;

        case '--ext':
            const extensions = buildExtensionsArray(value);
            if (extensions.length) {
                options.extensions = extensions;
            }
            break;

        default:
            log.info('Unknown parameter = ' + key);
    }
});

if (isRunningAsGlobal) {
    if (options.target) {
        log.info('Processing... Target path = ' + options.target);

        switch (options.mode) {
            case 'f': {
                frequencyDependencies(options.target, options.extensions).then((frequencyObject) => {
                    if (!frequencyObject) {
                        return false;
                    }

                    log.success(JSON.stringify(frequencyObject));
                });

                break;
            }

            case 'd':
            default: {
                find(options.target, options.extensions).then((dependencyObject) => {
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

                break;
            }
        }
    } else {
        log.error('One or more required parameters are missing');
    }
}

process.on('unhandledRejection', (err) => {
    log.error('Ooops, unhandled rejection', err);
});

module.exports = {
    find,
    frequencyDependencies
};
