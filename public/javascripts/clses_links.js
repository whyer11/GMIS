/**
 * Created by wanghuanyu on 14-9-30.
 */
$(function () {
    /* 方法:Array.remove(dx)
     * 功能:删除数组元素.
     * 参数:dx删除元素的下标.
     * 返回:在原数组上修改数组
     */
    //经常用的是通过遍历,重构数组.
    Array.prototype.remove=function(dx)
    {
        //if(isNaN(dx)||dx>this.length){return false;}
        for(var i=0,n=0;i<this.length;i++)
        {
            if(this[i]!=this[dx])
            {
                this[n++]=this[i]
            }
        }
        this.length-=1
    };

    //在数组中获取指定值的元素索引
    Array.prototype.getIndexByValue= function(value)
    {
        var index = -1;
        for (var i = 0; i < this.length; i++)
        {
            if (this[i] == value)
            {
                index = i;
                break;
            }
        }
        return index;
    };



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

    var currentTreeNode = {};
    var forLink = [];
    /**
     *
     * @param linked
     */
    function refreshLinked (linked) {
        $('#linked').html(generatelinked(linked));
    }

    /**
     *
     * @param unLinked
     */
    function refreshUnlinked (unLinked) {
        $('#unlinked').html(generateUnlinked(unLinked));
    }
    /**
     * zTree上节点Click事件的回调函数,监听Click事件
     * @param event Click事件中所有的信息
     * @param treeId Click事件中所点击的Node Html的id
     * @param treeNode Click事件中所点击的Node 所有信息
     */
    function onClick(event,treeId,treeNode) {
        currentTreeNode = treeNode;
        forLink = [];
        if(currentTreeNode.id == 0){
            alert('您无法为根类型指定类型连接')
        }else{
            $.post('/clslinks_linked',currentTreeNode, function (data) {
                refreshLinked(data.linked);
                refreshUnlinked(data.unlinked);
                bindUnlinkedClick();
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

    /**
     *
     * @param unlinked
     * @returns {string}
     */
    function generateUnlinked (unlinked) {
        var unLinkedHtml = '';
        for(var i = 0;i<unlinked.length;i++){
            unLinkedHtml += '' +
                '<li class="unlinked-item">' +
                '   <a data-clsid="'+unlinked[i].CLS_ID+'">'+unlinked[i].CLS_NAME+'' +
                '       <span class="label label-success pull-right" style="display: none;">已选中</span>' +
                '   </a>' +
                '</li>';
        }
        unLinkedHtml = '<ul>'+unLinkedHtml+'</ul>';
        return unLinkedHtml;
    }

    /**
     *
     */
    function bindUnlinkedClick (){
        $('#unlinked ul li a').bind('click', function (event) {
            var _self = $(this);
            _self.find('.label').toggle(500, function () {
                //console.log($(this).attr('style'));
                if($(this).attr('style') == 'display: none;'){
                    /**
                     * 取消选中
                     */
                    var index = forLink.getIndexByValue(_self.data('clsid'));
                    forLink.remove(index);
                }else{
                    /**
                     * 选中
                     */
                    forLink.push(_self.data('clsid'));
                }
            });
        });
    }

    $('#link').bind('click',function (e) {
        var _self = $(this);
        if(_self.hasClass('disabled')){

        }else if(forLink.length != 0){
            $.post('/clslinks_linkclses',{clsid:currentTreeNode.id,gom_clsid:forLink}, function (data) {
                _self.addClass('disabled');
                if(data.success){
                    alert('操作成功');
                    _self.removeClass('disabled');
                    optSuccess();

                }else{
                    alert('操作失败,打开控制台查看错误信息');
                    optFail();
                    console.log(data.err);
                    console.log(data.node);
                }
            })
        }else{
            alert('操作错误');
        }
    });


    $('#unlink').bind('click', function (e) {
        var _self = $(this);
        $.post('',{}, function (data) {
            _self.addClass('disabled');
            if(data.success){
                alert('操作成功');
                _self.removeClass('disabled');
                optSuccess();
            }else{
                alert('操作失败,打开控制台查看错误信息');
                optFail();
                console.log(data.err);
                console.log(data.node);
            }
        })
    });

    function optSuccess () {
        forLink = [];
        $.post('/clslinks_linked',currentTreeNode, function (data) {
            refreshLinked(data.linked);
            refreshUnlinked(data.unlinked);
            bindUnlinkedClick();
        })
    }

    function optFail () {
        forLink = [];
        $.post('/clslinks_linked',currentTreeNode, function (data) {
            refreshLinked(data.linked);
            refreshUnlinked(data.unlinked);
            bindUnlinkedClick();
        })
    }
});