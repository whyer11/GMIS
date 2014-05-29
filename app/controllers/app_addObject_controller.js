/**
 * Created by whyer on 14-5-9.
 */
var maps = require('../middleware/models_maps');
var EventProxy = require('eventproxy');
var ep = new EventProxy();
module.exports = function (req, res) {
    req.models.gom_insts.find(['INST_ID', 'Z'], function (err, data) {
        currentObjId = data[0].INST_ID + 1;
        ep.emit('returnobjid', currentObjId);
    });
    ep.all('returnobjid', function (coi) {
        checkParentsClass(req.body.clsid, coi);
        function checkParentsClass(clsid, instid) {

            req.models.gom_clses.get(clsid, function (err, clscols) {
                if (clsid == 0) {
                    maps.modelsmaps(req, clscols.CLS_TAB_NAME).create({
                        INST_ID: instid,
                        STATE_ID: 0,
                        INSTACP_ID: 0,
                        CLS_ID: req.body.clsid,
                        INST_NAME: req.body.props['_5']
                    }, function (err, item) {
                        ep.emit('createinstend', item);
                        if (err) {

                            console.log(err);
                        }
                    });
                } else {
                    req.models.gom_props.find({CLS_ID: clscols.CLS_ID}, function (err, propcols) {
                        var prop = {};
                        for (val in req.body.props) {
                            for (var i = 0; i < propcols.length; i++) {
                                if (val == '_' + propcols[i].PROP_ID) {
                                    prop[propcols[i].PROP_COL] = req.body.props[val];
                                }
                            }
                        }
                        prop["INST_ID"] = instid;
                        //console.log(prop);
                        maps.modelsmaps(req, clscols.CLS_TAB_NAME).create(prop, function (err, item) {
                            if (err) {

                                console.log(err);
                            }
                        });
                        checkParentsClass(clscols.PARENT_CLS_ID, instid);
                    })
                }

            })

        }
    });
    ep.once('createinstend', function (item) {
        req.models.gom_refs.find(['REF_ID', 'Z'], function (err, refcols) {
            currentRefId = refcols[0].REF_ID + 1;
            currentdis = refcols[0].REF_DISP_IND + 1;
            var ref = {
                REF_ID: currentRefId,
                PARENT_REF_ID: req.body.refid,
                INST_ID: currentObjId,
                REF_DISP_IND: currentdis

            };
            req.models.gom_refs.create(ref, function (err, item) {
                if (err) {

                    console.log(err);
                }

                res.json([]);
                res.end();


            })
        });
    });


};