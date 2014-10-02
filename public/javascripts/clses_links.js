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

    var currentTreeNode;
    /**
     * zTree上节点Click事件的回调函数,监听Click事件
     * @param event Click事件中所有的信息
     * @param treeId Click事件中所点击的Node Html的id
     * @param treeNode Click事件中所点击的Node 所有信息
     */
    function onClick(event,treeId,treeNode) {
        currentTreeNode = treeNode;
        refreshLinked(currentTreeNode);
    }

    function refreshLinked (treeNode) {
        if(treeNode.id == 0){
            alert('您无法为根类型指定类型连接')
        }else{
            $.post('/clslinks_linked',treeNode, function (data) {
                $('#linked').html(generatelinked(data.linked));
            })
        }
    }

    /**
     *
     */
    function refreshTree () {
        $.get('/display_class_name.json', {}, function (data) {
            //console.log(data);
            maketree(data.data);
            $.fn.zTree.init($('#treeDemo'), viewTreeSettings, maketree(data.data));
            $.fn.zTree.getZTreeObj('treeDemo').expandAll(true);
        });
    }

    /**
     *
     * @param data
     * @returns {Array}
     */
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

    /**
     * 生成已连接的类型HTML
     * @param linked
     * @returns {string}
     */
    function generatelinked (linked) {
        var linkedHtml = '';
        for(var i = 0;i<linked.length;i++){
            linkedHtml += '' +
                '<div class="accordion-group">' +
                '   <div class="accordion-heading">' +
                '       <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#linked" href="#linked_'+i+'">'+linked[i].CLS_NAME+'</a>' +
                '   </div>' +
                '   <div id="linked_'+i+'" class="accordion-body collapse">' +
                '       <div class="accordion-inner">'+generateAccBody(linked[i])+'</div>' +
                '   </div>' +
                '</div>';
        }
        return  linkedHtml;
    }

    /**
     * 生成accordion-inner中每个类型的详细内容
     * @param clscol
     * @returns {string}
     */
    function generateAccBody (clscol) {
        var innerBody = '';
        for(val in clscol){
            innerBody += '<li><a>'+val+'</a>:<a>'+clscol[val]+'</a></li>';
        }
        innerBody = '<ul>'+innerBody+'</ul>';
        return innerBody;
    }
});