/**
 * Created by whyer on 14-2-7.
 */

module.exports = function(orm,db){
    var gom_insts = db.define('gom_insts',{
            INST_ID:Number,
            GRANTOR_ID:Number,
            STATE_ID:Number,
            INSTACP_ID:Number,
            CLS_ID:Number,
            INST_NAME:String,
            INST_NOTE:String
        },{
        id:"INST_ID"
    });
};