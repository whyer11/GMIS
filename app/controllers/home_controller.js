/**
 * Created by whyer on 14-1-29.
 */


module.exports = function(req,res,next){

    res.render('index',{title:'index'});
    req.models.gom_insts.find({INST_ID:0},function(err,data){
        console.log(data[0].INST_NAME);
    });

};