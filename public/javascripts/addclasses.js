/**
 * Created by whyer on 14-2-9.
 */
$(function () {

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
            $('.getparentID').bind('click', function () {
                var self = $('.getparentID');
                $('#parent_class_id').val(self.data('classid'));
            });
        });

    }

    //TODO
    function renderNodeInfo(nodeInfos) {
        $('#addclass_props').html('<h1>属性：</h1>' +
            '<a class="btn btn-primary getparentID" id="classID_' + nodeInfos[0].id + '" data-classid = "' + nodeInfos[0].id + '" data-target="#myModal" data-toggle="modal">新建子类型</a>');
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
    };

    $('#newprop').click(function () {
        $('#props').append('<li class="span4"><div class="thumbnail">' +
            '<label>属性名称</label>' +
            '<input name="PROP_NAME" type="text" PLACEHOLDER="属性名称">' +
            '<label>属性列名</label>' +
            '<input name="PROP_COL" type="text">' +
            '<label>属性列属性</label>' +
            '<input name="PROP_DBMS_TYPE" type="text">' +
            '<label>属性长度</label>' +
            '<input name="PROP_LENGTH" type="text">' +
            '</div></li>');
    });

});