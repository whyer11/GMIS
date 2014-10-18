// update at Thu Oct 16 2014 15:01:11 GMT+0800 (CST)
exports.modelsmaps = function (req,tab_name) {
   var models = {
     "STU_CHC" : req.models.STU_CHC,
     "DPM" : req.models.DPM,
     "BANGS" : req.models.BANGS,
     "TERC" : req.models.TERC,
     "STU" : req.models.STU,
     "PEO" : req.models.PEO,
     "XIBIE" : req.models.XIBIE,
     "CATEGORY" : req.models.CATEGORY,
     "COLLEGE" : req.models.COLLEGE,
     "gom_insts" : req.models.gom_insts
   }
   return models[tab_name];}