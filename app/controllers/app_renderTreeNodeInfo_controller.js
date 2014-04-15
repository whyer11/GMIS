/**
 * Created by whyer on 14-4-12.
 */
var opt_db = require('../middleware/opt_db');
//var models_maps = require('../middleware/models_maps');
;module.exports = function(req,res){
    var currentNode = req.body;
    var db = req.db;
    //console.log(models_maps.modelsmaps(req,'a'));
    //opt_db.addModelsMaps();
    db.driver.execQuery("SELECT * FROM gmis.APARTMENT",function(err,data){

    });
    res.end();
}