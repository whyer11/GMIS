/**
 * Created by wanghuanyu on 14-10-6.
 */
module.exports = function (req, res) {
    var j = 0;
    console.log(req.body);

    req.models.gom_appclses.find({APP_ID:req.body.appid,CLS_ID:req.body.gom_clsid[0]}, function (err,data) {
        console.log(data[0].CLS_ID);
        data[0].remove(function (error) {
            console.log(error)
        })
    })

    /*
    req.models.gom_appclses.count({APP_ID:req.body.appid}, function (err, count) {
        req.models.gom_appclses.find({APP_ID:req.body.appid}).each(function (appcls) {

            j++;
            //console.log(appcls.CLS_ID);
            for(var i = 0;i<req.body.gom_clsid.length;i++){
                if(appcls.CLS_ID == req.body.gom_clsid[i]){
                    //console.log(appcls.CLS_ID);


                    appcls.remove(function (err) {
                        console.log(appcls.CLS_ID);
                        if(err){
                            res.json({success:false,err:err,node:req.body.gom_clsid[i]});
                            res.end();
                        }else if(count == j){
                            res.json({success:true,err:null,node:null});
                            res.end();
                        }
                    })

                }
            }
        })
    })
    */
};