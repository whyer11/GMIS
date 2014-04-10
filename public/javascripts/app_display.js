/**
 * Created by whyer on 14-3-23.
 */
$(function(){
    var curappid = $('#app').val();
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
            onClick:onClick
        }
    };
    var nodes=[];
    window.onload=function(){
        $.post('/app_display.json',{appid:curappid},function(data){
            console.log(data);
            maketree(data);
            console.log(nodes);
            $.fn.zTree.init($('#treeDemo'),viewtreesettings,nodes);
        })
    }
    function maketree(data){
        for(var i = 0;i<data.length;i++){
            var n = {
                id:data[i].REF_ID,
                pId:data[i].PARENT_REF_ID,
                name:data[i].REF_NAME,
                clsid:data[i].REF_CLS_ID
            }
            nodes.push(n);
        }

    }
    function onClick(event,treeId,treeNode){

    }
})