/**
 * Created by whyer on 14-4-3.
 */
var EventProxy = require('eventproxy');
var ep = new EventProxy();
module.exports = function (req, res) {
    var appId = req.body.appid;
    console.log(appId);
    var models = {
        gom_appclses: req.models.gom_appclses,
        gom_apps: req.models.gom_apps,
        gom_clslinks: req.models.gom_clslinks,
        gom_refs: req.models.gom_refs,
        gom_clses: req.models.gom_clses,
        gom_insts: req.models.gom_insts
    }
    var clscols = [];
    var count = 0;
    models.gom_appclses.find({APP_ID: appId}, function (err, apps) {
        checkcls(apps, count);
    });
    ep.all('pushover', function (data) {
        res.json({data: clscols});
        res.end();
    })
    function checkcls(apps, i) {
        if (i == apps.length) {
            ep.emit('pushover', i);
        } else {
            models.gom_clses.get(apps[i].CLS_ID, function (err, cls) {
                clscols.push(cls);
                i++;
                checkcls(apps, i);

            })
        }
    }
};