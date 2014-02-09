/**
 * Created by whyer on 14-1-29.
 */
var path = require('path'),
    express = require('express'),
    settings = require('./settings'),
    models = require('../app/models/');

module.exports = function (app) {
    app.configure(function () {
        app.use(express.static(path.join(settings.path, 'public')));
        app.use(express.favicon());
        app.use(express.logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded());
        app.use(express.methodOverride());
        app.use(function (req, res, next) {
            models(function (err, db) {
                if (err) {
                    return next(err);
                }
                req.models = db.models;
                req.db = db;
                return next();
            });
        });
        app.use(app.router);
    });
}