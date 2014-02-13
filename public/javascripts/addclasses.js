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
    var rootnode = [];
    var viewtreesettings = {
        view: {
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
            onClick: onClick

        }

    };

    function onClick(event, treeId, treeNode) {
        $.post('/render_current_node.json', {'id': treeNode.id}, function (data) {
            renderNodeInfo(data.nodeInfo);
        });
    }

    //TODO
    function renderNodeInfo(nodeInfos) {
        $('#addclass_props').html('<h1>属性：</h1>' +
            '<a class="btn btn-primary" id="addnewnode" data-target="#myModal" data-toggle="modal">新建子类型</a>');
        for (var i = 0; i < nodeInfos.length; i++) {
            $('#addclass_props').append('' +
                '<a>属性名:</a>' +
                '<a>' + nodeInfos[i].name +
                '</a>');
        }

    }

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