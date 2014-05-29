/**
 * Created by whyer on 14-4-1.
 */
module.exports = function (orm, db) {
    var gom_clslinks = db.define("gom_clslinks", {
        CLS_ID: Number,
        GOM_CLS_ID: Number,
        LINK_TYPE: String
    }, {
        id: "CLS_ID",
        id: "GOM_CLS_ID"
    });
    gom_clslinks.sync(function (err) {
        if(err) console.error(err);
    })
}