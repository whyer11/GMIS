/**
 * Created by wanghuanyu on 14-10-14.
 */
module.exports = function (req, res) {
    var ref = {};
    var i = 0;
    req.models.gom_refs.count(function (err,count) {
        req.models.gom_refs.find(['REF_ID','A']).each(function (refcol) {
            req.models.gom_insts.get(refcol.INST_ID, function (err, instcol) {
                if(err){
                    console.error(err);
                    req.db.driver.close();
                    return res.render('500',{
                        title:'服务器出错啦',
                        err:err
                    });

                }else{
                    instcol.REF_ID=refcol.REF_ID;
                    ref[refcol.REF_ID] = instcol;
                    i++;
                    if(count == i){
                        req.db.driver.close();
                        return res.render('app_create',{
                            title:'创建一个App',
                            ref:ref
                        });
                    }
                }
            })
        });
    });
};