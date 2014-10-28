/**
 * Created by wanghuanyu on 14-10-28.
 */
module.exports = function (orm, db) {
    var gom_ac_appacis = db.define('gom_ac_appacis',{
        APP_ID:Number,
        GRANTOR_ID:Number,
        APP_EXECUTE:String
    },{
        id:'APP_ID'
    });

    gom_ac_appacis.sync(function (err) {
        if(err){
            console.error(err);
        }
    })
};