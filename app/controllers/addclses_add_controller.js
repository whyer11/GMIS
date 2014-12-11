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
    var currentPropId = 0;
    var modelContent = opt_db.newModelContent(form);
    opt_db.newModel(form.class_tab_name, modelContent);
    gom_clses.find(['CLS_ID', 'Z']).run(function (err, data) {
        currentClassId = data[0].CLS_ID + 1;
        gom_clses.create({
            CLS_ID: currentClassId,
            PARENT_CLS_ID: form.parent_class_id,
            CLS_NAME: form.class_name,
            CLS_TAB_NAME: form.class_tab_name,
            CLS_TAB_SCHEMA: 'root',
            CLS_DISP_IND: 1,
            CLS_CODE: ""
        }, function (err, items) {
            if (err) {
                console.log(err)
            } else {
                console.log("insert successfully(table gom_clses)");
            }
            if(form.parent_class_id == 0){
                req.models.gom_clslinks.create({
                    CLS_ID : form.parent_class_id,
                    GOM_CLS_ID : currentClassId,
                    LINK_TYPE : 'L'
                },function(err,items){
                    if(err){
                        console.log(err);
                    }
                });
            }
            gom_clses.find(['CLS_ID','Z'],function(err,data){
                opt_db.addModelsMaps(data);
            });

        });
        //console.log(gom_props);
        req.models.gom_props.find(['PROP_ID', 'Z'],function (err, data) {
            console.log(err);
            //console.log(data);
            currentPropId = data[0].PROP_ID + 1;
            if (typeof(form.PROP_NAME) == 'string') {
                gom_props.create({
                    PROP_ID: currentPropId,
                    CLS_ID: currentClassId,
                    PROP_NAME: form.PROP_NAME,
                    PROP_TYPE: "D",
                    PROP_COL: form.PROP_COL,
                    PROP_DBMS_TYPE: form.PROP_DBMS_TYPE,
                    PROP_LENGTH: form.PROP_LENGTH,
                    PROP_CAN_VISIBLE: "T",
                    PROP_CAN_MODIFY: "T",
                    PROP_CAN_DELETE: "T",
                    PROP_DISP_IND: 1,
                    PROP_CODE: form.PROP_COL
                }, function (err, items) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("insert successfully(table gom_props)");
                    }

                });
            } else {
                for (var i = 0; i < form.PROP_NAME.length; i++) {
                    gom_props.create({
                        PROP_ID: currentPropId,
                        CLS_ID: currentClassId,
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
                    }, function (err, items) {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log("insert successfully(table gom_props)");
                        }

                    });
                    currentPropId++;
                }
            }
        })
    });
    //req.db.driver.close();
    return res.render('add_classes', {title: '类型管理器'});
};
