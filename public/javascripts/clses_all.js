/**
 * Created by whyer on 14-2-9.
 */
$(function () {
    var allclasses;
    var rootnode = [];
    var modalid = 2009;
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
            onClick: onClick

        }

    };

    function onClick(event, treeId, treeNode) {
        $.post('/render_current_node.json', {'id': treeNode.id}, function (data) {
            renderNodeInfo(data.nodeInfo);
            console.log(data.nodeInfo);
            var newprop = 'prop_' + modalid;
            var ulprop = 'ulprop_' + modalid;
            var parentClassId = 'parent_class_id_' + modalid;
            $('.getparentID').bind('click', function () {
                var self = $('.getparentID');
                var contentStr = '<div class="row-fluid">' +
                    '<div class="span4">' +
                    '<label>类型名称</label>' +
                    '<input name="class_name" type="text" placeholder="类型名称">' +
                    '<label>类型表名称</label>' +
                    '<input name="class_tab_name" type="text" placeholder="类型表名称">' +
                    '<input name="parent_class_id" type="hidden" id="' + parentClassId + '"></div>' +
                    '<div class="span8 pull-left">' +
                    '<h3>属性</h3>' +
                    '<ul class="thumbnails" id="' + ulprop + '">' +
                    '' +
                    '</ul>' +
                    '<a class="btn btn-info" id="' + newprop + '">新建类型</a>' +
                    '</div>' +
                    '</div>';
                var id = newModalForm('新建子类型', '/add_child_classes', contentStr);

                $('#' + parentClassId + '').val(self.data('classid'));
                $('#' + newprop + '').bind('click', function () {
                    $('#' + ulprop + '').append('<li class="span4"><div class="thumbnail">' +
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
                $('#' + id + '').modal();
            });
            $('.delclass').bind('click', function () {
                if (confirm('确定要删除该类型？')) {
                    $.post('/delclass.json', {'id': treeNode.id}, function (data) {
                        window.location.reload();
                    });
                }
            });
            $('.alterclass').bind('click', function () {
                var childClassProps = [];
                var j = 0;
                if (confirm('确定要修改此类型？')) {
                    for (var i = 0; i < data.nodeInfo.length; i++) {
                        if (treeNode.id == data.nodeInfo[i].classid) {
                            childClassProps[j] = data.nodeInfo[i];
                            j++;
                        }
                    }
                    var id = newModalForm('修改类型属性', '/alterclass', renderPropsForAlter(childClassProps, treeNode.id));
                    $('#' + id + ' .modal-body .addpropinalter').bind('click', function () {
                        $('#' + id + ' .modal-body').append('<li class="span4"><div class="thumbnail">' +
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
                    $('#' + id + ' .modal-body .delthisprop').bind('click', function () {
                        $(this).parent().html('');
                    });
                    $('#' + id + '').modal();
                }
            });
        });
    }

    function newModalForm(title, action, modalbody) {
        $('body').append('<form class="form-horizontal" method="post" action=' + action + '>' +
            '<div class="modal fade mymodal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" id="' + modalid + '">' +
            '<div class="modal-header">' +
            '<button class="close" type="button" data-dismiss="modal" aria-hidden="true">&times;</button>' +
            '<h3>' + title + '</h3></div>' +
            '<div class="modal-body">' + modalbody + '</div>' +
            '<div class="modal-footer">' +
            '<input class="btn" type="submit">' +
            '<button class="btn">关闭</button></div>' +
            '</div></form>');
        return modalid++;

    }

    function renderNodeInfo(nodeInfos) {
        $('#class_opts').html('<div class="optionsbar">' +
            '<a class="classopts delclass">删除</a>' +
            '<a class="classopts alterclass">修改</a>' +
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

    function renderPropsForAlter(childClassProps, treeid) {
        var content = '';
        for (var i = 0; i < childClassProps.length; i++) {
            content += '<li class="span4"><div class="thumbnail">' +
                '<input name="PROP_ID" type="hidden" value="' + childClassProps[i].propid + '">' +
                '<label>属性名称</label>' +
                '<input name="PROP_NAME" type="text" value="' + childClassProps[i].name + '">' +
                '<label>属性列名</label>' +
                '<input name="PROP_COL" type="text" value="' + childClassProps[i].col + '">' +
                '<label>属性列属性</label>' +
                '<input name="PROP_DBMS_TYPE" type="text" value="' + childClassProps[i].dbms_type + '">' +
                '<label>属性长度</label>' +
                '<input name="PROP_LENGTH" type="text" value="' + childClassProps[i].length + '">' +
                '<a class="btn btn-danger delthisprop">删除该属性</a> ' +
                '</div></li>';
        }
        content += '<input name="class_id" type="hidden" value="' + treeid + '">' +
            '<a class="btn btn-danger addpropinalter">添加属性</a>';
        return content;
    }

    window.onload = function () {
        $.get('/display_class_name.json', {}, function (data) {
            allclasses = data;
            maketree(allclasses.data);
            $.fn.zTree.init($('#treeDemo'), viewtreesettings, rootnode);
        });


    }

    function maketree(data) {
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