/**
 * Created by wanghuanyu on 14-10-5.
 */
module.exports = function (req, res) {
    var j = 0;

    function unlinkClass() {
        req.db.driver.execQuery("delete from gmis.gom_clslinks where CLS_ID = '"+req.body.clsid+"' and GOM_CLS_ID = '"+req.body.gom_clsid[j]+"'", function (err,result) {
            if(err){
                req.db.driver.close();
                return res.send(200,{success:false,err:err,node:null});
            }else if(j == req.body.gom_clsid.length-1){
                req.db.driver.close();
                return res.send(200,{success:true,err:null,node:null});
            }else{
                j++;
                return unlinkClass();
            }
        })
    }
    unlinkClass();
};