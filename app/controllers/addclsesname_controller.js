/**
 * Created by whyer on 14-2-9.
 */
module.exports = function (req, res) {
    req.on('data', function (data) {
        console.log(data);
    });
    res.end();
};