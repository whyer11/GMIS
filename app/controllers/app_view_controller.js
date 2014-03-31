/**
 * Created by whyer on 14-3-24.
 */
module.exports = function (req, res) {
    var appId = req.params.app_id;
    var gom_appclses = req.models.gom_appclses;
    gom_appclses.get(appId, function (err, app) {
        console.log(app.CLS_ID);
    });
    res.render('app_view', {
        title: 'title'
    })
    res.end();
};