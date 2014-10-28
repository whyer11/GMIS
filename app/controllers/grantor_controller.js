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
    }

};