// update at Fri Sep 19 2014 15:10:26 GMT+0800 (CST)
exports.modelsmaps = function (req,tab_name) {
   var models = {
     "CATEGORY" : req.models.CATEGORY,
     "CATEGORY" : req.models.CATEGORY,
     "CATEGORY" : req.models.CATEGORY,
     "ZBXY" : req.models.ZBXY,
     "gom_insts" : req.models.gom_insts
   }
   return models[tab_name];}