/**
 * Created by whyer on 14-3-24.
 */
var EventProxy = require('eventproxy');
var ep = new EventProxy();
module.exports = function (req, res) {
    var appId = req.params.app_id;
    var gom_appclses = req.models.gom_appclses;
    var gom_apps = req.models.gom_apps;
    var gom_clslinks = req.models.gom_clslinks;
    var gom_refs = req.models.gom_refs;
    var gom_clses = req.models.gom_clses;
    var gom_insts = req.models.gom_insts;
    gom_apps.get(appId, function (err, app) {
        gom_refs.get(app.REF_ID, function (err, ref) {
            gom_insts.get(ref.INST_ID, function (err, inst) {

            })
        })
    })
    res.render('app_view', {
        title: 'title'
    })
    res.end();
};