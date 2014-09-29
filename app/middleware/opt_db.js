/**
 * Created by whyer on 14-2-25.
 */
var fs = require('fs');
/**
 *
 * @param modelName
 * @param modelContent
 */
exports.newModel = function (modelName, modelContent) {
    fs.open('./app/models/' + modelName + '.js', 'w', 0644, function (e, fd) {
        if (e) throw e;
        fs.write(fd, '//' + modelName + '\n' +
            modelContent, 0, 'utf8', function (e) {
            if (e) throw e;
            fs.closeSync(fd);
        });
    });
};

/**
 *
 * @param fm
 * @returns {string}
 */
exports.newModelContent = function (fm) {
    var modelStr = 'module.exports = function(orm,db){' + '\n' +
        '   var ' + fm.class_tab_name + ' = db.define("' + fm.class_tab_name + '",{' + '\n' +
        '       INST_ID:Number,' + '\n' +
        printClassProps(fm) +
        '},{' + '\n' +
        '       id:"INST_ID"' + '\n' +
        '   });' + '\n' +
        '   ' + fm.class_tab_name + '.sync(function(err){' + '\n' +
        '   if(err)' +
        '   {' +
        '       console.log(err)' +
        '   }' + '\n' +
        '   });' + '\n' +
        '};';

    function printClassProps(fm) {
        var str = "";
        var props = fm.PROP_COL;
        var dbms_type = '';

        if (typeof(fm.PROP_COL) == 'string') {
            switch (fm.PROP_DBMS_TYPE) {
                case 'VARCHAR':
                    dbms_type = 'String';
                    break;
                case 'INT':
                    dbms_type = 'Number';
                    break;
                case 'BOOLEAN':
                    dbms_type = 'Boolean';
                    break;
            }
            str += '        ' + props + ':' + dbms_type + '\n';
        } else {
            for (var e = 0; e < fm.PROP_COL.length; e++) {
                switch (fm.PROP_DBMS_TYPE[e]) {
                    case 'VARCHAR':
                        dbms_type = 'String';
                        break;
                    case 'INT':
                        dbms_type = 'Number';
                        break;
                    case 'BOOLEAN':
                        dbms_type = 'Boolean';
                        break;
                }
                if (e == fm.PROP_COL.length - 1) {
                    str += '       ' + props[e] + ':' + dbms_type + '\n';
                } else {
                    str += '       ' + props[e] + ':' + dbms_type + ',' + '\n';
                }
            }
        }

        return str;
    }

    return modelStr;
};

/**
 *
 * @param props
 * @param table
 * @param classid
 * @param i
 */
exports.addClassProp = function (props, table, classid, i) {
    table.find(['PROP_ID', 'Z'], function (err, data) {
        var nextID = data[0].PROP_ID + 1;
        table.create({
            PROP_ID: nextID,
            CLS_ID: classid,
            PROP_NAME: props[i],
            PROP_TYPE: "String",
            PROP_CAN_VISIBLE: "T",
            PROP_CAN_MODIFY: "T",
            PROP_CAN_DELETE: "T",
            PROP_DISP_IND: 1,
            PROP_CODE: ""
        }, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log("insert successfully (table gom_props)");
            }
        })
    });
    if (i == props.length) {
        return;
    } else {
        i++;
        addClassProp(props, table, classid, i)
    }
};

/**
 *
 * @param clscols
 */
exports.addModelsMaps = function(clscols){
    var date = Date();
    //console.log('i am here');
    fs.open('./app/middleware/models_maps.js','w',0644,function(err,fd){
        if(err) console.log(err);
        fs.write(fd,'// update at '+date+'\n' +
            'exports.modelsmaps = function (req,tab_name) {' +'\n'+
            '   var models = {' +'\n'+
            generateModelsMapsContent(clscols)+
            '   }' +'\n'+
            '   return models[tab_name];' +
            '}',0,'utf8',function(err){
            if(err) console.log(err);
            fs.closeSync(fd);
        })
    })
};

/**
 *
 * @param clscols
 * @returns {string}
 */
function generateModelsMapsContent (clscols){
    var contentstr = '';
    for(var i = 0;i<clscols.length;i++){
        if(i==clscols.length-1){
            contentstr += '     "'+clscols[i].CLS_TAB_NAME+'" : req.models.'+clscols[i].CLS_TAB_NAME+'\n';
        }else{
            contentstr += '     "'+clscols[i].CLS_TAB_NAME+'" : req.models.'+clscols[i].CLS_TAB_NAME+','+'\n';
        }
    }
    return contentstr;
}

/**
 *
 * @param req
 * @param clsid
 * @param cb
 */
var checkClass = function (req,clsid,cb) {
    req.models.gom_clses.get(clsid, function (err,clscol) {
        return cb(err,clscol);
    });
};

/**
 *
 * @param req
 * @param clsid
 * @param cb
 */
var checkParentClass = function (req,clsid, cb) {
    checkClass(req,clsid, function (err, clscol) {
        req.models.gom_clses.get(clscol.PARENT_CLS_ID, function (err, pclscol) {
            return cb(err,pclscol);
        });
    });
};

/**
 *
 * @param req
 * @param refid
 * @param cb
 */
var checkRef = function (req, refid, cb) {
    req.models.gom_refs.get(refid, function (err, refcol) {
        return cb(err,refcol);
    });
};

/**
 *
 * @param req
 * @param refid
 * @param cb
 */
var checkParentRef = function (req, refid, cb) {
    checkRef(req,refid, function (err, refcol) {
        req.models.gom_refs.get(refcol.PARENT_REF_ID, function (err, prefcol) {
            return cb(err,prefcol);
        });
    });
};

/**
 *
 * @param req
 * @param instid
 * @param cb
 */
var checkInst = function (req, instid, cb) {
    req.models.gom_insts.get(instid, function (err, instcol) {
        return cb(err,instcol);
    });
};

/**
 *
 * @param req
 * @param propid
 * @param cb
 */
var checkProp = function (req, propid, cb) {
    req.models.gom_props.get(propid, function (err, propcol) {
        return cb(err,propcol);
    })
};

/**
 *
 * @param req
 * @param cb
 */
var checkNewInstId = function (req,cb) {
    req.models.gom_insts.find(['INST_ID','Z'], function (err, instcols) {
        return cb(err,instcols[0].INST_ID+1);
    });
};

var checkNewRefId = function (req, cb) {
    req.models.gom_refs.find(['REF_ID','Z'], function (err,refcols) {
        return cb(err,refcols[0].REF_ID+1);
    })
};
exports.checkClass = checkClass;
exports.checkParentClass = checkParentClass;
exports.checkRef= checkRef;
exports.checkParentRef = checkParentRef;
exports.checkInst = checkInst;
exports.checkProp = checkProp;
exports.checkNewInstId = checkNewInstId;
exports.checkNewRefId = checkNewRefId;
