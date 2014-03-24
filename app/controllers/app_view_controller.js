/**
 * Created by whyer on 14-3-24.
 */
module.exports = function (req, res) {
    var appId = req.params.app_id;
    res.render('app_view', {
        title: appId
    });
    res.end();
};