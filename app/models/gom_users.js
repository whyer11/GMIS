/**
 * Created by whyer on 14-2-28.
 */
module.exports = function (orm, db) {
    var gom_users = db.define('gom_users', {
        id: Number,
        USER_ID: String,
        PWD: String
    }, {
        id: 'id'
    });
};