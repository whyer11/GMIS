// update at Wed Apr 16 2014 20:27:16 GMT+0800 (CST)
exports.modelsmaps = function (req,tab_name) {
   var models = {
     "dsdfsd" : req.models.dsdfsd,
     "gom_insts" : req.models.gom_insts
   }
   return models[tab_name];}