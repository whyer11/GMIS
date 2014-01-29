/**
 * Created by whyer on 14-1-29.
 */
var path = require('path');

var settings = {
    path: path.normalize(path.join(__dirname, '..')),
    port: 3000,
    views:path.join(__dirname, 'views'),
    database:{
        protocol:"mysql",
        query:{pool:true},
        host:"127.0.0.1",
        database:"gmis",
        user:"root",
        password:""
    }
};

module.exports = settings;