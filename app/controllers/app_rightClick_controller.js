/**
 * Created by whyer on 14-4-23.
 */
var EventProxy = require('eventproxy');
var ep = new EventProxy();
module.exports = function (req, res) {
    //console.log(req.body);
    req.models.gom_clslinks.find({CLS_ID: req.body.clsid}, function (err, clses) {
        ep.emit('clslink', clses);
    });
    req.models.gom_appclses.find({APP_ID: req.body.appid}, function (err, appcls) {
        ep.emit('appcls', appcls);
    });
    ep.all('clslink', 'appcls', function (clslink, appcls) {
        var clses = [];
        for (var i = 0; i < clslink.length; i++) {
            for (var j = 0; j < appcls.length; j++) {
                if (clslink[i].GOM_CLS_ID == appcls[j].CLS_ID) {
                    clses.push(appcls[j].CLS_ID);
                }
            }
        }
        req.models.gom_clses.find({CLS_ID: clses}, function (err, cls) {
            req.models.gom_appclses.find({CLS_ID:clses,APP_ID:req.body.appid}, function (err, appcls) {
               for(var i = 0;i<cls.length;i++){
                   for(var j = 0;j<appcls.length;j++){
                       if(cls[i].CLS_ID == appcls[j].CLS_ID){
                           cls[i].IS_WEAK = appcls[j].IS_WEAK;
                       }
                   }
               }
            return res.send(200,cls);
            });



        });
    });
};