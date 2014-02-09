/**
 * Created by whyer on 14-2-9.
 */
module.exports = function (req, res, err) {
    var gom_clses = req.models.gom_clses;
    var rootClass;
    gom_clses.find({CLS_ID: 0}, function (err, data) {
        console.log(data[0].CLS_NAME);
        rootClass = data[0].CLS_NAME.toString();
    });
    res.render('add_classes', {
        title: '添加类型',
        rootClass: rootClass
    });
};