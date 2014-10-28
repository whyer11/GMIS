/**
 * Created by wanghuanyu on 14-10-28.
 */
module.exports = function (orm, db) {
    var gom_ac_grantors = db.define('gom_ac_grantors',{
        GRANTOR_ID:Number,
        GRANTOR_NAME:String,
        GRANTOR_IS_SYSTEM:String,
        GRANTOR_NOTE:String,
        GRANTOR_TYPE:String,
        USER_PWD:String,
        USER_DBMS_ACCOUNT:String,
        USER_DBMS_PWD:String
    },{
        id:'GRANTOR_ID'
    });
    gom_ac_grantors.sync(function (err) {
        if(err) console.error(err);
    })
};