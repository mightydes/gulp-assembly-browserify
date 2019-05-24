# gulp-assembly-browserify

Browserify component for gulp assembly package.


## Option list:

*   `entries` -- mandatory input file(s). Can be string or array.
    For example: `require.resolve('./mount/website')`.

*   `output` -- mandatory output filename.
    For example: `website.js`.

*   `utils` -- mandatory configured [gulp-assembly-utils](https://github.com/mightydes/gulp-assembly-utils) instance.

*   `browserify` -- optional browserify config object.

*   `transformHandler` -- optional function to apply browserify transforms.
    For example:

    ```
    {
        transformHandler: function(stream) {
            return stream
                .transform(stringify, stringifyOpt);
        }
    }
    ```

*   `bundleHandler` -- optional function to pipe plugins.
    For example:

    ```
    {
        bundleHandler: function(stream) {
            return stream
                .pipe($.if(isWrap, $.wrap(wrapOpt)))
                .pipe($.if(isTemplateData, $.template(templateDataOpt)))
                .pipe(minifyJs());
        }
    }
    ```
