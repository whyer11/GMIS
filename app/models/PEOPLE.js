//PEOPLE
module.exports = function(orm,db){
   var PEOPLE = db.define("PEOPLE",{
       INST_ID:Number,
       GENDER:String,
       AGE:Number
},{
       id:"INST_ID"
   });
   PEOPLE.sync(function(err){
   if(err)   {       console.log(err)   }
   });
};