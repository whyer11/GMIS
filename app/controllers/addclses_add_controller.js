/**
 * Created by whyer on 14-2-9.
 */
var orm = require('orm');
var fs = require('fs');

module.exports = function (req, res) {
    var gom_clses = req.models.gom_clses;
    var gom_props = req.models.gom_props;
    var form = req.body;

    res.end();
};

var newModel = function (modelName, modelContent) {
    fs.open('./app/models/test.js', 'a', 0644, function (e, fd) {
        if (e) throw e;
        fs.write(fd, '', 0, 'utf8', function (e) {
            if (e) throw e;
            fs.closeSync(fd);
        });
    });
}