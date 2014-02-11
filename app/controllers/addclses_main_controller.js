/**
 * Created by whyer on 14-2-9.
 */
module.exports = function (req, res, err) {
    var gom_clses = req.models.gom_clses;
    gom_clses.find(['CLS_ID', 'A'], function (err, data) {

        res.render('add_classes', {
            title: '添加类型',
            rootClass: data
        })

    });
};