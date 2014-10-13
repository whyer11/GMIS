/**
 * Created by whyer on 14-3-20.
 */
module.exports = function (req, res) {
    var gom_apps = req.models.gom_apps;
    gom_apps.find(['APP_ID', 'A'], function (err, data) {
        return res.render('app_index', {
            title: 'app_index',
            appinfo: data
        });
    })
};