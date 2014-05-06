/**
 * Created by whyer on 14-4-23.
 */
var EventProxy = require('eventproxy');
var ep = new EventProxy();
module.exports = function (req, res) {
    //console.log(req.body.clsid+'clsid');
    req.models.gom_clslinks.find({GOM_CLS_ID: req.body.clsid}, function (err, clses) {
        //console.log(clses);
        ep.emit('clslink', clses);
    });
    req.models.gom_appclses.find({APP_ID: req.body.appid}, function (err, appcls) {
        //console.log(appcls);
        ep.emit('appcls', appcls);
    })
    ep.all('clslink', 'appcls', function (clslink, appcls) {
        var clses = [];
        for (var i = 0; i < clslink.length; i++) {
            for (var j = 0; j < appcls.length; j++) {
                if (clslink[i].CLS_ID == appcls[j].CLS_ID) {
                    clses.push(appcls[j].CLS_ID);
                }
            }
        }
        console.log(clses);
        req.models.gom_clses.find({CLS_ID: clses}, function (err, cls) {
            res.json(cls);
            res.end();
        })


    });
}