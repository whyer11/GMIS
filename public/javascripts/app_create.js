/**
 * Created by wanghuanyu on 14-10-14.
 */
$(function () {
   //alert('you did');
    var refSelected = {};
    $('#reflist li a').bind('click', function (e) {
        var _self = $(this);
        if(_self.hasClass('ref-unselected')){
            $('#reflist').find('a').removeClass('ref-selected').addClass('ref-unselected');
            _self.removeClass('ref-unselected').addClass('ref-selected');
            refSelected.refid = _self.data('refid');
            refSelected.instname = _self.text();
            $('#refto').addClass('alert alert-info').text('您已选择 : '+refSelected.instname);
            $('#nextstep').addClass('btn btn-info').text('下一步');
        }
    });
    $('#nextstep').bind('click', function (e) {
        $('#cover').html('' +
            '<div class="alert alert-info">您选择了 '+refSelected.instname+' 作为新App的根节点</div>' +
            '<h4>请输入这个App的名字</h4>' +
            '<p>例如:中北学院管理器</p>' +
            '<input type="text" id="app_name">' +
            '<br>' +
            '<a class="btn btn-success" id="finish">完成App创建</a>');
        $('#finish').bind('click', function (e) {
            var input = $('#app_name');

            if(input.val() != ''){
                refSelected.appname = input.val();
                $.post('/app_finishcreate',refSelected, function (data) {
                    if(data.success){
                        alert('操作成功\n请打开APP管理器进行类型连接操作');
                    }else{
                        alert('操作失败\n请打开控制台查看错误');
                        console.error(data.err);
                    }
                })
            }else{
                alert('App的名字不能为空');
            }
        })
    });

});