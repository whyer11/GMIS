/**
 * Created by wanghuanyu on 14-10-14.
 */
var EventProxy = require('eventproxy');
var ep = new EventProxy();
module.exports = function (req, res) {
    req.models.gom_apps.find(['APP_ID','Z'], function (err,appcols) {
        var newAppId = appcols[0].APP_ID+1;
        ep.emit('$ReturnNewAppId',newAppId);
    });
    ep.all('$ReturnNewAppId', function (appid) {
        req.models.gom_apps.create({
            APP_ID:appid,
            REF_ID:req.body.refid,
            APP_NAME:req.body.appname
        }, function (err, item) {
            if(err){
                req.db.driver.close();
                return res.send(200,{success:false,err:err});
            }else{
                req.models.gom_appclses.create({
                    CLS_ID:req.body.clsid,
                    APP_ID:item.APP_ID,
                    IS_WEAK:'F'
                }, function (err, item) {
                    if(err){
                        req.db.driver.close();
                        return res.send(200,{success:false,err:err});
                    }else{
                        req.db.driver.close();
                        return res.send(200,{success:true,err:null});
                    }
                });
            }
        })
    })
};