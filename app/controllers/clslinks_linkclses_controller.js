/**
 * Created by wanghuanyu on 14-10-5.
 */
module.exports = function (req, res) {
    console.log(req.body);
    var i = 0;
    var linkClass = function () {
        req.models.gom_clslinks.create({
            CLS_ID:req.body.clsid,
            GOM_CLS_ID:req.body.gom_clsid[i],
            LINK_TYPE:'L'
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