/**
 * Created by wanghuanyu on 14-10-23.
 */
var opt_db = require('../middleware/opt_db');
var maps = require('../middleware/models_maps');
module.exports = function (req, res) {
    console.log(req.body);
    /**
     * 修改某个引用的具体信息
     *
     */
    opt_db.checkRef(req,req.body.refid, function (err,refcol) {
       if(err){
           return res.send(200,{success:false,err:'无此引用'});
       }else{
           alterInst(refcol.INST_ID,req.body.clsid);
       }
    });
    var alterInst = function (instid,nextclsid) {
        opt_db.checkClass(req,nextclsid, function (err, clscol) {
            req.models.gom_props.find({CLS_ID:nextclsid}, function (err, propcols) {
                var prop = {
                    INST_ID:instid

                };
                for(val in req.body.props){
                    for(var i =0;i<propcols.length;i++){
                        //console.log(propcols[i].PROP_COL)
                        if(val == '_'+propcols[i].PROP_COL){
                            prop[propcols[i].PROP_COL] =req.body.props[val];
                        }
                    }
                }
                var genProp = function (clsid) {
                    if(clsid == 0){
                        prop.STATE_ID=0;
                        prop.INSTACP_ID=0;
                        prop.CLS_ID=req.body.clsid;
                        return prop;
                    }else{
                        return prop;
                    }
                };
                maps.modelsmaps(req,clscol.CLS_TAB_NAME).get(instid, function (err, col) {
                    if(err){
                        return res.send(200,{success:false,err:err});
                    }else{
                        col.save(genProp(nextclsid),function (err) {
                            if(err){
                                console.log(err);
                                return res.send(200,{success:false,err:err});
                            }else{
                                if(clscol.CLS_ID == 0){
                                    return res.send(200,{success:true,err:null});
                                }else{
                                    return alterInst(instid,clscol.PARENT_CLS_ID);
                                }
                            }
                        });
                    }
                })



            })
        })
    }
};