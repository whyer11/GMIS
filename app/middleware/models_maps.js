// update at Thu Jun 12 2014 17:36:40 GMT+0800 (CST)
exports.modelsmaps = function (req,tab_name) {
   var models = {
     "STUDENT" : req.models.STUDENT,
     "CLASS" : req.models.CLASS,
     "LIST" : req.models.LIST,
     "ZBXY" : req.models.ZBXY,
     "gom_insts" : req.models.gom_insts
   }
   return models[tab_name];}