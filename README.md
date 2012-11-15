sassets
=====

sassets, or shitty asset manager, is a node.js module to bundle assets for websites

[![Build Status](https://travis-ci.org/abrkn/sassets.png)](https://travis-ci.org/abrkn/sassets)

installation
=====

`npm install sassets`

usage
=====

```
javascript
app.get('/scripts.js', function(req, res, next) {
    sassets.combine([
        { path: 'vendor/jquery 1.8.2/jquery-1.8.2.js' },
        { path: 'vendor/bootstrap 2.2.1/js/bootstrap.js' },
        { type: 'browserify', path: 'lib/client/entry.js', uglify: true }
    ], function(err, scripts) {
        if (err) return next(err);
        res.contentType('text/javascript');
        res.end(scripts);
    });
});

app.get('/styles.css', function(req, res, next) {
    sassets.combine([
        { path: 'assets/styles.less' },
        { path: 'vendor/bootstrap 2.2.1/css/bootstrap.css' },
        { path: 'vendor/bootstrap 2.2.1/css/bootstrap-responsive.css' }
    ], function(err, styles) {
        if (err) return next(err);
        res.contentType('text/css');
        res.end(styles);
    });
});
```