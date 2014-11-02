/**
 * Created by whyer on 14-2-11.
 */
module.exports = function (req, res) {
    var gom_clses = req.models.gom_clses;
    gom_clses.find(['CLS_ID', 'A'], function (err, data) {
        req.db.driver.close();
        return res.send(200,{data: data});
    })
};