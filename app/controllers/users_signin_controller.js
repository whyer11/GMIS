/**
 * Created by whyer on 14-2-28.
 */
var EventProxy = require('eventproxy');
var ep = new EventProxy();
module.exports = function (req, res) {
    if(req.body.userid == 'ROOT'){
        return res.render('platform_index',{
            title:'管理员'
        })
    }else {
        req.models.gom_ac_grantors.find({
            GRANTOR_NAME: req.body.userid,
            USER_PWD: req.body.password
        }, function (err, grantor) {
            /**
             * 查找当前用户的授权APP
             *
             */
            if (err) {
                console.log(err);
            } else if (grantor.length == 0) {
                return res.render('index', {
                    title: '无此用户,重新登录',
                    err: '用户名或密码错误,请重新登录'
                })
            } else {
                var allgrantors = [];
                allgrantors.push(grantor[0].GRANTOR_ID);
                var checkAllGrantors = function (userganid) {
                    req.models.gom_ac_groupusers.find({GRANTOR_ID: userganid}, function (err, grantors) {
                        if (err) {
                            console.log(err);
                        } else if (grantors.length == 0) {
                            ep.emit('$CheckGrantorsEnd', allgrantors);
                        } else {
                            var nextid = [];
                            for (var i = 0; i < grantors.length; i++) {
                                nextid.push(grantors[i].GOM_GRANTOR_ID);
                                allgrantors.push(grantors[i].GOM_GRANTOR_ID);
                            }
                            return checkAllGrantors(nextid);
                        }
                    })
                };
                checkAllGrantors(grantor[0].GRANTOR_ID);


                ep.all('$CheckGrantorsEnd', function (data) {
                    req.models.gom_ac_appacis.find({GRANTOR_ID: data}, function (err, appaciscols) {
                        if (err) {

                        } else {
                            var _appidtemp = [];
                            for (var i = 0; i < appaciscols.length; i++) {
                                _appidtemp[i] = appaciscols[i].APP_ID;
                            }
                            req.models.gom_apps.find({APP_ID: _appidtemp}, function (err, appcols) {
                                if (err) {

                                } else {
                                    return res.render('platform_user', {
                                        title: '我的应用中心',
                                        apps: appcols
                                    });
                                }
                            })
                        }
                    })
                })
            }
        })
    }
};