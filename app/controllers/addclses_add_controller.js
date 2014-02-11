/**
 * Created by whyer on 14-2-9.
 */
module.exports = function (req, res) {
    var gom_clses = req.models.gom_clses;
    var gom_props = req.models.gom_props;
    var classlastID = 0;
    gom_clses.find(['CLS_ID', 'Z'], function (err, data) {
        classlastID = data[0].CLS_ID;
        var classname_array = [];
        for (var i = 0; i < data.length; i++) {
            classname_array[i] = data[i].CLS_NAME;
        }
        res.json({data: classname_array});
        res.end();
    });


};