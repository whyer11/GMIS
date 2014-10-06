/**
 * Created by wanghuanyu on 14-10-6.
 */
module.exports = function (req, res) {
    req.models.gom_apps.find(['APP_ID','A'], function (err, appcols) {
        if(err){
            /**
             *  处理err
             */
        }else{
            res.render('app_manage',{
                title:'APP管理器',
                app_info:appcols
            });
            res.end();
        }
    })

};