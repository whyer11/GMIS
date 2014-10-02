/**
 * Created by wanghuanyu on 14-9-30.
 */
$(function () {
    var viewTreeSettings = {
       view:{
           selectedMulti:false
       },
       edit:{
           enable:false,
           editNameSelectAll:false
       },
       data:{
           simpleData:{
               enable:true
           }
       },
       callback:{
           onClick:onClick
       }
    };

    function onClick(event,treeId,treeNode) {
        console.log(event);
        console.log(treeId);
        console.log(treeNode);
    }

    function refreshTree () {
        $.get('/display_class_name.json', {}, function (data) {
            maketree(data.data);
            $.fn.zTree.init($('#treeDemo'), viewTreeSettings, maketree(data.data));
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

    window.onload = function () {
        refreshTree();
    };
});