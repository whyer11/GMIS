// update at Tue Sep 30 2014 09:22:36 GMT+0800 (CST)
exports.modelsmaps = function (req,tab_name) {
   var models = {
     "TERC" : req.models.TERC,
     "STU" : req.models.STU,
     "PEO" : req.models.PEO,
     "XIBIE" : req.models.XIBIE,
     "CATEGORY" : req.models.CATEGORY,
     "COLLEGE" : req.models.COLLEGE,
     "gom_insts" : req.models.gom_insts
   }
   return models[tab_name];}