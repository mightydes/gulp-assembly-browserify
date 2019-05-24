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

    if (!_.has(options, 'entries')) {
        throw new Error(`[gulp-assembly-browserify] Missed mandatory 'options.entries'!`);
    }
    if (!_.has(options, 'output')) {
        throw new Error(`[gulp-assembly-browserify] Missed mandatory 'options.output'!`);
    }
    if (!options.browserify) {
        options.browserify = {};
    }

    let entries = _.isArray(options.entries) ? options.entries : [options.entries];
    let stream = options.utils.isNoWatch() ? browserifyStream() : watchifyStream();

    bundle(stream);
    return stream;


    // FUNCTIONS:

    function browserifyStream() {
        let opt = Object.assign({entries: entries}, options.browserify);
        options.utils.isNoWatch() || (opt = Object.assign(opt, watchify.args));
        if (options.transformHandler) {
            return options.transformHandler(browserify(opt));
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
        if (options.bundleHandler) {
            out = options.bundleHandler(out);
        }
        return out.pipe(options.utils.dest());
    }
}
