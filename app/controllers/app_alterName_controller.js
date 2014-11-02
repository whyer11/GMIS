/**
 * Created by wanghuanyu on 14-10-15.
 */
module.exports = function (req, res) {
    req.models.gom_apps.get(req.body.appid, function (err, app) {
        console.log(req.body.appname);
        app.APP_NAME = req.body.appname;
        app.save(function (err) {
            if(err){
                req.db.driver.close();
                res.send(200,{success:false,err:err});
            }else{
                req.db.driver.close();
                res.send(200,{success:true,err:null});
            }
        })
    })
};