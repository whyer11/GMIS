/**
 * Created by wanghuanyu on 14-10-28.
 */
$(function () {

    var createBtn = $('#create');
    var isSystem = createBtn.data('system');

    createBtn.bind('click', function (e) {
        if($('#username').val() != ''){
            $.post('/grantor_create',{username:$('#username').val(),issystem:isSystem}, function (data) {
                if(data.success){
                    alert('操作成功!\n点击确定转入用户/用户组管理器中');
                }else{
                    console.log(data.err);
                    alert('操作失败!\n请打开控制台查看错误');
                }
            })
        }else{
            alert('用户名不能为空');
        }
    })
});