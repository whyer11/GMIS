/**
 * Created by whyer on 14-2-9.
 */
$(function () {
    $('#add_class').click(function () {
        $('#addclass_name').html("" +
            "<a>类型名称：</a>" +
            "<input type='text' id='classname'>" +
            "<a class='btn-primary' id='subclassname'>确定</a>"
        );
        $('#subclassname').click(function () {
            alert($('#classname').val());
            $.ajax({
                type: 'post',
                url: '/add_class_name.json',
                dataType: 'json',
                data: {
                    name: $('#classname').val()
                },
                success: function (data) {
                    console.log(data);
                }
            });
        });
    });
    //TODO
    function addclassprop(propkey, propvalue) {

    }


    var allclasses;
    var viewtreesettings = {
        view: {
            addHoverDom: addHoverDom,
            removeHoverDom: removeHoverDom,
            selectedMulti: false
        },
        edit: {
            enable: true,
            editNameSelectAll: true

        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            beforeDrag: beforeDrag,
            beforeEditName: beforeEditName,
            beforeRemove: beforeRemove,
            beforeRename: beforeRename,
            onRemove: onRemove,
            onRename: onRename,
            onNodeCreated: onNodeCreated,
            onClick: onClick

        }

    };
    var log, className = "dark";

    function beforeDrag(treeId, treeNodes) {
        return false;
    }

    function beforeEditName(treeId, treeNode) {
        className = (className === "dark" ? "" : "dark");
        showLog("[ " + getTime() + " beforeEditName ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        zTree.selectNode(treeNode);
        return confirm("进入节点 -- " + treeNode.name + " 的编辑状态吗？");
    }

    function beforeRemove(treeId, treeNode) {
        className = (className === "dark" ? "" : "dark");
        showLog("[ " + getTime() + " beforeRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        zTree.selectNode(treeNode);
        return confirm("确认删除 节点 -- " + treeNode.name + " 吗？");
    }

    function onRemove(e, treeId, treeNode) {
        showLog("[ " + getTime() + " onRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
    }

    function beforeRename(treeId, treeNode, newName, isCancel) {
        className = (className === "dark" ? "" : "dark");
        showLog((isCancel ? "<span style='color:red'>" : "") + "[ " + getTime() + " beforeRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>" : ""));
        if (newName.length == 0) {
            alert("节点名称不能为空.");
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            setTimeout(function () {
                zTree.editName(treeNode)
            }, 10);
            return false;
        }
        return true;
    }

    function onRename(e, treeId, treeNode, isCancel) {
        showLog((isCancel ? "<span style='color:red'>" : "") + "[ " + getTime() + " onRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>" : ""));
    }

    function showLog(str) {
        if (!log) log = $("#log");
        log.append("<li class='" + className + "'>" + str + "</li>");
        if (log.children("li").length > 8) {
            log.get(0).removeChild(log.children("li")[0]);
        }
    }

    function getTime() {
        var now = new Date(),
            h = now.getHours(),
            m = now.getMinutes(),
            s = now.getSeconds(),
            ms = now.getMilliseconds();
        return (h + ":" + m + ":" + s + " " + ms);
    }

    var newCount = 1;

    function addHoverDom(treeId, treeNode) {
        var sObj = $("#" + treeNode.tId + "_span");
        if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
        var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
            + "' title='add node' onfocus='this.blur();'></span>";
        sObj.after(addStr);
        var btn = $("#addBtn_" + treeNode.tId);
        if (btn) btn.bind("click", function () {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            zTree.addNodes(treeNode, {id: (100 + newCount), pId: treeNode.id, name: "new node" + (newCount++)});
            return false;
        });
    }

    function removeHoverDom(treeId, treeNode) {
        $("#addBtn_" + treeNode.tId).unbind().remove();
    }

    function selectAll() {
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        zTree.setting.edit.editNameSelectAll = $("#selectAll").attr("checked");
    }

    //TODO
    function onNodeCreated(treeId, treeNode) {

    }

    function onClick(event, treeId, treeNode) {
        $.post('/render_current_node.json', {'id': treeNode.id}, function (data) {
            renderNodeInfo(data.nodeInfo);
        });
    }

    //TODO
    function renderNodeInfo(nodeInfos) {
        $('#addclass_props').html('<h1>属性：</h1>');

        for (var i = 0; i < nodeInfos.length; i++) {
            $('#addclass_props').append('' +
                '<a>属性名:</a>' +
                '<a>' + nodeInfos[i].name +
                '</a>');
        }

    }

    var rootnode = [];
    window.onload = function () {
        $.get('/display_class_name.json', {}, function (data) {
            allclasses = data;
            maketree(allclasses.data);
            $.fn.zTree.init($('#treeDemo'), viewtreesettings, rootnode);
        });
    };
    var maketree = function (data) {
        for (var i = 0; i < data.length; i++) {
            var n = {
                id: data[i].CLS_ID,
                pId: data[i].PARENT_CLS_ID,
                name: data[i].CLS_NAME
            };
            rootnode.push(n);
        }
    }


});