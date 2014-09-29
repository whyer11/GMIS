// update at Mon Sep 29 2014 21:43:22 GMT+0800 (CST)
exports.modelsmaps = function (req,tab_name) {
   var models = {
     "STU" : req.models.STU,
     "PEO" : req.models.PEO,
     "MAJOR" : req.models.MAJOR,
     "CATEGORY" : req.models.CATEGORY,
     "COLLEGE" : req.models.COLLEGE,
     "gom_insts" : req.models.gom_insts
   }
   return models[tab_name];}