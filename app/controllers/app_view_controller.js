/**
 * Created by whyer on 14-3-24.
 */
module.exports = function (req, res) {
    var appId = req.params.app_id;
    console.log(req.params);
    var gom_apps = req.models.gom_apps;
    gom_apps.get(appId, function (err, app) {
        req.db.driver.close();
        return res.render('app_view', {
            title: app.APP_NAME,
            appid: appId,
            appname: app.APP_NAME
        });
    })
};