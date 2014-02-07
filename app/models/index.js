/**
 * Created by whyer on 14-1-29.
 */
var orm = require('orm'),
    settings = require('../../config/settings'),
    connection = null;

function setup(db,cb){
    require('./test')(orm,db);

    return cb(null,db);
}

module.exports = function(cb){

    orm.connect(settings.database,function(err,db){

        db.settings.set('instance.returnAllErrors',true);
        setup(db,cb);
    });
};