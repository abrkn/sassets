var path = require('path')
, fs = require('fs');

var assets = module.exports = {
    load: function(asset, callback) {
        var type = asset.type || (asset.path && asset.path.match(/\.([^\.]+)$/)[1]);
        assets[type](asset, callback);
    },

    raw: function(asset, callback) {
        callback(null, asset.content);
    },

    file: function(asset, callback) {
        fs.readFile(asset.path, 'utf8', callback);
    },

    css: function(asset, callback) {
        assets.file(asset, callback);
    },

    browserify: function(asset, callback) {
        var b = require('browserify')(asset.path);
        callback(null, b.bundle());
    },

    js: function(asset, callback) {
        assets.file(asset, callback);
    },

    less: function(asset, callback) {
        assets.file(asset, function(err, res) {
            if (err) return callback(err);
            require('less').render(res, callback);
        });
    }
};