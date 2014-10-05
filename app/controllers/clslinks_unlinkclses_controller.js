/**
 * Created by wanghuanyu on 14-10-5.
 */
module.exports = function (req, res) {
    var j = 0;
    req.models.gom_clslinks.count({CLS_ID:req.body.clsid},function (err,count) {
        console.log(count);
        req.models.gom_clslinks.find({CLS_ID:req.body.clsid}).each(function (linkcls) {
            j++;
            for(var i = 0;i<req.body.gom_clsid.length;i++){
                if(linkcls.GOM_CLS_ID == req.body.gom_clsid[i]){
                    linkcls.remove(function (err) {
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
            console.log(j);
        })
    })
}