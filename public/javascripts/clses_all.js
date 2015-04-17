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
    $('body').append('<div class="modal fade" id="returnBack" tabindex="-1" role="dialog" aria-hidden="true">'+
    '<div class="modal-dialog">'+
    '<div class="modal-content">'+
    '<div class="modal-header">'+
    '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
    '<h4 class="modal-title">复制排期时间</h4>'+
    '</div>'+
    '<div class="modal-body">'+
    '<div class="modal-body-message"></div>'+
    '</div>'+
    '<div class="modal-footer">'+
    '<a type="button" class="btn btn-danger">复制并新建</a>'+
    '<a type="button" class="btn btn-default" data-dismiss="modal">取消</a>'+
    '</div>'+
    '</div>'+
    '</div>'+
    '</div>');

    /**
     * new one class click event
     */
    $('.getparentID').bind('click', function () {
        //console.log(currentNodeInfo);
        if(currentNodeInfo.length){
            var contentStr = '' +
                '<div style="margin-bottom: 20px">' +
                '<label>类型名称</label>' +
                '<input class="form-control" name="class_name" type="text" placeholder="类型名称">' +
                '<label>类型表名称</label>' +
                '<input class="form-control" name="class_tab_name" type="text" placeholder="类型表名称">' +
                '<input name="parent_class_id" type="hidden" value="'+currentNodeInfo[0].classid+'"></div>' +
                '<div>' +
                '<a class="btn btn-info" id="' + newprop + '">新建类型</a>' +
                '<table class="table" >' +
                '<thead>' +
                '   <tr>' +
                '   <th>属性名称</th>' +
                '   <th>属性列名</th>' +
                '   <th>属性列属性</th>' +
                '   <th>属性长度</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody id="' + ulprop + '"></tbody>' +
                '</table>' +
                '</div>';

            var id = newModalForm('新建子类型', '/add_child_classes', contentStr,'new');

            $('#' + newprop + '').bind('click', function () {
                $('#' + ulprop + '').append('<tr>' +
                '<td>'+
                '<input name="PROP_NAME" type="text" PLACEHOLDER="属性名称">' +
                '</td><td>'+
                '<input name="PROP_COL" type="text">' +
                '</td><td>'+
                '<select name="PROP_DBMS_TYPE">' +
                '   <option value="VARCHAR">VARCHAR</option>' +
                '   <option value="INT">INT</option>' +
                '   <option value="BOOLEAN">BOOLEAN</option> ' +
                '</select>' +
                '</td><td>'+
                '<input name="PROP_LENGTH" type="text">' +
                '</td>' +

                '</tr>');
            });


            $('#' + id + '').modal({w:900});
        }else{
            alert()
        }

    });


    /**
     * del one class click event
     */
    $('.delclass').bind('click', function () {
        if(currentTreeNode.id == 0){
            alert('不可以删除根类型');
        }else {
            if (confirm('确定要删除该类型？')) {
                $.post('/delclass.json', currentTreeNode, function (data) {
                    if(data.success){
                        alert('操作成功');
                        refreshTree();
                    }else{
                        alert('操做失败\n'+data.err);
                        refreshTree();
                    }
                });
            }
        }
    });









    $('.alterclass').bind('click', function () {
        var childClassProps = [];
        var j = 0;

            for (var i = 0; i < currentNodeInfo.length; i++) {
                if (currentTreeNode.id == currentNodeInfo[i].classid) {
                    childClassProps[j] = currentNodeInfo[i];
                    j++;
                }
            }
            var id = newModalForm('修改类型属性', '/alterclass', renderPropsForAlter(childClassProps, currentTreeNode.id),'alter');
            $('#' + id + ' .modal-body .addpropinalter').bind('click', function () {
                $('#' + id + ' .modal-body table tbody').append('<tr>' +
                    '<input name="PROP_ID" type="hidden" value="new">' +
                    '<td><input name="PROP_NAME" type="text" PLACEHOLDER="属性名称"></td>' +

                    '<td><input name="PROP_COL" type="text"></td>' +

                    '<td><input name="PROP_DBMS_TYPE" type="text"></td>' +

                    '<td><input name="PROP_LENGTH" type="text"></td>' +
                    '</tr>');
            });
            $('#' + id + ' .modal-body .delthisprop').bind('click', function () {
                //console.log(this);
                var _self = $(this);
                var delColName = _self.parent().find("[name='PROP_COL']").val();
                deledcol.push(delColName);

                $(this).parent().parent().html('');
            });
            $('#' + id + ' .submitalter').bind('click', function (e) {
                if(confirm('确定修改?')){
                    var formdata = generateFormDataForPost();
                    formdata.deledProps = deledcol;
                    console.log(formdata);
                    $.post('/alterclass',formdata, function (data) {
                        if(data.success){
                            $('#'+id).find('.close').click();
                        }else{
                            console.error(data.err);
                            alert('foolish');
                        }
                    })
                }
            });
            $('#' + id + '').modal({w:900});

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
        console.log(currentModal);
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


    function newModalForm(title, action, modalbody,type) {
        deledcol = [];
        var checkType = function () {
            if(type == 'new'){
                return '<input  class="btn btn-danger " type="submit" value="提交新建">'
            }else {
                return '<input  class="btn submitalter btn-info" type="button" value="提交修改">'
            }
        }
        $('body').append('' +
        '<form name="form_'+modalid+'" class="form-horizontal" method="post" action="'+action+'">' +
        '<div class="modal fade" id="'+modalid+'">' +
        '<div class="modal-dialog">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
        '<h4 class="modal-title">' + title + '</h4>' +
        '</div>' +
        '<div class="modal-body">' +modalbody+'</div>' +
        '<div class="modal-footer">' +
         checkType()
         +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</form>');
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

        var tbody = '';
        for (var i = 0; i < childClassProps.length; i++) {
            tbody += '' +
            '<tr>' +
            '<input name="PROP_ID" type="hidden" value="' + childClassProps[i].propid + '">' +
            '   <td><input name="PROP_NAME" type="text" value="' + childClassProps[i].name + '"></td>' +
            '   <td><input name="PROP_COL" type="text" value="' + childClassProps[i].col + '"></td>' +
            '   <td><input name="PROP_DBMS_TYPE" type="text" value="' + childClassProps[i].dbms_type + '"></td>' +
            '   <td><input name="PROP_LENGTH" type="text" value="' + childClassProps[i].length + '"></td>' +
            '   <td><a class="btn btn-danger delthisprop">删除该属性</a></td>' +
            '</tr>'

        }
        tbody += '<input name="class_id" type="hidden" value="' + treeid + '">' ;
        var content = '' +
            '<table class="table">' +
            '   <thead>' +
            '       <tr>' +
            '           <td>属性名称</td>' +
            '           <td>属性列名</td>' +
            '           <td>属性列属性</td>' +
            '           <td>属性长度</td>' +
            '           <td>操作</td>' +
            '       </tr>' +
            '   </thead>' +
            '   <tbody>' +tbody+'</tbody>' +
            '<a class="btn btn-danger addpropinalter">添加属性</a>'+
            '</table>';
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