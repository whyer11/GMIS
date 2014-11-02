/**
 * Created by wanghuanyu on 14-10-15.
 */
module.exports = function (req, res) {
    console.log(req.body);
    req.models.gom_appclses.count({APP_ID:req.body.appid}, function (err,count) {
        if(err){
            req.db.driver.close();
            res.send(200,{success:false,err:err});
        }else if(count == 0){
            req.models.gom_apps.get(req.body.appid, function (err, app) {
                if(err){
                    req.db.driver.close();
                    res.send(200,{success:false,err:err});
                }else{
                    app.remove(function (err) {
                        if(err){
                            req.db.driver.close();
                            res.send(200,{success:false,err:err});
                        }else{
                            req.db.driver.close();
                            res.send(200,{success:true,err:null});
                        }
                    })
                }
            })
        }else{
            req.db.driver.close();
            res.send(200,{success:false,err:'务必删除所有与此App连接的类型!'});
        }
    })
};