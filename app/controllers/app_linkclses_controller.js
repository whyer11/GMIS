/**
 * Created by wanghuanyu on 14-10-6.
 */
module.exports = function (req, res) {
    var i = 0;
    var linkClass = function () {
        req.models.gom_appclses.create({
            CLS_ID:req.body.gom_clsid[i],
            APP_ID:req.body.appid,
            IS_WEAK:'F'
        }, function (err, item) {
            if(err){
                console.error(err);
                req.db.driver.close();
                return res.send(200,{success:false,err:err,node:req.body.gom_clsid[i]});
            }else if(i == req.body.gom_clsid.length-1){
                req.db.driver.close();
                return res.send(200,{success:true,err:null,node:null});
            }else{
                i++;
                return linkClass();
            }
        })
    };
    linkClass();
};