/**
 * Created by whyer on 14-2-9.
 */
module.exports = function (orm, db) {
    var gom_props = db.define('gom_props', {
        PROP_ID: Number,
        CLS_ID: Number,
        GROUP_PROP_ID:Number,
        CNT_ID:Number,
        PROP_NAME:String,
        PROP_TYPE:String,
        PROP_COL:String,
        PROP_DBMS_TYPE:String,
        PROP_LENGTH:Number,
        PROP_SCALE:Number,
        PROP_MSRMNT:String,
        PROP_IS_SYSTEM:String,
        PROP_CAN_VISIBLE:String,
        PROP_CAN_MODIFY:String,
        PROP_CAN_DELETE:String,
        PROP_NOTE:String,
        PROP_DISP_IND:Number,
        PROP_CODE:String
    },{
        id:"PROP_ID"
    });
};