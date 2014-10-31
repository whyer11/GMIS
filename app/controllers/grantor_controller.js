/**
 * Created by wanghuanyu on 14-10-26.
 */
var opt_db = require('../middleware/opt_db');
/* 方法:Array.remove(dx)
 * 功能:删除数组元素.
 * 参数:dx删除元素的下标.
 * 返回:在原数组上修改数组
 */
//经常用的是通过遍历,重构数组.
/**
 *
 * @param dx
 */
Array.prototype.remove=function(dx)
{
    //if(isNaN(dx)||dx>this.length){return false;}
    for(var i=0,n=0;i<this.length;i++)
    {
        if(this[i]!=this[dx])
        {
            this[n++]=this[i]
        }
    }
    this.length-=1
};

//在数组中获取指定值的元素索引
/**
 *
 * @param value
 * @returns {number}
 */
Array.prototype.getIndexByValue= function(value)
{
    var index = -1;
    for (var i = 0; i < this.length; i++)
    {
        if (this[i] == value)
        {
            index = i;
            break;
        }
    }
    return index;
};
module.exports = {
    createGrantor_view: function (req, res) {
        return res.render('grantor_create',{
            title:'创建用户'
        });
    },
    createGrantors_view: function (req, res) {
        return res.render('grantors_create',{
            title:'创建用户组'
        });
    },
    manageGrantor_view: function (req, res) {
        req.models.gom_ac_grantors.find({GRANTOR_IS_SYSTEM:'F'}, function (err, gancols) {
            return res.render('grantor_manage',{
                title:'用户/用户组管理',
                grantors_info:gancols
            })
        })
    },
    createGrantor: function (req, res) {
        opt_db.checkNewGrantorId(req, function (err, id) {
            if(err){
                return res.send(200,{success:false,err:'unknow'});
            }else{
                req.models.gom_ac_grantors.create({
                    GRANTOR_ID:id,
                    GRANTOR_NAME:req.body.username,
                    GRANTOR_IS_SYSTEM:req.body.issystem,
                    USER_PWD:'123'
                }, function (err, item) {
                    if(err){
                        return res.send(200,{success:false,err:err});
                    }else{
                        return res.send(200,{success:true,err:null});
                    }
                })
            }
        })
    },
    showhau : function(req,res){
        var have = [];
        var unhave = [];
        var index = 0;
        req.models.gom_ac_groupusers.find({GOM_GRANTOR_ID:req.body.grantorsid}, function (err, havecols) {
            var temp = [];
            for(var i = 0;i<havecols.length;i++){
                temp[i] = havecols[i].GRANTOR_ID;
            }
            req.models.gom_ac_grantors.find({GRANTOR_ID:temp}, function (err,havegan) {
                have = havegan;
                req.models.gom_ac_grantors.find(['GRANTOR_ID','A'], function (err, allgan) {
                    for(var i = 0;i<allgan.length;i++){
                        for(var j = 0;j<have.length;j++){
                            if(allgan[i] != null){
                                if(have[j].GRANTOR_ID == allgan[i].GRANTOR_ID){
                                    allgan[i] = null;
                                }
                            }


                        }
                    }
                    for(var i = 0;i<allgan.length;i++){

                        if(allgan[i] != null){
                            unhave[index] = allgan[i];
                            index++;
                        }
                    }
                    return res.send(200,{have:have,unhave:unhave});
                })
            });

        })
    },
    haveorunhave: function (req, res) {
        if(req.body.del == 'true'){
            req.db.driver.execQuery("DELETE FROM `gmis`.`gom_ac_groupusers` WHERE `GRANTOR_ID`='"+req.body.grantorid+"' and`GOM_GRANTOR_ID`='"+req.body.grantorsid+"';", function (err) {
                if(err){
                    console.log(err);
                    return res.send(200,{success:false,err:err});
                }else{
                    return res.send(200,{success:true,err:null});
                }
            });

        }else{
            var item = {
                GRANTOR_ID:req.body.grantorid,
                GOM_GRANTOR_ID:req.body.grantorsid
            };
            req.models.gom_ac_groupusers.create(item, function (err, item) {
                if(err){
                    console.log(err);
                    return res.send(200,{success:false,err:err});
                }else{
                    return res.send(200,{success:true,err:null});
                }
            })
        }
    },
    grantorApp_view: function (req, res) {
        return res.render('grantor_app',{
            title:'用户/用户组APP管理'
        })
    },
    showgrantors: function (req, res) {
        req.models.gom_ac_grantors.find(['GRANTOR_ID','A'], function (err, allgan) {
            req.models.gom_ac_groupusers.find(['GRANTOR_ID','A'], function (err, groupcols) {
                for(var i = 0;i<allgan.length;i++){
                    for(var j = 0;j<groupcols.length;j++){
                        if(allgan[i] != null) {


                            if (allgan[i].GRANTOR_ID == groupcols[j].GRANTOR_ID) {
                                //console.log(allgan[i].GRANTOR_NAME);
                                groupcols[j].GRANTOR_NAME = allgan[i].GRANTOR_NAME;
                                allgan[i].has = true;
                            }
                        }
                    }
                }
                for(var i = 0;i<allgan.length;i++){
                    if(typeof (allgan[i].has) == 'undefined'){
                        allgan[i].GOM_GRANTOR_ID = null;
                        groupcols.push(allgan[i]);
                    }
                }

                var temp = [];
                for(var i =0;i<groupcols.length;i++){
                    //console.log(groupcols[i].GRANTOR_NAME);
                    var item = {
                        GRANTOR_ID:groupcols[i].GRANTOR_ID,
                        PARENT_GRANTOR_ID:groupcols[i].GOM_GRANTOR_ID,
                        GRANTOR_NAME:groupcols[i].GRANTOR_NAME
                    };

                    temp.push(item);
                }
                //console.log(temp);
                return res.send(200,temp);

            })
        })
    },
    showAuthedApp : function(req,res){
        var authed = [];
        var unauthed = [];
        var temp = [];
        var index = 0;
        //console.log(req.body);
        req.models.gom_ac_appacis.find({GRANTOR_ID:req.body.GRANTOR_ID}, function (err, appacicol) {
            for(var i = 0;i<appacicol.length;i++){
                temp[i] = appacicol[i].APP_ID;
            }
            req.models.gom_apps.find({APP_ID:temp}, function (err, appcols) {

                authed = appcols;
                req.models.gom_apps.find(['APP_ID','Z'], function (err, allapps) {
                    for(var i = 0;i<allapps.length;i++){
                        for(var j = 0;j<temp.length;j++){

                            if(allapps[i].APP_ID == temp[j]){

                                allapps[i].authed = true;
                            }
                        }
                    }
                    for(var i = 0;i<allapps.length;i++){

                        if(allapps[i].authed == undefined){
                            unauthed[index] = allapps[i];
                            index++;
                        }
                    }
                    //console.log(authed);
                    //console.log(unauthed);
                    return res.send(200,{authed:authed,unauthed:unauthed});
                })
            })
        })
    },
    authedorunauthed: function (req, res) {
        console.log(req.body);
        if(req.body.del == 'true'){
            req.db.driver.execQuery("DELETE FROM `gmis`.`gom_ac_appacis` WHERE `APP_ID`='"+req.body.appid+"' and`GRANTOR_ID`='"+req.body.grantorid+"';", function (err) {
                if(err){
                    return res.send(200,{success:false,err:err});
                }else{
                    return res.send(200,{success:true});
                }
            });

        }else{
            req.models.gom_ac_appacis.create({
                APP_ID:req.body.appid,
                GRANTOR_ID:req.body.grantorid
            }, function (err, item) {
                if(err){
                    return res.send(200,{success:false,err:err});
                }else{
                    return res.send(200,{success:true});
                }
            })
        }
    }

};