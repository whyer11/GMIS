// update at Thu Apr 17 2014 13:57:21 GMT+0800 (CST)
exports.modelsmaps = function (req,tab_name) {
   var models = {
     "BENKESH" : req.models.BENKESH,
     "APARTMENT" : req.models.APARTMENT,
     "PEOPLE" : req.models.PEOPLE,
     "gom_insts" : req.models.gom_insts
   }
   return models[tab_name];}