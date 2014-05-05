/**
 * Created by whyer on 14-4-3.
 */
module.exports = function (req, res) {
    var appid = req.body.appid;
    var models = {
        gom_appclses: req.models.gom_appclses,
        gom_insts: req.models.gom_insts,
        gom_refs: req.models.gom_refs,
        gom_apps: req.models.gom_apps
    }
    var refs = [];
    var allnum = 0;
    /*
    models.gom_appclses.find({APP_ID: appid}).each(function (appcol) {
        models.gom_insts.find({CLS_ID: appcol.CLS_ID}).each(function (instcol) {
            models.gom_refs.find({INST_ID: instcol.INST_ID}).count(function (err, num) {
                allnum += num;
                models.gom_refs.find({INST_ID: instcol.INST_ID}).each(function (refcol) {
                    models.gom_insts.get(refcol.INST_ID, function (err, inst) {
                        refcol.REF_NAME = inst.INST_NAME;
                        refcol.REF_INST_ID = inst.INST_ID;
                        refcol.REF_CLS_ID = inst.CLS_ID;
                        refs.push(refcol);
                        if (allnum == refs.length) {
                            console.log(refs);
                            res.json(refs);
                            res.end();
                        }
                    });
                });
            });
        });
    });
    */
    console.log(appid);
    models.gom_apps.get(appid,function(err,appcol){
        console.log(appcol);
        checkallrefs(appcol.REF_ID);
        //console.log(refs);
    })
    function checkallrefs(pid){
        models.gom_refs.find({PARENT_REF_ID:pid}).count(function(err,count){
            if(count != 0){
                models.gom_refs.find({PARENT_REF_ID:pid}).each(function(ref){
                    if(typeof (ref) == 'undefined'){
                        return 0;
                    }else{
                        console.log(ref.REF_ID);
                        checkallrefs(ref.REF_ID);
                        /*
                        models.gom_insts.find({INST_ID:ref.INST_ID},function(err,inst){
                            ref.REF_NAME = inst[0].INST_NAME;
                            ref.REF_INST_ID = inst[0].INST_ID;
                            ref.REF_CLS_ID = inst[0].CLS_ID;
                            //console.log(ref);
                            refs.push(ref);
                            checkallrefs(ref.REF_ID)
                        })
                         *//////
                    }
                })
            }
        })
    }
    res.end();

}