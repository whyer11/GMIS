/**
 * Created by whyer on 14-1-29.
 */


module.exports = function (req, res, next) {
    req.models.gom_insts.find({INST_ID: 0}, function (err, data) {
        console.log(data[0].INST_NAME);
    });
    var gom_insts = req.models.gom_insts;
    gom_insts.create({
        INST_ID:0,
        STATE_ID: 0,
        INSTACP_ID: 0,
        CLS_ID: 0,
        INST_NAME: "WANG",
        INST_NOTE: ""
    }, function (err, items) {
        if (err) {
            console.log(err);
        }
        console.log(items);
    });
    res.render('index', {
        title: 'index'
    });
};