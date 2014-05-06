/**
 * Created by whyer on 14-3-23.
 */
$(function(){
    //获取当前app的appid
    var curappid = $('#app').val();
    //配置Ztree
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
            onRightClick: onRightClick
        }
    };
    /*
     * 监听load事件
     * 与后端交换信息，获取对象树的节点信息
     * 初始化对象树
     */
    window.onload=function(){
        $.post('/app_display.json',{appid:curappid},function(data){
            $.fn.zTree.init($('#treeDemo'),viewtreesettings,maketree(data));
        })
    }
    /* function maketree
     * 将ajax回调的节点数据转为对象数组，并返回数组
     */
    function maketree(data){
        var nodes=[];
        for(var i = 0;i<data.length;i++){
            var n = {
                id:data[i].REF_ID,
                pId:data[i].PARENT_REF_ID,
                name:data[i].REF_NAME,
                clsid:data[i].REF_CLS_ID,
                instid: data[i].REF_INST_ID,
                appid: data[i].REF_APP_ID
            }
            nodes.push(n);
        }
        return nodes;
    }
    /* Ztree节点的click事件
     * treeId获取生成对象数组时设置的id
     * treeNode获取当前节点的整个对象
     */
    function onClick(event,treeId,treeNode){
        renderOptBtn(treeNode);
        renderNodeInfo(treeNode);

    }

    /* 定义鼠标右击树节点的事件
     *
     */
    function onRightClick(event, tree, treeNode) {
        console.log(treeNode);
        $.post('/app_rightclick.json', treeNode, function (cls) {
            console.log(cls);
        })
    }
    /*
     生成操作按钮并绑定按钮类型

     */
    function renderNodeInfo(treenodeobj){

    }

    function renderOptBtn(treenodeobj){
        $.post('/app_render_node_info.json',treenodeobj,function(data){
            //console.log(data);
            var htmlstr = '';
            for(val in data){
                htmlstr+='<p>'+val+' : '+data[val]+'</p>';
            }
            $('.hero-unit').html(htmlstr);
        });
        $('#class_opts').html('<div class="optionsbar">' +
            '<a class="classopts delclass">删除</a>' +
            '<a class="classopts alterclass">修改</a>' +
            '<a class="classopts ">新建</a></div>')
    }

})