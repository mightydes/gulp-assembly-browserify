const _ = require('underscore');
const $util = require('gulp-util');
const browserify = require('browserify');
const watchify = require('watchify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

module.exports = Browserify;

function Browserify(options) {
    if (!(this instanceof Browserify)) {
        return new Browserify(options);
    }

    if (!_.has(options, 'output')) {
        throw new Error(`[gulp-assembly-browserify] Missed mandatory 'options.output'!`);
    }
    if (!options.browserify) {
        options.browserify = {};
    }

    let isWatch = function () {
        if (_.has(options, 'noWatch')) {
            return !options.noWatch;
        } else {
            return !options.utils.isNoWatch();
        }
    };
    let stream = isWatch() ? watchifyStream() : browserifyStream();

    bundle(stream);
    return stream;


    // FUNCTIONS:

    function browserifyStream() {
        let opt = {};
        if (_.has(options, 'entries')) {
            let entries = _.isArray(options.entries) ? options.entries : [options.entries];
            opt = {entries: entries};
        }
        opt = Object.assign(opt, options.browserify);

        if (isWatch()) {
            opt = Object.assign(opt, watchify.args);
        }

        if (options.beforeBundle) {
            return options.beforeBundle(browserify(opt));
        }

        return browserify(opt);
    }

    function watchifyStream() {
        let stream = watchify(browserifyStream());
        stream.on('log', $util.log);
        stream.on('update', function () {
            return bundle(stream);
        });
        return stream;
    }

    function bundle(stream) {
        let out = stream.bundle()
            .on('error', $util.log.bind($util, '[gulp-assembly-browserify] Bundle error occurred!'))
            .pipe(source(options.output))
            .pipe(buffer());
        if (options.afterBundle) {
            out = options.afterBundle(out);
        }
        return out.pipe(options.utils.dest());
    }
}
