/**
 * Created by whyer on 14-2-28.
 */
module.exports = function (req, res) {
    var gom_users = req.models.gom_users;
    var form = req.body;
    console.log(form.userid + '  ' + form.password);
    gom_users.find({USER_ID: form.userid, PWD: form.password}).count(function (err, data) {
        console.log(data);
        if (data == 1) {
            res.render('platform_index', {
                title: '平台主页'
            });
            res.end();
        } else {
            res.render('index', {
                title: '主页'
            });
            res.end();
        }
    })
}