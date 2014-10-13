/**
 * Created by whyer on 14-1-29.
 */


module.exports = function (req, res, next) {
    return res.render('index', {
        title: '动态建模平台'
    });
};