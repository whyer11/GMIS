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
    gom_clses.get(form.class_id, function (err, data) {
        //console.log(data);
        ep.emit('returnclasstab', data);
    });
    function SQL_create_table (form) {
        var SQLstr = "";
        function mapsDatetype (Prop_type,Prop_length){
            var str = "";
            switch (Prop_type){
                case "VARCHAR" :
                    return str="VARCHAR("+Prop_length+")";
                    break;
                case "BOOLEAN" :
                    return str = "INT";
                    break;
                case "INT" :
                    return str = "INT";
                    break;

            }
        }
        if(typeof (form.PROP_NAME) == 'string'){
            SQLstr += '`'+form.PROP_COL+'` '+mapsDatetype(form.PROP_DBMS_TYPE,form.PROP_LENGTH)+' NULL,'
            return SQLstr;
        }else{
            for(var i = 0;i<form.PROP_NAME.length;i++){
                SQLstr += '`'+form.PROP_COL[i]+'` '+mapsDatetype(form.PROP_DBMS_TYPE[i],form.PROP_LENGTH[i])+' NULL,'
            }
            return SQLstr;
        }
    }
    ep.all('returnclasstab', function (data) {
        form.class_tab_name = data.CLS_TAB_NAME;
        form.class_name = data.CLS_NAME;
        var modelContent = opt_db.newModelContent(form);
        opt_db.newModel(form.class_tab_name, modelContent);
        req.db.driver.execQuery("DROP TABLE `gmis`.`" + form.class_tab_name + "`",function(err,result){
            if(err) console.log(err);
            req.db.driver.execQuery("" +
                "CREATE TABLE `gmis`.`"+form.class_tab_name+"` " +
                "" +
                "(`INST_ID` INT NOT NULL," +
                ""+SQL_create_table(form)+
                "PRIMARY KEY (`INST_ID`));",function(err,result){
                    console.log('SQL error:'+err);
                }
                )
        })
        ep.emit('deloldprop', form);
    });
    ep.all('deloldprop', function (form) {
        gom_props.find({CLS_ID: form.class_id}).each(function (data) {
            data.remove();
            ep.emit('createnewprop', form);
        });
    });
    ep.all('createnewprop', function (form) {
        console.log(form);
        gom_props.find(['PROP_ID', 'Z']).run(function (err, data) {
            currentPropId = data[0].PROP_ID + 1;
            if(typeof (form.PROP_NAME) == 'string'){
                gom_props.create({
                    PROP_ID: currentPropId,
                    CLS_ID: form.class_id,
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
                }, function (err, item) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('update successfully(table)')
                    }
                });
            }else {
                for (var i = 0; i < form.PROP_NAME.length; i++) {
                    gom_props.create({
                        PROP_ID: ++currentPropId,
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
            }
        });
        res.render('add_classes', {title: '类型管理器'});
        res.end();
    })
}