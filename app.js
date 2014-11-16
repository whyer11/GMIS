/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    orm = require('orm'),
    settings = require('./config/settings'),
    environment = require('./config/environment'),
    routes = require('./config/routes'),
    models = require('./app/models/');


var app = express();




//配置环境和路由
environment(app);
routes(app);



//由于视图引擎无法在settings文件中定义，只能再拿出来
app.set('view engine', 'jade');



http.createServer(app).listen(settings.port, function () {
    console.log('Express server listening on port ' + settings.port);
});



