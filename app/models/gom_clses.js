/**
 * Created by whyer on 14-2-8.
 */
module.exports = function (orm, db) {
    var gom_clses = db.define('gom_clses', {
        CLS_ID: Number,
        PARENT_CLS_ID: Number,
        STATE_ID: Number,
        CLS_NAME: String,
        CLS_TAB_SCHEMA: String,
        CLS_TAB_NAME: String,
        CLS_NOTE: String,
        CLS_DISP_IND: Number,
        CLS_CODE: String,
        CLS_IMAGE: Buffer
    }, {
        id: "CLS_ID"
    });
    gom_clses.sync(function (err) {
        if(err) console.error(err);
    })
};