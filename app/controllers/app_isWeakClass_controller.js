/**
 * Created by wanghuanyu on 14-10-23.
 */
module.exports = function (req, res) {
    req.models.gom_apps.find(['APP_ID','A'], function (err, appcols) {
        if(err){
            req.db.driver.close();
            return res.render('500',{
                title:'服务器出错~~啦啦啦'
            })
        }else{
            req.db.driver.close();
            return res.render('app_is_weak_class',{
                title:'强弱类型关联',
                app_info:appcols
            });
        }
    })
};