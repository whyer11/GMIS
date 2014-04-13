/**
 * Created by whyer on 14-4-3.
 */
var EventProxy = require('eventproxy');
var ep = new EventProxy();
module.exports = function (req, res) {
    var appid = req.body.appid;
    var models = {
        gom_appclses: req.models.gom_appclses,
        gom_insts: req.models.gom_insts,
        gom_refs: req.models.gom_refs
    }
    var refs = [];
    var allnum = 0;
    models.gom_appclses.find({APP_ID: appid}).each(function (appcol) {
        models.gom_insts.find({CLS_ID: appcol.CLS_ID}).each(function (instcol) {
            models.gom_refs.find({INST_ID: instcol.INST_ID}).count(function (err, num) {
                allnum += num;
                models.gom_refs.find({INST_ID: instcol.INST_ID}).each(function (refcol) {
                    models.gom_insts.get(refcol.INST_ID, function (err, inst) {
                        refcol.REF_NAME = inst.INST_NAME;
                        refcol.REF_CLS_ID = inst.CLS_ID;
                        refs.push(refcol);
                        if (allnum == refs.length) {
                            //console.log(refs);
                            res.json(refs);
                            res.end();
                        }
                    });
                });
            });
        });
    });
}