/**
 * Created by whyer on 14-1-29.
 */
var controllers = require('../app/controllers');

module.exports = function (app) {
    app.get('/', controllers.home);
    app.get('/add_classes', controllers.addclses);
    app.post('/add_class_name', controllers.addclsesname);
};