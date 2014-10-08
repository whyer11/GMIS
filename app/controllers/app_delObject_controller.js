/**
 * Created by whyer on 14-5-29.
 */
var maps = require('../middleware/models_maps'),
    EventProxy = require('eventproxy'),
    ep = new EventProxy();
module.exports = function (req, res) {
    console.log(req.body);
    /**
     * 首先判断是否为叶子对象
     * 判断原则:该节点不为其他节点的父节点
     * 1.遍历ref表中全部行
     * 2.逐个判断是否为其父节点
     * 3.没有则删除该引用
     * 4.不需要删除对象数据
     */

    req.models.gom_refs.find(['REF_ID','A'], function (err, allrefs) {
       if(err){
           console.error(err);
           res.json({success:false,err:err});
           res.end();
       }else{
           for(var i = 0;i<allrefs.length;i++){
               if(req.body.id == allrefs[i].PARENT_REF_ID) {
                   res.json({success: false, err: '只能删除叶子对象'});
                   res.end();
                   break;
               }
           }
           req.models.gom_refs.get(req.body.id, function (err, ref) {
               if(err){
                   console.error(err);
                   res.json({success:false,err:err});
                   res.end();
               }else{
                   ref.remove(function (err) {
                       if(err){
                           console.error(err);
                           res.json({success:false,err:err});
                           res.end();
                       }else{
                           res.json({success:true,err:null});
                           res.end();
                       }
                   })
               }
           })
       }
    });


    /*
    //console.log(req.body);
    checkParentsClass(req.body.clsid,req.body.instid);
    function checkParentsClass (clsid,instid) {
        req.models.gom_clses.get(clsid, function (err, clscols) {
                maps.modelsmaps(req,clscols.CLS_TAB_NAME).get(instid, function (err, col) {
                    if(clsid == 0){
                        req.models.gom_refs.get(req.body.id, function (err,refcol) {
                            refcol.remove(function (err) {
                                if(err){
                                    console.error(err);
                                }else{
                                    col.remove(function (err) {
                                        if(err){
                                            console.error(err);
                                        } else{
                                            res.end();
                                        }

                                    })
                                }
                            })
                        })
                    }else{
                        col.remove(function (err) {
                            if(err){
                                console.error(err);
                            }else{
                                checkParentsClass(clscols.PARENT_CLS_ID,instid);
                            }
                        })

                    }

                })
        })
    }
    */
};