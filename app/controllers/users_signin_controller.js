/**
 * Created by whyer on 14-2-28.
 */
module.exports = function (req, res) {
    var gom_users = req.models.gom_users;
    var form = req.body;
    console.log(form.userid + '  ' + form.password);
    gom_users.find({USER_ID: form.userid, USER_PWD: form.password}).count(function (err, data) {
        if (data == 1) {
            gom_users.find({USER_ID: form.userid, USER_PWD: form.password}, function (err, user) {
                if(user[0].USER_ROLE == 'root'){
                    return res.render('platform_index', {
                        title: '平台主页'
                    });
                }else{
                    return res.render('platform_user',{
                        title:'平台主页'
                    });
                }
            });
        } else {
            return res.render('index', {
                title: '主页'
            });
        }
    })
};