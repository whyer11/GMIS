/**
 * Created by wanghuanyu on 14-10-28.
 */
module.exports = function (orm, db) {
    var gom_ac_groupusers = db.define('gom_ac_groupusers',{
        GRANTOR_ID:Number,
        GOM_GRANTOR_ID:Number

    },{
        id:'GRANTOR_ID'
    });
    gom_ac_groupusers.sync(function (err) {
        if(err) console.error(err);
    })
};