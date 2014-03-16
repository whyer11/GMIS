/**
 * Created by whyer on 14-3-13.
 */
var fs = require('fs');
var opt_db = require('../middleware/opt_db');
var EventProxy = require('eventproxy');
var ep = new EventProxy();
module.exports = function (req, res) {
    var gom_props = req.models.gom_props;
    var gom_clses = req.models.gom_clses;
    var form = req.body;
    gom_clses.find({CLS_ID: form.class_id}, function (err, data) {
        ep.emit('returnclasstab', data);
    });
    ep.all('returnclasstab', function (data) {
        form.class_tab_name = data[0].CLS_TAB_NAME;
        form.class_name = data[0].CLS_NAME;
        console.log(form);
        var modelContent = opt_db.newModelContent(form);
        opt_db.newModel(form.class_tab_name, modelContent);
        ep.emit('deloldprop', form);
    });
    ep.all('deloldprop', function (form) {
        gom_props.find({CLS_ID: form.class_id}).each(function (data) {
            data.remove();
            ep.emit('createnewprop', form);
        });
    });
    ep.all('createnewprop', function (form) {
        gom_props.find(['PROP_ID', 'Z']).run(function (err, data) {
            currentPropId = data[0].PROP_ID + 1;
            for (var i = 0; i < form.PROP_NAME.length; i++) {
                gom_props.create({
                    PROP_ID: currentPropId,
                    CLS_ID: form.class_id,
                    PROP_NAME: form.PROP_NAME[i],
                    PROP_TYPE: "D",
                    PROP_COL: form.PROP_COL[i],
                    PROP_DBMS_TYPE: form.PROP_DBMS_TYPE[i],
                    PROP_LENGTH: form.PROP_LENGTH[i],
                    PROP_CAN_VISIBLE: "T",
                    PROP_CAN_MODIFY: "T",
                    PROP_CAN_DELETE: "T",
                    PROP_DISP_IND: 1,
                    PROP_CODE: form.PROP_COL[i]
                }, function (err, item) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('update successfully(table)')
                    }
                });
                currentPropId++;
            }
        });
        res.render('add_classes', {title: '类型管理器'});
        res.end();
    })
}