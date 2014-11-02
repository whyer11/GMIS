/**
 * Created by whyer on 14-3-13.
 */
var fs = require('fs');
var opt_db = require('../middleware/opt_db');
var EventProxy = require('eventproxy');
var ep = new EventProxy();

module.exports = function (req, res) {
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

    var gom_props = req.models.gom_props;
    var gom_clses = req.models.gom_clses;
    var form = req.body;
    var _clsid = req.body.class_id;
    console.log(form);
    /**
     * TODO
     * alter table(name) add col
     *
     * 修改删除....
     *
     *
     * 重构逻辑
     *
     * 保证数据
     *
     */


    gom_clses.get(form.class_id, function (err, data) {
        ep.emit('$ReturnClsCol', data);
    });

    ep.all('$ReturnClsCol', function (data) {
        form.class_tab_name = data.CLS_TAB_NAME;
        form.class_name = data.CLS_NAME;
        var modelContent = opt_db.newModelContent(form);
        opt_db.newModel(form.class_tab_name, modelContent);

        // 记录原来的属性列名


        var OLD_PROP_COL = [];
        for(var i = 0;i<form.PROP_COL.length;i++){
            OLD_PROP_COL[i] = form.PROP_COL[i];
        }
        /**
         *
         */
        if(form.deledProps){
            var delSQL = "ALTER TABLE `gmis`.`"+form.class_tab_name+"`";
            for(var i = 0;i<form.deledProps.length;i++){
                if(i == 0){
                    delSQL = delSQL+" DROP COLUMN `"+form.deledProps[i]+"`";
                }else{
                    delSQL = delSQL+",DROP COLUMN `"+form.deledProps[i]+"`";
                }

            }
            delSQL = delSQL+';';
            console.log(delSQL);
            req.db.driver.execQuery(delSQL, function (err,result) {
                if(err){
                    console.log(err);
                    req.db.driver.close();
                    return res.send(200,{success:false,err:err});
                }else{
                    /**
                     * 在gom_props中删除需要删除的props记录
                     */
                    req.models.gom_props.find({'PROP_COL':form.deledProps}).each(function (propcol) {
                        propcol.remove(function (err) {
                            if(err){
                                req.db.driver.close();
                                return res.send(200,{success:false,err:err});
                            }
                        })
                    })
                }
            });
        }
            /**
             * 如果没有需要删除的列
             * 在gom_props中更新信息
             * 并记录更新前属性的列名
             */



            var newPropArrIndex = [];
            if(form.PROP_ID) {
                for (var i = 0; i < form.PROP_ID.length; i++) {
                    if (form.PROP_ID[i] == 'new') {
                        newPropArrIndex.push(i);
                        form.PROP_ID.remove(i);
                    }
                }
                console.log(form.PROP_ID);
            }else{
                return res.send(200,{success:true,err:'null'});
            }

                if (newPropArrIndex.length != 0) {
                    console.log('开始创建新的属性');
                    createNewProp(newPropArrIndex, 0);
                } else {
                    /**
                     * 没有新的属性需要创建
                     *
                     */
                    console.log('未检测到有新的属性');
                    console.log('开始修改属性');
                    alterExitedProps(form.PROP_ID, 0);

                }

            ep.all('$CreatedNewProps', function (data) {
                /**
                 * 新的属性在gom_props注册之后
                 * 在对应的表中创建新的列
                 */
                console.log('开始创建新属性');

                createNewCol(req,newPropArrIndex);

            });


            ep.all('$CreatedNewCol', function (data) {
                /**
                 * 已经处理删除,新建
                 *
                 * 修改某个列
                 *
                 *
                 */

                console.log('开始修改属性');
                alterExitedProps(form.PROP_ID,0);

            });

        ep.all('$AlteredProps', function (data) {
            console.log('请求完毕');
            req.db.driver.close();
            return res.send(200,{success:true,err:null});
        });


        function alterExitedProps (propids,index) {
            var i = index;
            //console.log(propids[i]);
            req.models.gom_props.get(propids[i], function (err, propcol) {
                OLD_PROP_COL[i] = propcol.PROP_COL;
                propcol.PROP_NAME = form.PROP_NAME[i];
                propcol.PROP_COL = form.PROP_COL[i];
                propcol.PROP_DBMS_TYPE = form.PROP_DBMS_TYPE[i];
                propcol.PROP_LENGTH = form.PROP_LENGTH[i];
                propcol.save(function (err) {
                    if(err){
                        console.log(err);
                        req.db.driver.close();
                        return res.send(200,{success:false,err:err});
                    }else{

                        var alterSQLStr = 'ALTER TABLE `gmis`.`'+form.class_tab_name+'` CHANGE COLUMN `'+OLD_PROP_COL[i]+'` `'+form.PROP_COL[i]+'` VARCHAR('+form.PROP_LENGTH[i]+') NULL DEFAULT NULL ;';
                        req.db.driver.execQuery(alterSQLStr, function (err, result) {
                            if(err){
                                console.log(err);
                                req.db.driver.close();
                                return res.send(200,{success:false,err:err});
                            }else{
                                i++;
                                if(i == propids.length){
                                    /**
                                     * 修改完毕,发布事件
                                      */
                                    console.log('修改属性完毕');
                                    ep.emit('$AlteredProps',{});
                                }else {
                                    return alterExitedProps(propids, i);
                                }
                            }
                        })

                    }
                })
            })
        }

            /**
             * 处理新创建的属性
             * 先在gom_props注册
             * 注册后在对应的表中插入新的列
             *
             * @param indexs
             * @param index
             */
            function createNewProp (indexs,index) {
                var i = index;
                opt_db.checkNewPropId(req, function (err, id) {
                    req.models.gom_props.create({
                        PROP_ID: id,
                        CLS_ID: _clsid,
                        PROP_NAME: form.PROP_NAME[indexs[i]],
                        PROP_TYPE: "D",
                        PROP_COL: form.PROP_COL[indexs[i]],
                        PROP_DBMS_TYPE: form.PROP_DBMS_TYPE[indexs[i]],
                        PROP_LENGTH: form.PROP_LENGTH[indexs[i]],
                        PROP_CAN_VISIBLE: "T",
                        PROP_CAN_MODIFY: "T",
                        PROP_CAN_DELETE: "T",
                        PROP_DISP_IND: 1,
                        PROP_CODE: form.PROP_COL[indexs[i]]
                    }, function (err, item) {
                        if(err){
                            console.log(err);
                            req.db.driver.close();
                            return res.send(200,{success:false,err:err});
                        }else{
                            i++;
                            if(i==indexs.length){
                                console.log('创建新属性完毕');
                                ep.emit('$CreatedNewProps',{});
                            }else {
                                return createNewProp(indexs, i);
                            }
                        }
                    })
                })
            }

            function createNewCol (req,indexs) {
                var createSQLStr = 'ALTER TABLE `gmis`.`'+form.class_tab_name+'`';
                for(var i = 0;i<indexs.length;i++){
                    if(i == 0){
                        createSQLStr += 'ADD COLUMN `'+form.PROP_COL[indexs[i]]+'` VARCHAR(45) NULL';
                    }else{
                        createSQLStr += ',ADD COLUMN `'+form.PROP_COL[indexs[i]]+'` VARCHAR(45) NULL';
                    }
                    createSQLStr = createSQLStr+';';
                }
                req.db.driver.execQuery(createSQLStr, function (err,result) {
                    if(err){
                        console.log(err);
                        req.db.driver.close();
                        return res.send(200,{success:false,err:err});
                    }else{
                        /**
                         * 发布已经完成创建列的事件
                         */
                        console.log('创建新列完毕');
                        ep.emit('$CreatedNewCol',{})
                    }
                })
            }

    });
};



