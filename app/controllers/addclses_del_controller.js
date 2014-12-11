/**
 * Created by whyer on 14-3-7.
 */
var EventProxy = require('eventproxy');
var ep = new EventProxy();
var fs = require('fs');
module.exports = function (req, res) {
    //console.log(req.body);

    if(req.body.isParent == 'true'){
        /**
         * 类型下子节点,无法删除
         */
        req.db.driver.close();
        return res.send(200,{success:false,err:'您无法删除该类型,原因是它不是叶子类型'});
    }else{
        /**
         * 检查在cls_link中有被连接记录
         */
        req.models.gom_clslinks.find({or:[{CLS_ID:req.body.id},{GOM_CLS_ID:req.body.id}]}, function (err, result) {
            if(result.length == 0){
                /**
                 * cls_links下没有该类型的连接
                 */
                req.models.gom_appclses.find({CLS_ID:req.body.id}, function (err, appclscol) {
                    if(appclscol.length == 0){
                        req.models.gom_insts.find({CLS_ID:req.body.id}, function (err, instcol) {
                            if(instcol.length == 0){
                                console.log('未发现任何异常,开始删除该类型');
                                ep.emit('$YouCanDel',{});
                            }else{
                                req.db.driver.close();
                                return res.send(200,{success:false,err:'您无法删除该类型,原因是它有实例对象'});
                            }
                        });
                    }else{
                        req.db.driver.close();
                        return res.send(200,{success:false,err:'您无法删除该类型,原因是它与App有连接'});
                    }
                })
            }else{
                req.db.driver.close();
                return res.send(200,{success:false,err:'您无法删除该类型,原因是它与其他类型有连接'});
            }
        })
    }
    ep.once('$YouCanDel', function (data) {
        /**
         * del the col in gom_props first
         */
        var i = 0;
        req.models.gom_props.count({CLS_ID:req.body.id},function (err, count) {
            console.log('该类型有:'+count+'条属性');
            req.models.gom_props.find({CLS_ID:req.body.id}).each(function (prop) {
                prop.remove(function (err) {
                    i++;
                    console.log('已删除第'+i+'条记录,在gom_props中');
                    if(err){
                        console.log(err);
                        //req.db.driver.close();
                        return res.send(200,{success:false,err:err});
                    }else if(i == count){
                        /**
                         * emit the cols in table gom_props has been deleted
                         * and next step is delete the col in gom_clses
                         *
                         */
                        console.log('删除该类型属性完毕,准备删除该类型在gom_clses中的记录');
                        ep.emit('$DelPropGood',{});
                    }
                })
            })
        })
    });

    ep.once("$DelPropGood", function (data) {
        /**
         * begin delete col in gom_clses
         */
        console.log('准备删除类型表中记录');
        req.models.gom_clses.get(req.body.id, function (err, clscol) {
            if(err){
                console.error(err);
                //req.db.driver.close();
                return res.send(200,{success:false,err:err});
            }else{
                clscol.remove(function (err) {
                    if(err){
                        console.error(err);
                        //req.db.driver.close();
                        return res.send(200,{success:false,err:err});
                    }else{
                        /**
                         * if there is no error,then we can do next step
                         *
                         */
                        console.log('删除类型表中记录完成');
                        ep.emit('$DelClsGood',clscol);
                    }
                })
            }
        })
    });

    ep.once('$DelClsGood', function (data) {
        /**
         * drop the map class table in the database
         *
         */
        console.log('准备开始删除类型物理模型');
        req.db.driver.execQuery("DROP TABLE `gmis`.`" + data.CLS_TAB_NAME + "`", function (err, result) {
            if (err) {
                console.error(err);
            }else{
                console.log('删除物理模型完毕,准备删除orm的model');
                ep.emit('$DropTableGood',data);
            }
        });

    });

    ep.once('$DropTableGood', function (data) {
        var modelpath = './app/models/' + data.CLS_TAB_NAME + '.js';
        fs.exists(modelpath, function (result) {
            if (result) {
                console.log('已发现模型,正在删除');
                fs.unlinkSync(modelpath);
                console.log('模型删除完毕');
                //req.db.driver.close();
                return res.send(200,{success:true,err:null});
            } else {
                console.info(modelpath + ' have been del!');

            }
        });
    });
};
    /**
     * TODO
     * 删除某个类型:
     * 如果此类型下有子类型,提示无法删除
     * 检查是否为根节点
     * 检查是否为叶子类型
     * 
     */
    //res.end();


























    /*
    function del(pid) {
        gom_clses.find({PARENT_CLS_ID: pid}).count(function (err, count) {
            if (count != 0) {
                gom_clses.find({PARENT_CLS_ID: pid}).each(function (cls) {
                    if (typeof (cls) == 'undefined') {
                        return 0;
                    } else {
                        gom_props.find({CLS_ID: cls.CLS_ID}).each(function (prop) {
                            prop.remove(function (err) {
                                console.error('prop remove err' + err);
                            });
                        });

                        cls.remove(function (err) {
                            console.error('class remove err' + err);
                        });

                        db.driver.execQuery("DROP TABLE `gmis`.`" + cls.CLS_TAB_NAME + "`", function (err, result) {
                            if (err) {
                                console.log(err);
                            }
                        });
                        var modelpath = './app/models/' + cls.CLS_TAB_NAME + '.js';
                        fs.exists(modelpath, function (result) {
                            if (result) {
                                fs.unlinkSync(modelpath);
                            } else {
                                console.info(modelpath + ' have been del!')
                            }
                        });

                        del(cls.CLS_ID);
                    }
                })
            }
        })
    }

    del(currentClassId);
    gom_props.find({CLS_ID: currentClassId}).each(function (prop) {
        prop.remove();
    });

    gom_clses.get(currentClassId, function (err, cls) {
        console.log(cls);
        cls.remove(function (err) {
            if (err) {
                console.error(err);
            }
        });
        console.log(cls.CLS_TAB_NAME);
        db.driver.execQuery("DROP TABLE `gmis`.`" + cls.CLS_TAB_NAME + "`", function (err, result) {
            if (err) {
                console.error(err);
            }
        });
        var modelpath = './app/models/' + cls.CLS_TAB_NAME + '.js';
        fs.exists(modelpath, function (result) {
            if (result) {
                fs.unlinkSync(modelpath);
            } else {
                console.log(modelpath + ' have been del!')
            }
        });
    });
    res.render('add_classes', {
        title: '添加类型'
    });
    res.end();
*/
