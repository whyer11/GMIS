/**
 * Created by whyer on 14-1-29.
 */
var controllers = require('../app/controllers');

module.exports = function (app) {
    app.get('/', controllers.home);
    app.get('/add_classes', controllers.addclses);
    app.post('/add_class_name.json', controllers.addclsesname);
    app.get('/display_class_name.json', controllers.displayclsesname);
    app.post('/render_current_node.json', controllers.rendercurrentnode);
    app.post('/add_child_classes', controllers.addclsesname);
    app.post('/users_signin', controllers.userssignin);
    app.post('/delclass.json', controllers.delclass);
    app.post('/alterclass', controllers.alterclass);
    app.get('/app_index', controllers.appindex);
};