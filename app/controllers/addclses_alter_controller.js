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
    /*
    function SQL_create_table(form) {
        var SQLstr = "";

        function mapsDatetype(Prop_type, Prop_length) {
            var str = "";
            switch (Prop_type) {
                case "VARCHAR" :
                    return str = "VARCHAR(" + Prop_length + ")";
                    break;
                case "BOOLEAN" :
                    return str = "INT";
                    break;
                case "INT" :
                    return str = "INT";
                    break;

            }
        }

        if (typeof (form.PROP_NAME) == 'string') {
            SQLstr += '`' + form.PROP_COL + '` ' + mapsDatetype(form.PROP_DBMS_TYPE, form.PROP_LENGTH) + ' NULL,';
            return SQLstr;
        } else {
            for (var i = 0; i < form.PROP_NAME.length; i++) {
                SQLstr += '`' + form.PROP_COL[i] + '` ' + mapsDatetype(form.PROP_DBMS_TYPE[i], form.PROP_LENGTH[i]) + ' NULL,';
            }
            return SQLstr;
        }
    }
    */
    ep.all('$ReturnClsCol', function (data) {
        form.class_tab_name = data.CLS_TAB_NAME;
        form.class_name = data.CLS_NAME;
        var modelContent = opt_db.newModelContent(form);
        opt_db.newModel(form.class_tab_name, modelContent);

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
                    return res.send(200,{success:false,err:err});
                }
            });
        }
            /**
             * 如果没有需要删除的列
             * 在gom_props中更新信息
             * 并记录更新前属性的列名
             */

            // 记录原来的属性列名
            var OLD_PROP_COL = form.PROP_COL;
            var newPropArrIndex = [];
            for(var i = 0;i<form.PROP_ID.length;i++){
                if(form.PROP_ID[i] == 'new'){
                    newPropArrIndex.push(i);
                    form.PROP_ID.remove(i);
                }
            }
            if(newPropArrIndex.length != 0) {
                createNewProp(newPropArrIndex, 0);
            }else{
                /**
                 * 没有新的属性需要创建
                 *
                 */

                ep.emit('$CreatedNewProps',{});
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
                            return res.send(200,{success:false,err:err});
                        }else{
                            i++;
                            if(i==indexs.length){
                                ep.emit('$CreatedNewProps',{});
                            }else {
                                return createNewIndex(indexs, i);
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
                        return res.send(200,{success:false,err:err});
                    }else{
                        ep.emit('$CreatedNewCol',{})
                    }
                })
            }

            ep.all('$CreatedNewProps', function (data) {
                /**
                 * 新的属性在gom_props注册之后
                 * 在对应的表中创建新的列
                 */
                createNewCol(req,newPropArrIndex);

            });





            /*
            req.models.gom_props.find({'PROP_ID':form.PROP_ID}).each(function (propcol) {
                var index = 0;
                for(var i = 0;i<form.PROP_ID.length;i++){
                    if(propcol.PROP_ID == form.PROP_ID[i]){
                        index = i;
                        break;
                    }
                }
                propcol.PROP_NAME = form.PROP_NAME[index];
                propcol.PROP_COL = form.PROP_COL[index];
                propcol.PROP_DBMS_TYPE = form.PROP_DBMS_TYPE[index];
                propcol.PROP_LENGTH = form.PROP_LENGTH;
                propcol.save(function (err) {
                    if(err){
                        return res.send(200,{success:false,err:err});
                    }else{
                        ep.emit('$UpdatedPropsTable',{});
                    }
                })
            });
            */


        //ep.after('$$UpdatedPropsTable',form.PROP_ID)

        return res.end();
        /**
         * 获取cls后修改该类型所对应的表的字段
         */
        /*
        req.db.driver.execQuery("DROP TABLE `gmis`.`" + form.class_tab_name + "`", function (err, result) {
            if (err) console.log(err);
            req.db.driver.execQuery("" +
                    "CREATE TABLE `gmis`.`" + form.class_tab_name + "` " +
                    "" +
                    "(`INST_ID` INT NOT NULL," +
                    "" + SQL_create_table(form) +
                    "PRIMARY KEY (`INST_ID`));", function (err, result) {
                    console.log('SQL error:' + err);
                }
            )
        });
        */
        //ep.emit('deloldprop', form);
    });
    ep.all('deloldprop', function (form) {
        gom_props.find({CLS_ID: form.class_id}).each(function (data) {
            data.remove();
            ep.emit('createnewprop', form);
        });
    });
    ep.all('createnewprop', function (form) {
        //console.log(form);
        gom_props.find(['PROP_ID', 'Z']).run(function (err, data) {
            currentPropId = data[0].PROP_ID + 1;
            if (typeof (form.PROP_NAME) == 'string') {
                gom_props.create({
                    PROP_ID: currentPropId,
                    CLS_ID: form.class_id,
                    PROP_NAME: form.PROP_NAME,
                    PROP_TYPE: "D",
                    PROP_COL: form.PROP_COL,
                    PROP_DBMS_TYPE: form.PROP_DBMS_TYPE,
                    PROP_LENGTH: form.PROP_LENGTH,
                    PROP_CAN_VISIBLE: "T",
                    PROP_CAN_MODIFY: "T",
                    PROP_CAN_DELETE: "T",
                    PROP_DISP_IND: 1,
                    PROP_CODE: form.PROP_COL
                }, function (err, item) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('update successfully(table)')
                    }
                });
            } else {
                for (var i = 0; i < form.PROP_NAME.length; i++) {
                    gom_props.create({
                        PROP_ID: ++currentPropId,
                        CLS_ID: form.class_id,
                        PROP_NAME: form.PROP_NAME[i],
                        PROP_TYPE: "D",
                        PROP_COL: form.PROP_COL[i],
                        PROP_DBMS_TYPE: form.PROP_DBMS_TYPE[i],
                        PROP_LENGTH: form.PROP_LENGTH[i],
                        PROP_CAN_VISIBLE: "T",
                        PROP_CAN_MODIFY: "T",
                        PROP_CAN_DELETE: "T",
                        PROP_DISP_IND: 1,
                        PROP_CODE: form.PROP_COL[i]
                    }, function (err, item) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('update successfully(table)')
                        }
                    });
                    currentPropId++;
                }
            }
        });
        return res.render('add_classes', {title: '类型管理器'});
    })
};