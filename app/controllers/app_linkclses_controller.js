/**
 * Created by wanghuanyu on 14-10-6.
 */
module.exports = function (req, res) {
    var i = 0;
    console.log(req.body);
    var linkClass = function () {
        req.models.gom_appclses.create({
            CLS_ID:req.body.gom_clsid[i],
            APP_ID:req.body.appid,
            IS_WEAK:'F'
        }, function (err, item) {
            if(err){
                console.error(err);
                res.json({success:false,err:err,node:req.body.gom_clsid[i]});
                res.end();
            }else if(i == req.body.gom_clsid.length-1){
                res.json({success:true,err:null,node:null});
                res.end();
            }else{
                i++;
                return linkClass();
            }
        })
    };
    linkClass();
};