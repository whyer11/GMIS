/**
 * Created by wanghuanyu on 14-10-6.
 */
var opt_db = require('../middleware/opt_db'),
    eventproxy = require('eventproxy'),
    ep = new eventproxy();
module.exports = function (req, res) {
    var linkedClses = [];
    var i = 0;
    req.models.gom_appclses.find({APP_ID:req.body.appid}, function (err, appclscol) {
        if(appclscol.length != 0){
            checkGomClses(appclscol);
            ep.all('$ReturnLinkedClass', function (data) {

                req.models.gom_clses.find(['CLS_ID','Z'], function (err, clscols) {
                    splitClass(data,clscols, function (linked, unlinked) {
                        req.db.driver.close();
                        return res.send(200,{linked:linked,unlinked:unlinked});
                    })
                })
            })
        }else{
            req.models.gom_clses.find(['CLS_ID','Z'], function(err,clscols){
                req.db.driver.close();
                return res.send(200,{linked:linkedClses,unlinked:clscols});
            })
        }
    });

    function checkGomClses (appclscols) {
        if(appclscols[i] != undefined){
            opt_db.checkClass(req,appclscols[i].CLS_ID, function (err,clscol) {
                linkedClses[i] = clscol;
                i++;
                return checkGomClses(appclscols);
            })
        }else{
            ep.emit('$ReturnLinkedClass',linkedClses);
        }
    }

    function splitClass (linked,all,cb) {
        var unLinkedClses = [];
        var index = 0;
        for (var i = 0; i < linked.length; i++) {
            for (var j = 0; j < all.length; j++) {
                if (all[j] != null) {
                    if (all[j].CLS_ID == linked[i].CLS_ID) {
                        all[j] = null;
                    }
                }
            }
        }
        for (var i = 0; i < all.length; i++) {
            if (all[i] != null) {
                unLinkedClses[index] = all[i];
                index++;
            }
        }
        return cb(linked, unLinkedClses);
    }
};