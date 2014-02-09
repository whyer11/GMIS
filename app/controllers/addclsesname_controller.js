/**
 * Created by whyer on 14-2-9.
 */
module.exports = function (req, res) {
    console.log(req.body.name);
    res.json({name: 'aa'});
    res.end();
};