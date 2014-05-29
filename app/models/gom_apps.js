/**
 * Created by whyer on 14-3-20.
 */
module.exports = function (orm, db) {
    var gom_apps = db.define('gom_apps', {
        APP_ID: Number,
        REF_ID: Number,
        APP_NAME: String,
        APP_NOTE: String
    }, {
        id: "APP_ID"
    });
    gom_apps.sync(function (err) {
        if(err) console.error(err);
    })
};