/**
 * Created by whyer on 14-4-1.
 */
module.exports = function (orm, db) {
    var gom_refs = db.define('gom_refs', {
        REF_ID: Number,
        PARENT_REF_ID: Number,
        INST_ID: Number,
        REF_DISP_IND: Number
    }, {
        id: "REF_ID"
    })
}