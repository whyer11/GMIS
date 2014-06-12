// update at Sun May 11 2014 19:15:03 GMT+0800 (CST)
exports.modelsmaps = function (req,tab_name) {
   var models = {
     "DAZS" : req.models.DAZS,
     "BENKESH" : req.models.BENKESH,
     "APARTMENT" : req.models.APARTMENT,
     "PEOPLE" : req.models.PEOPLE,
     "gom_insts" : req.models.gom_insts
   }
   return models[tab_name];}