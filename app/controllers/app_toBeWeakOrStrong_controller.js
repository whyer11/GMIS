/**
 * Created by wanghuanyu on 14-10-23.
 */
module.exports = function (req, res) {
    req.db.driver.execQuery("UPDATE `gmis`.`gom_appclses` SET `IS_WEAK`='"+req.body.IS_WEAK+"' WHERE `CLS_ID`='"+req.body.clsid+"' and`APP_ID`='"+req.body.appid+"';", function (err, result) {
        if(err){
            console.log(err);
            req.db.driver.close();
            return res.send(200,{success:false,err:err});
        }else{
            req.db.driver.close();
            return res.send(200,{success:true,err:null});
        }
    })
};