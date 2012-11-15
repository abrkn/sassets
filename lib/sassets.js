var path = require('path')
, async = require('async')
, _ = require('underscore')
, fs = require('fs');

var sassets = module.exports = {
    combine: function(assets, callback) {
        async.map(assets, sassets.load, function(err, res) {
            if (err) return callback(err);
            callback(null, _.reduce(res, function(a, b) { return a + b }));
        });
    },

    load: function(asset, callback) {
        var type = asset.type || (asset.path && asset.path.match(/\.([^\.]+)$/)[1]);
        sassets[type](asset, callback);
    },

    raw: function(asset, callback) {
        callback(null, asset.content);
    },

    file: function(asset, callback) {
        fs.readFile(asset.path, 'utf8', callback);
    },

    css: function(asset, callback) {
        sassets.file(asset, callback);
    },

    browserify: function(asset, callback) {
        var b = require('browserify')(asset.path);
        asset.content = b.bundle();
        sassets.js(asset, callback);
    },

    js: function(asset, callback) {
        if (!asset.content) {
            return sassets.file(asset, function(err, res) {
                if (err) return callback(err);
                asset.content = res;
                sassets.js(asset, callback);
            });
        }

        if (asset.uglify) {
            asset.uglify = false;
            
            var uglify = require('uglify-js');
            var jsp = uglify.parser;
            var pro = uglify.uglify;

            var ast = jsp.parse(asset.content); // parse code and get the initial AST
            ast = pro.ast_mangle(ast); // get a new AST with mangled names
            ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
            var final_code = pro.gen_code(ast); // compressed code here
            callback(null, final_code);
        } else {
            callback(null, asset.content);
        }
    },

    less: function(asset, callback) {
        sassets.file(asset, function(err, res) {
            if (err) return callback(err);
            require('less').render(res, callback);
        });
    }
};