// update at Fri Nov 14 2014 13:08:58 GMT+0800 (CST)
exports.modelsmaps = function (req,tab_name) {
   var models = {
     "JOB_INFO" : req.models.JOB_INFO,
     "STU_JQ_R" : req.models.STU_JQ_R,
     "STU_HJ_R" : req.models.STU_HJ_R,
     "TEST" : req.models.TEST,
     "STU_KQ_R" : req.models.STU_KQ_R,
     "RECORD" : req.models.RECORD,
     "STU" : req.models.STU,
     "PEO" : req.models.PEO,
     "CATA" : req.models.CATA,
     "XIBIE" : req.models.XIBIE,
     "COLLEGE" : req.models.COLLEGE,
     "gom_insts" : req.models.gom_insts
   }
   return models[tab_name];}