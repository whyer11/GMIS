/**
 * Created by whyer on 14-3-31.
 */
module.exports = function (orm, db) {
    var gom_appclses = db.define('gom_appclses', {
        CLS_ID: Number,
        APP_ID: Number,
        IS_WEAK: String
    }, {
        id: "CLS_ID"
    });
    gom_appclses.sync(function (err) {
        if(err) console.error(err);
    })
};