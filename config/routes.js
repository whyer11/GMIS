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
    app.get('/add_child_classes', controllers.addclses);
    app.post('/users_signin', controllers.userssignin);
    app.post('/delclass.json', controllers.delclass);
    app.post('/alterclass', controllers.alterclass);
    app.get('/app_index', controllers.appindex);
    app.get('/app/:app_id/view', controllers.appview);
    app.post('/app_display.json', controllers.appdisplay);
    app.post('/app_render_node_info.json', controllers.apprendernode);
    app.post('/app_rightclick.json', controllers.apprightclick);
    app.post('/app_addobj.json',controllers.appaddobj);
    app.post('/app_delobj.json',controllers.appdelobj);
    app.post('/app_render_add_obj_form.json',controllers.apprenderaddobj);
    app.get('/clslinks_view',controllers.clslinksview);
    app.post('/clslinks_linked',controllers.clslinkslinked);
    app.post('/clslinks_linkclses',controllers.clslinkslinkclses);
};