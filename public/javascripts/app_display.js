/**
 * Created by whyer on 14-3-23.
 */
$(function () {
    //获取当前app的appid
    var curappid = $('#app').val();
    //配置Ztree
    var viewtreesettings = {
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

     */
    var deleteObj = {
        label: '删除',
        action: function (item, treeNode) {

        }
    };

    /*

     */
    var alterObj = {
        label: '修改',
        action: function (item, treeNode) {

        }
    };

    var contextMenuSettings = {
        contextMenuClass: 'contextMenu',
        contextSeperatorClass: 'contextDivider',
        items: [
            alterObj,
            deleteObj,
            null
        ]
    };
    /*
     * 监听load事件
     * 与后端交换信息，获取对象树的节点信息
     * 初始化对象树
     */
    window.onload = function () {
        $.post('/app_display.json', {appid: curappid}, function (data) {
            $.fn.zTree.init($('#treeDemo'), viewtreesettings, maketree(data));
        })
    };
    /* function maketree
     * 将ajax回调的节点数据转为对象数组，并返回数组
     */
    function maketree(data) {
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
    }

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
        //console.log(treeNode);
        //console.log(event);
        $.post('/app_rightclick.json', treeNode, function (cls) {
            //console.log(cls);

            for (var i = 0; i < cls.length; i++) {
                var item = {
                    label: '创建' + cls[i].CLS_NAME,
                    action: function (item, treeNode) {
                        createTreeObj(item, treeNode)
                    },
                    clsid: cls[i].CLS_ID
                };
                contextMenuSettings.items.push(item);
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
            console.log(data);
            var htmlstr = '';
            for (val in data) {
                htmlstr += '<p>' + val + ' : ' + data[val] + '</p>';
            }
            $('.hero-unit').html(htmlstr);
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

    /*
     *
     */
    function createTreeObj(item, treeNode) {
        $.post('/app_render_node_info.json',item,function(data){
            console.log(data);
        });
    }


});