/**
 * Created by whyer on 14-1-29.
 */
var orm = require('orm'),
    fs = require('fs'),
    settings = require('../../config/settings'),
    connection = null;

function setup(db, cb) {
    var file = fs.readdirSync('./app/models');
    addModelsToORM(file, db);
    return cb(null, db);
}
function addModelsToORM(file, db) {
    for (var i = 0; i < file.length; i++) {
        var modelName = file[i];
        if (modelName == 'index.js') {
            //遇到index跳过，不读取此文件
        } else {
            //将其他model读取
            modelName = "./" + modelName.slice(0, -3);
            require(modelName)(orm, db);
        }
    }
}
module.exports = function (cb) {

    function ormConnect () {
        orm.connect(settings.database, function (err, db) {
            if(db != undefined){
                db.settings.set('instance.returnAllErrors', true);
                setup(db, cb);
                return 0;
            }else{
                console.log('等待mysql连接');
                return ormConnect();
            }
        });
    }
    ormConnect();
};