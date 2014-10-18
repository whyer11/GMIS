/**
 * Created by whyer on 14-2-9.
 */
$(function () {
    var allclasses;
    var modalid = 2009;
    var currentModal = 2009;
    var deledcol = [];
    var newprop,ulprop,parentClassId,currentTreeNode,currentNodeInfo;
    //配置ztree
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



    $('.getparentID').bind('click', function () {

        var contentStr = '<div class="row-fluid">' +
            '<div class="span4">' +
            '<label>类型名称</label>' +
            '<input name="class_name" type="text" placeholder="类型名称">' +
            '<label>类型表名称</label>' +
            '<input name="class_tab_name" type="text" placeholder="类型表名称">' +
            '<input name="parent_class_id" type="hidden" value="'+currentNodeInfo[0].classid+'"></div>' +
            '<div class="span8 pull-left">' +
            '<h3>属性</h3>' +
            '<ul class="thumbnails" id="' + ulprop + '">' +
            '</ul>' +
            '<a class="btn btn-info" id="' + newprop + '">新建类型</a>' +
            '</div>' +
            '</div>';
        var id = newModalForm('新建子类型', '/add_child_classes', contentStr);


        $('#' + id + '').modal();
    });


    $('#' + newprop + '').bind('click', function () {
        $('#' + ulprop + '').append('<li class="span4"><div class="thumbnail">' +
            '<label>属性名称</label>' +
            '<input name="PROP_NAME" type="text" PLACEHOLDER="属性名称">' +
            '<label>属性列名</label>' +
            '<input name="PROP_COL" type="text">' +
            '<label>属性列属性</label>' +
            '<select name="PROP_DBMS_TYPE">' +
            '   <option value="VARCHAR">VARCHAR</option>' +
            '   <option value="INT">INT</option>' +
            '   <option value="BOOLEAN">BOOLEAN</option> ' +
            '</select>' +
            '<label>属性长度</label>' +
            '<input name="PROP_LENGTH" type="text">' +
            '</div></li>');
    });

    $('.delclass').bind('click', function () {
        if (confirm('确定要删除该类型？')) {
            $.post('/delclass.json',currentTreeNode, function (data) {
                refreshTree();
            });
        }
    });









    $('.alterclass').bind('click', function () {
        var childClassProps = [];
        var j = 0;
        if (confirm('确定要修改此类型？')) {
            for (var i = 0; i < currentNodeInfo.length; i++) {
                if (currentTreeNode.id == currentNodeInfo[i].classid) {
                    childClassProps[j] = currentNodeInfo[i];
                    j++;
                }
            }
            var id = newModalForm('修改类型属性', '/alterclass', renderPropsForAlter(childClassProps, currentTreeNode.id));
            $('#' + id + ' .modal-body .addpropinalter').bind('click', function () {
                $('#' + id + ' .modal-body').append('<li class="span4"><div class="thumbnail">' +
                    '<input name="PROP_ID" type="hidden" value="new">' +
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
                //console.log(this);
                var _self = $(this);
                var delColName = _self.parent().find("[name='PROP_COL']").val();
                deledcol.push(delColName);

                $(this).parent().html('');
            });
            $('#' + id + ' .submitalter').bind('click', function (e) {
                if(confirm('确定修改?')){
                    var formdata = generateFormDataForPost();
                    formdata.deledProps = deledcol;
                    $.post('/alterclass',formdata, function (data) {

                    })
                }
            });
            $('#' + id + '').modal();
        }
    });











    //  ztree节点单击事件回调函数
    function onClick(event, treeId, treeNode) {
        currentTreeNode = treeNode;
        $.post('/render_current_node.json', {'id': treeNode.id}, function (data) {
            currentNodeInfo = data.nodeInfo;
            renderNodeInfo(data.nodeInfo);

            newprop = 'prop_' + modalid;
            ulprop = 'ulprop_' + modalid;
            parentClassId = 'parent_class_id_' + modalid;
        });
    }

    function generateFormDataForPost () {
        var formdata = {};
        var _form = document.forms["form_"+currentModal].elements;
        var example = { PROP_ID: '42',
            deledProps: '',
            PROP_NAME: '系人数',
            PROP_COL: 'XI_NUM',
            PROP_DBMS_TYPE: 'VARCHAR',
            PROP_LENGTH: '11',
            class_id: '3' };

        var pattern=/^\d+$/;
        for(val in _form){
            //判断是一个值还是一组
            if(_form[val]) {
                if(pattern.test(val) == false) {
                    if (_form[val].value == "") {
                        formdata[val] = [];
                        for (var i = 0; i < _form[val].length; i++) {

                            formdata[val][i] = _form[val][i].value;
                        }
                    } else {
                        formdata[val] = _form[val].value;
                    }
                }
            }
        }
        //console.log(formdata);
        return formdata;
    }


    function newModalForm(title, action, modalbody) {
        deledcol = [];
        $('body').append('<form name="form_'+modalid+'" class="form-horizontal">' +
            '<div class="modal fade mymodal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" id="' + modalid + '">' +
            '<div class="modal-header">' +
            '<button class="close" type="button" data-dismiss="modal" aria-hidden="true">&times;</button>' +
            '<h3>' + title + '</h3></div>' +
            '<div class="modal-body">' + modalbody + '</div>' +
            '<div class="modal-footer">' +
            '<input  class="btn submitalter" type="button" value="提交">' +
            '</div></form>');
        currentModal = modalid;
        return modalid++;
    }

    function renderNodeInfo(nodeInfos) {
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
        refreshTree();
    };

    function refreshTree () {
        $.get('/display_class_name.json', {}, function (data) {
            allclasses = data;
            maketree(allclasses.data);
            $.fn.zTree.init($('#treeDemo'), viewtreesettings, maketree(allclasses.data));
            $.fn.zTree.getZTreeObj('treeDemo').expandAll(true);
        });
    }

    function maketree(data) {
        var rootnode = [];
        for (var i = 0; i < data.length; i++) {
            var n = {
                id: data[i].CLS_ID,
                pId: data[i].PARENT_CLS_ID,
                name: data[i].CLS_NAME
            };
            rootnode.push(n);
        }
        return rootnode;
    }
});