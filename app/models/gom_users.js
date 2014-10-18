/**
 * Created by whyer on 14-2-28.
 */
module.exports = function (orm, db) {
    var gom_users = db.define('gom_users', {
        id: Number
        ,USER_ID: String
        ,USER_PWD: String
        ,USER_ROLE: String
    }, {
        id: 'id'
    });
    gom_users.sync(function (err) {
        if(err) console.error(err);
    })
};