/**
 * Created by whyer on 14-2-13.
 */
module.exports = function (req, res, err) {
    var gom_props = req.models.gom_props;
    var currentNodeID = req.body.id;
    gom_props.find({CLS_ID: currentNodeID}, function (err, data) {
        var nodeInfo = [];
        var a = 0;
        for (var i = 0; i < data.length; i++) {
            if (data[i].PROP_CAN_VISIBLE == 'T') {

                var propObj = {
                    name: data[i].PROP_NAME
                };
                nodeInfo[a] = propObj;
                a++;
            }
        }
        res.json({nodeInfo: nodeInfo});
        res.end();
    });

};