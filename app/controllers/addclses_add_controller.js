/**
 * Created by whyer on 14-2-9.
 */
var orm = require('orm');
var fs = require('fs');
var opt_db = require('../middleware/opt_db');

module.exports = function (req, res) {
    var gom_clses = req.models.gom_clses;
    var gom_props = req.models.gom_props;
    var form = req.body;
    opt_db.newModel('daa', 'jj');
    res.end();
};
