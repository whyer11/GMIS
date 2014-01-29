/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    orm = require('orm'),
    settings = require('./config/settings'),
    environment = require('./config/environment'),
    routes = require('./config/routes');
    //models = require('./app/models/');


var app = express();
//配置环境和路由
environment(app);
routes(app);
app.set('view engine','jade');

http.createServer(app).listen(settings.port, function () {
    console.log('Express server listening on port ' + settings.port);
});



