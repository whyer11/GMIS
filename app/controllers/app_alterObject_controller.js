/**
 * Created by wanghuanyu on 14-10-16.
 */
var opt_db = require('../middleware/opt_db');
module.exports = function (req, res) {
    var _selfNodeDetail = {};
    var checkSelfProps = function (nextclsid) {
        //console.log(nextclsid);
        if(nextclsid != 0){
            req.models.gom_props.find({CLS_ID:nextclsid}, function (err, propcols) {


                if(propcols.length !=0) {
                    for (var i = 0; i < propcols.length; i++) {
                        //console.log(propcols[i].PROP_NAME);
                        _selfNodeDetail[propcols[i].PROP_COL] = propcols[i].PROP_NAME;
                        if (i == propcols.length - 1) {
                            _selfNodeDetail.INST_NAME = '名称';
                            opt_db.checkParentClass(req,nextclsid, function (err, p_clscol) {
                                return checkSelfProps(p_clscol.CLS_ID);
                            });

                        }
                    }
                }else{

                }
            })
        }else{
            _selfNodeDetail.INST_NAME = '名称';
            //console.log(_selfNodeDetail);
            req.db.driver.close();
            return res.send(200,_selfNodeDetail);
        }

    };
    checkSelfProps(req.body.clsid);
};