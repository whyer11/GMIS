//APARTMENT
module.exports = function (orm, db) {
    var APARTMENT = db.define("APARTMENT", {
        INST_ID: Number,
        APT_PEO: Number,
        APT_MASTER: String
    }, {
        id: "INST_ID"
    });
    APARTMENT.sync(function (err) {
        if (err) {
            console.log(err)
        }
    });
};