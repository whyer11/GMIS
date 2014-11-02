/**
 * Created by wanghuanyu on 14-10-23.
 */
module.exports = function (req, res) {
    req.db.driver.execQuery("SELECT * FROM gmis.gom_appclses where APP_ID = '"+req.body.appid+"'; ", function (err, result) {
        var strongCls = [];
        var weakCls = [];
        var allclsid = [];
        var weaker = [];
        for(var i = 0;i<result.length;i++){
            allclsid[i] = result[i].CLS_ID;
            weaker[i] = result[i].IS_WEAK;
        }
        req.models.gom_clses.find({CLS_ID:allclsid}, function (err, clscols) {
            for(var  i = 0;i<clscols.length;i++){
                if(weaker[i] == 'F'){
                    strongCls.push(clscols[i]);
                }else{
                    weakCls.push(clscols[i])
                }
            }
            req.db.driver.close();
            return res.send(200,{strong:strongCls,weak:weakCls});
        })
    })
};