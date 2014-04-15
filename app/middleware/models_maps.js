// update at Tue Apr 15 2014 22:31:59 GMT+0800 (CST)
exports.modelsmaps = function (req,tab_name) {
   var models = {
     "dvvvv" : req.models.dvvvv,
     "dvvvv" : req.models.dvvvv,
     "fdsfsdc" : req.models.fdsfsdc,
     "newclass" : req.models.newclass,
     "TEACHER" : req.models.TEACHER,
     "PEOPLE" : req.models.PEOPLE,
     "APARTMENT" : req.models.APARTMENT,
     "gom_insts" : req.models.gom_insts
   }
   return models[tab_name];}