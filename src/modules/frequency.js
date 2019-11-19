const { getDependenciesObject } = require('./dependencies');


function frequencyDependencies(target, extensions) {
    return getDependenciesObject(target, extensions, false)
        .then((deps) => {
            return deps.reduce((object, dep) => {
                if (!object[dep.resolvedPath]) {
                    object[dep.resolvedPath] = 0;
                }

                object[dep.resolvedPath] += 1;

                return object;
            }, {});
        });
}

module.exports = {
    frequencyDependencies
};
