//BENKESH
module.exports = function (orm, db) {
    var BENKESH = db.define("BENKESH", {
        INST_ID: Number,
        STU_CLASS: String,
        STU_GRADE: String
    }, {
        id: "INST_ID"
    });
    BENKESH.sync(function (err) {
        if (err) {
            console.log(err)
        }
    });
};