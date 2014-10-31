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
    app.post('/clslinks_unlinkclses',controllers.clslinksunlinkclses);
    app.get('/app_manager',controllers.appmanager);
    app.post('/app_clslinks',controllers.appclslink);
    app.post('/app_linkclses',controllers.applinkclses);
    app.post('/app_unlinkclses',controllers.appunlinkclses);
    app.get('/app_createapps',controllers.createapp);
    app.post('/app_finishcreate',controllers.finishcreateapp);
    app.post('/app_del.json',controllers.appdel);
    app.post('/app_alertname.json',controllers.appaltername);
    app.post('/app_alterobj.json',controllers.appalterobj);
    app.post('/app_savealter.json',controllers.appsavealteredobj);
    app.get('/app_weakclass',controllers.appisweak);
    app.post('/app_weakclassview',controllers.appisweakview);
    app.post('/app_tobewors',controllers.apptobeweakorstrong);
    app.get('/grantor_create_view',controllers.grantor.createGrantor_view);
    app.get('/grantors_create_view',controllers.grantor.createGrantors_view);
    app.get('/grantor_manage_view',controllers.grantor.manageGrantor_view);
    app.post('/grantor_create',controllers.grantor.createGrantor);
    app.post('/show_have_unhave',controllers.grantor.showhau);
    app.post('/have_or_unhave',controllers.grantor.haveorunhave);
    app.get('/grantor_app_view',controllers.grantor.grantorApp_view);
    app.post('/show_allgrantors',controllers.grantor.showgrantors);
    app.post('/show_aau',controllers.grantor.showAuthedApp);
    app.post('/authed_or_unauthed',controllers.grantor.authedorunauthed);
};