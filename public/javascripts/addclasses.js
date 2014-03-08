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
            beforeRemove: beforeRemove

        }

    };

    function beforeRemove(event, treeId, treeNode) {


    }

    function onClick(event, treeId, treeNode) {
        $.post('/render_current_node.json', {'id': treeNode.id}, function (data) {
            renderNodeInfo(data.nodeInfo);
            $('.getparentID').bind('click', function () {
                var self = $('.getparentID');
                $('#parent_class_id').val(self.data('classid'));
            });
            $('.delclass').bind('click', function () {
                if (confirm('确定要删除该类型？')) {
                    $.post('/delclass.json', {'id': treeNode.id}, function (data) {
                        console.log(data + 'I am here');
                    });
                }
            })

        });


    }

    //TODO
    function renderNodeInfo(nodeInfos) {
        $('#class_opts').html('<div class="optionsbar">' +
            '<a class="classopts delclass">删除</a>' +
            '<a class="classopts">修改</a>' +
            '<a class="classopts getparentID" id="classID_' + nodeInfos[0].classid + '" data-classid = "' + nodeInfos[0].classid + '" data-target="#myModal" data-toggle="modal">新建</a>' +
            '</div>'
        );
        $('#class_props').html('');
        for (var i = 0; i < nodeInfos.length; i++) {
            $('#class_props').append(
                '<tr>' +
                    '<th>' + nodeInfos[i].name + '</th>' +
                    '<th>' + nodeInfos[i].type + '</th>' +
                    '<th>' + nodeInfos[i].col + '</th>' +
                    '<th>' + nodeInfos[i].dbms_type + '</th>' +
                    '<th>' + nodeInfos[i].length + '</th>' +
                    '<th>' + nodeInfos[i].can_visible + '</th>' +
                    '<th>' + nodeInfos[i].can_modify + '</th>' +
                    '<th>' + nodeInfos[i].can_delete + '</th>' +
                    '<th>' + nodeInfos[i].code + '</th>' +
                    '</tr>');
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