# gulp-assembly-browserify

Browserify component for gulp assembly package.


## Option list:

*   `entries` -- optional input file(s). Can be string or array.
    For example: `require.resolve('./mount/website')`.

*   `output` -- mandatory output filename.
    For example: `website.js`.

*   `utils` -- mandatory configured [gulp-assembly-utils](https://github.com/mightydes/gulp-assembly-utils) instance.

*   `browserify` -- optional browserify config object.

*   `beforeBundle` -- optional function to apply browserify transforms.
    For example:

    ```
    {
        beforeBundle: function(bundle) {
            return bundle
                .transform(stringify, stringifyOpt);
        }
    }
    ```

*   `afterBundle` -- optional function to pipe plugins.
    For example:

    ```
    {
        afterBundle: function(bundle) {
            return bundle
                .pipe($.if(isWrap, $.wrap(wrapOpt)))
                .pipe($.if(isTemplateData, $.template(templateDataOpt)))
                .pipe(minifyJs());
        }
    }
    ```

*   `noWatch` -- optional bool. By default defined by `utils.isNoWatch()` function...
