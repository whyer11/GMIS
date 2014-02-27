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
    var currentClassId = 0;
    var modelContent = opt_db.newModelContent(form);
    opt_db.newModel(form.class_name, modelContent);

    gom_clses.find(['CLS_ID', 'Z']).run(function (err, data) {
        currentClassId = data[0].CLS_ID + 1;
        gom_clses.create({
            CLS_ID: currentClassId,
            PARENT_CLS_ID: form.parent_class_id,
            CLS_NAME: form.class_name,
            CLS_TAB_NAME: form.class_name,
            CLS_TAB_SCHEMA: 'root',
            CLS_DISP_IND: 1,
            CLS_CODE: ""
        }, function (err, items) {
            if (err) console.log(err)
            console.log(items);
        });
    });
    console.log(currentClassId);


    res.end();
};
