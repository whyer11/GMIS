/**
 * Created by wanghuanyu on 14-10-28.
 */
$(function () {

    /**
     *
     * @type {{}}
     * @private
     */
    var _currentGrantor = {};

    //将$中封装的Ztree插件赋给全局变量
    /**
     *
     * @type {$.zTree|*}
     * @private
     */
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
        $.post('/show_allgrantors', {}, function (data) {
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
                id: data[i].GRANTOR_ID,
                pId: data[i].PARENT_GRANTOR_ID,
                name: data[i].GRANTOR_NAME
            };
            nodes.push(n);
        }
        return nodes;
    };

    function onClick (event,treeid,treeNode){
        _currentGrantor.GRANTOR_ID = treeNode.id;
        $.post('/show_aau',_currentGrantor, function (data) {
            refreshAuthed(data.authed);
            refreshUnauthed(data.unauthed);
            bindAuthedClick();
            bindUnauthedClick();
        })

    }

    function refreshAuthed (authed){
        if(authed.length == 0){
            $('#authed').html('');
        }else{
            var authedStr = '';
            for(var i = 0;i<authed.length;i++){
                authedStr += '<a class="btn btn-primary" data-appid = "'+authed[i].APP_ID+'">' + authed[i].APP_NAME + '</a><br>';
                if(i == authed.length -1){
                    $('#authed').html(authedStr);
                }
            }
        }
    }

    function refreshUnauthed (unauthed){
        if(unauthed.length == 0){
            $('#unauthed').html('');
        }else{
            var unauthedStr = '';
            for(var i = 0;i<unauthed.length;i++){
                unauthedStr += '<a class="btn btn-primary" data-appid = "'+unauthed[i].APP_ID+'">' + unauthed[i].APP_NAME + '</a><br>';
                if(i == unauthed.length -1){
                    $('#unauthed').html(unauthedStr);
                }
            }
        }
    }

    function bindAuthedClick (){
        $('#authed a').bind('click', function (e) {
            var _self = $(this);
            var commit = {
                appid:_self.data('appid'),
                grantorid:_currentGrantor.GRANTOR_ID,
                del:true
            };
            $.post('/authed_or_unauthed',commit, function (data) {
                if(data.success){
                    $.post('/show_aau',_currentGrantor, function (data) {
                        refreshAuthed(data.authed);
                        refreshUnauthed(data.unauthed);
                        bindAuthedClick();
                        bindUnauthedClick();
                    })
                }
            })
        })
    }

    function bindUnauthedClick (){
        $('#unauthed a').bind('click', function (e) {
            var _self = $(this);
            var commit = {
                appid:_self.data('appid'),
                grantorid:_currentGrantor.GRANTOR_ID,
                del:false
            };
            $.post('/authed_or_unauthed',commit, function (data) {
                if(data.success){
                    $.post('/show_aau',_currentGrantor, function (data) {
                        refreshAuthed(data.authed);
                        refreshUnauthed(data.unauthed);
                        bindAuthedClick();
                        bindUnauthedClick();
                    })
                }
            })
        })
    }
});