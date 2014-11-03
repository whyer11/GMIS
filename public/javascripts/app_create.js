/**
 * Created by wanghuanyu on 14-10-14.
 */
$(function () {
   //alert('you did');
    var refSelected = {};

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
            onClick: onClick
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
        $.post('/app_display.json', {appid: 0}, function (data) {
            _tree.init($('#treeDemo'), _tree.settings, _tree.maketree(data));
            _tree.getZTreeObj('treeDemo').expandAll(true);
        });
    };

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
                appid: data[i].REF_APP_ID,
                clsname:data[i].REF_CLS_NAME
            };
            nodes.push(n);
        }
        return nodes;
    };


    function onClick (event,treeId,treeNode) {
        refSelected.instname = treeNode.name;
        refSelected.clsname = treeNode.clsname;
        refSelected.refid = treeNode.id;
        refSelected.clsid = treeNode.clsid;
        $('#refto').addClass('alert alert-info').text('您已选择 : '+refSelected.instname+'\n该引用的类型为 : '+refSelected.clsname);
        $('#nextstep').addClass('btn btn-info').text('下一步');
    }

    $('#nextstep').bind('click', function (e) {
        $('#cover').html('' +
            '<div class="alert alert-info">您选择了 '+refSelected.instname+' 作为新App的根节点</div>' +
            '<h4 class="header-title">请输入这个App的名字</h4>' +
            '<p class="header-title">例如:中北学院管理器</p>' +
            '<input type="text" id="app_name">' +
            '<br>' +
            '<a class="btn btn-success" id="finish">完成App创建</a>');
        $('#finish').bind('click', function (e) {
            var input = $('#app_name');

            if(input.val() != ''){
                refSelected.appname = input.val();
                $.post('/app_finishcreate',refSelected, function (data) {
                    if(data.success){
                        alert('操作成功\n点击确定进入APP管理器进行类型连接操作');
                        window.location = '/app_manager';
                    }else{
                        alert('操作失败\n请打开控制台查看错误');
                        console.error(data.err);
                    }
                })
            }else{
                alert('App的名字不能为空');
            }
        })
    });

});