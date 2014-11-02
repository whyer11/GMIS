/**
 * Created by wanghuanyu on 14-9-30.
 */
var opt_db = require('../middleware/opt_db');
var eventproxy = require('eventproxy');
var ep = new eventproxy();
module.exports = function (req, res) {
    var linkedClses = [];
    var i = 0;
    req.models.gom_clslinks.find({CLS_ID:req.body.id}, function (err, clslinkcols) {
        if(clslinkcols.length!=0) {
            checkGomClses(clslinkcols);
            ep.all('$ReturnLinkedClass', function (data) {
                req.models.gom_clses.find(['CLS_ID','Z'], function (err, clscols) {
                    splitClass(data,clscols,function(linked,unlinked){
                        req.db.driver.close();
                        return res.send(200,{linked:linked,unlinked:unlinked});
                    })
                })

            })
        }else{
            /**
             * TODO 未找到一个已连接的class时
             */
            req.models.gom_clses.find(['CLS_ID','Z'], function (err, clscols) {
                req.db.driver.close();
                return res.send(200,{linked:linkedClses,unlinked:clscols});
            })
        }
    });
    function checkGomClses (clslinkcols) {
        if(clslinkcols[i] != undefined) {
            opt_db.checkClass(req, clslinkcols[i].GOM_CLS_ID, function (err, clscol) {
                linkedClses[i] = clscol;
                i++;
                return checkGomClses(clslinkcols);
            })
        }else{
            ep.emit('$ReturnLinkedClass',linkedClses);
        }
    }

    function splitClass (linked,all,cb) {
        var unLinkedClses = [];
        var index=0;
        for(var i = 0;i<linked.length;i++){
            for(var j = 0;j<all.length;j++){
                if(all[j] != null) {
                    if (all[j].CLS_ID == linked[i].CLS_ID) {
                        all[j] = null;
                    }
                }
            }
        }
        for(var i =0;i<all.length;i++){
            if(all[i]!=null){
                unLinkedClses[index] = all[i];
                index++;
            }
        }
        return cb(linked,unLinkedClses);
    }
};