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
    appaddobj:require('./app_addObject_controller'),
    appdelobj:require('./app_delObject_controller'),
    apprenderaddobj:require('./app_renderAddObjectForm_controller'),
    clslinksview:require('./clslinks_view_controller'),
    clslinkslinked:require('./clslinks_linked_controller'),
    clslinkslinkclses:require('./clslinks_linkclses_controller'),
    clslinksunlinkclses:require('./clslinks_unlinkclses_controller'),
    appmanager:require('./app_mange_controller'),
    appclslink:require('./app_clslinks_controller'),
    applinkclses:require('./app_linkclses_controller'),
    appunlinkclses:require('./app_unlinkclses_controller')
};