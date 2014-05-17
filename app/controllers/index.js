/**
 * Created by whyer on 14-1-29.
 */
module.exports = {
    home: require('./home_controller'),
    addclses: require('./addclses_main_controller'),
    addclsesname: require('./addclses_add_controller'),
    displayclsesname: require('./addclses_display_controller'),
    rendercurrentnode: require('./addclses_renderNodeInfo_controller'),
    userssignin: require('./users_signin_controller'),
    delclass: require('./addclses_del_controller'),
    alterclass: require('./addclses_alter_controller'),
    appindex: require('./app_main_controller'),
    appview: require('./app_view_controller'),
    appdisplay: require('./app_renderTreeView_controller'),
    apprendernode: require('./app_renderTreeNodeInfo_controller'),
    apprightclick: require('./app_rightClick_controller'),
    appaddobj:require('./app_addObject_controller')
};