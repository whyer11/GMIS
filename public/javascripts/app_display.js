/**
 * Created by whyer on 14-3-23.
 */
$(function () {


    //获取当前app的appid
    var curappid = $('#app').val();
    var deleteObj = {
        label: '删除',
        action: function (item, treeNode) {
            delTreeObj(item,treeNode);
        }
    };
    var alterObj = {
        label: '修改',
        action: function (item, treeNode) {
            alterTreeObj(item,treeNode);
        }
    };

    var operatearea = $('#operatearea');
    var contextMenuSettings = {
        contextMenuClass: 'contextMenu',
        contextSeperatorClass: 'contextDivider',
        items: [
            alterObj,
            deleteObj,
            null
        ]
    };
    //将$中封装的Ztree插件赋给全局变量
    var _tree = $.fn.zTree;
    //配置Ztree
    _tree.settings = {
        view: {
            selectedMulti: false
        },
        edit: {
            enable: false,
            editNameSelectAll: false

        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onClick: onClick,
            onRightClick: onRightClick
        }
    };
    /*
     * 监听load事件
     * 与后端交换信息，获取对象树的节点信息
     * 初始化对象树
     */
    window.onload = function () {
        _tree.refreshall();
    };

    _tree.refreshall = function () {
        $.post('/app_display.json', {appid: curappid}, function (data) {
            _tree.init($('#treeDemo'), _tree.settings, _tree.maketree(data));
            _tree.getZTreeObj('treeDemo').expandAll(true);
        });
    }

    /* function maketree
     * 将ajax回调的节点数据转为对象数组，并返回数组
     */
    _tree.maketree = function (data) {
        var nodes = [];
        for (var i = 0; i < data.length; i++) {
            var n = {
                id: data[i].REF_ID,
                pId: data[i].PARENT_REF_ID,
                name: data[i].REF_NAME,
                clsid: data[i].REF_CLS_ID,
                instid: data[i].REF_INST_ID,
                appid: data[i].REF_APP_ID
            };
            nodes.push(n);
        }
        return nodes;
    };

    /* Ztree节点的click事件
     * treeId获取生成对象数组时设置的id
     * treeNode获取当前节点的整个对象
     */
    function onClick(event, treeId, treeNode) {
        renderNodeInfo(treeNode);

    }

    /* 定义鼠标右击树节点的事件
     *
     */
    function onRightClick(e, tree, treeNode) {
        $.post('/app_rightclick.json', treeNode, function (data) {


                for (var i = 0; i < data.length; i++) {
                    if(data[i].IS_WEAK == 'F') {
                        var item = {
                            label: '创建' + data[i].CLS_NAME,
                            action: function (item, treeNode) {
                                createTreeObj(item, treeNode)
                            },
                            clsid: data[i].CLS_ID
                        };
                        contextMenuSettings.items.push(item);
                    }
                }

            var menu = createContextMenu(e, treeNode).show();
            var bg = $('<div></div>')
                .css({left: 0, top: 0, width: '100%', height: '100%', position: 'absolute', zIndex: 9999})
                .appendTo(document.body).bind('contextmenu click', function () {
                    bg.remove();
                    menu.remove();
                    contextMenuSettings.items = [alterObj, deleteObj, null];
                    return false;
                });
            menu.find('a').click(function () {
                menu.remove();
                bg.remove();
                contextMenuSettings.items = [alterObj, deleteObj, null];
            })
        })
    }

    /*
     生成操作按钮并绑定按钮类型

     */
    function renderNodeInfo(treenodeobj) {

        $.post('/app_render_node_info.json', treenodeobj, function (data) {
            var objinfo = '';
            for(val in data){
                objinfo += '<li><span>'+val+' : '+data[val]+'</span></li>'
            }
            var htmlstr = '' +
                '<div class="well-edit clearfix">' +
                '<button class="btn btn-danger pull-left" id="editnow">编辑</button>' +
                '</div>' +
                '<div class="obj-view">' +
                '<ul>' +
                objinfo +
                '</ul>' +
                '</div>';

            operatearea.html(htmlstr);
        });
    }

    /*
     *
     */
    function createContextMenu(e, treeNode) {
        var left = e.pageX + 1;
        var top = e.pageY - 3;
        var menu = $('<ul class="' + contextMenuSettings.contextMenuClass + '">' +
            '</ul>').appendTo(document.body);
        contextMenuSettings.items.forEach(function (item) {
            if (item) {
                var rowCode = '<li><a><span></span></a></li>';
                var row = $(rowCode).appendTo(menu);
                row.find('span').text(item.label);
                if (item.action) {
                    row.find('a').click(function () {
                        item.action(item, treeNode)
                    });
                }
            } else {
                $('<li class="' + contextMenuSettings.contextSeperatorClass + '"></li>').appendTo(menu);
            }

        });
        if (top + menu.height() >= $(window).height()) {
            top -= menu.height();
        }
        if (left + menu.width() >= $(window).width()) {
            left -= menu.width();
        }
        menu.css({zIndex: 10000, left: left, top: top});
        return menu
    }

    /**
     *
     * @param item
     * @param treeNode
     */
    function createTreeObj(item, treeNode) {
        //console.log(item);
        var items = {
            clsid : item['clsid'],
            refid : treeNode['id']
        };
        $.post('/app_render_add_obj_form.json',items,function(data){
            var objinfo = '';
            //console.log(data);
            for (val in data.parentInfo)
            {
                objinfo+='<li><span><label>'+val+'</label></span><p>'+data.parentInfo[val]+'</p></li>';
            }
            for (val in data.selfInfo) {
                objinfo+='<li><span><label>'+data.selfInfo[val]+'</label></span><input id="new_'+val+'" type="text" placeholder="请输入'+data.selfInfo[val]+'"></li>';
            }
            var htmlstr = '' +
                '<div class="well-cancel clearfix">' +
                    '<button class="btn btn-danger pull-left" id="cancelnew">取消</button>' +
                    '<button class="btn btn-success pull-right" id="savenew">保存</button>' +
                '</div>' +
                '<div class="obj-view">' +
                    '<ul id="newobjarea">' +
                        objinfo +
                    '</ul>' +
                '</div>';

            operatearea.html(htmlstr);
            $('#cancelnew').bind('click', function () {
                operatearea.html('');
            });
            $('#savenew').bind('click', function () {
                if(commitObj(data.selfInfo,'new')){
                    var commit = {};
                    commit.clsid = item.clsid;
                    commit.refid = treeNode.id;
                    commit.props = commitObj(data.selfInfo,'new');
                    //console.log(commit);
                }
                $.post('/app_addobj.json',commit, function (data) {
                    if(data.success == true){
                        _tree.refreshall();
                        operatearea.html('');
                    }
                })
            })
        });
    }

    /**
     *
     * @param tablecols
     * @param type
     * @returns {{}}
     */
    function commitObj (tablecols,type) {

        var commit = {};

        for(val in tablecols){

            if($('#'+type+'_'+val).val()===''){
                alert('a');
                return false;
            }else{
                commit['_'+val]=$('#'+type+'_'+val).val();
            }
        }
        //console.log(commit);
            return commit


    }

    /**
     * TODO
     * @param item
     * @param treeNode
     */
    function delTreeObj (item,treeNode) {
        $.post('/app_delobj.json',treeNode, function (data) {
            if(data.success){
                alert('操作成功');
                _tree.refreshall();
            }else{
                alert('操作失败\n错误信息:'+data.err);
                _tree.refreshall();
            }
        })
    }

    function alterTreeObj(item,treeNode) {

        if(treeNode.id == 0){
            alert('无法修改根对象');
        }else{


            $.post('/app_alterobj.json',treeNode, function (data) {


                var alterinfo = '';
                for(val in data){
                    alterinfo += '<li><span><label>'+data[val]+'</label></span><input id="alter_'+val+'" type="text" placeholder="请输入'+data[val]+'"></li>'
                }
                var htmlStr = '' +
                    '<div class="well-cancel clearfix">' +
                    '<button class="btn btn-danger pull-left" id="cancelalter">取消</button>' +
                    '<button class="btn btn-success pull-right" id="savealter">保存</button>' +
                    '</div>' +
                    '<div class="obj-view">' +
                    '<ul id="newobjarea">' +
                    alterinfo +
                    '</ul>' +
                    '</div>';
                operatearea.html(htmlStr);

                $('#cancelalter').bind('click', function (e) {
                    operatearea.html('');
                });


                $('#savealter').bind('click', function (e) {
                    if(commitObj(data,'alter')){
                        var commit = {};
                        commit.clsid = treeNode.clsid;
                        commit.refid = treeNode.id;
                        commit.props = commitObj(data,'alter');

                    }

                    $.post('/app_savealter.json',commit, function (data) {
                        if(data.success){
                            alert('操作成功');
                            _tree.refreshall();
                            operatearea.html('');
                        }else{
                            alert('操作失败\n原因是:'+data.err);
                        }
                    })

                })

            })

        }
    }
});