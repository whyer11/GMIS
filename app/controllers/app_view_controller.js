/**
 * Created by whyer on 14-3-24.
 */
var EventProxy = require('eventproxy');
var ep = new EventProxy();
module.exports = function (req, res) {
    var appId = req.params.app_id;
    var gom_apps = req.models.gom_apps;
    gom_apps.get(appId, function (err, app) {
        res.render('app_view', {
            title: app.APP_NAME,
            appid: appId,
            appname: app.APP_NAME
        })
        res.end();
    })

};