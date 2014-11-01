/**
 * Created by wanghuanyu on 14-10-28.
 */
$(function () {

    var currentGrantors = {};
    $('#applist li a').bind('click',function (e) {

        var _self = $(this);
        if(_self.hasClass('app-unselected')){
            $('#applist').find('a').removeClass('app-selected').addClass('app-unselected');
            _self.removeClass('app-unselected').addClass('app-selected');
            currentGrantors.grantorsid = _self.data('grantorsid');
            currentGrantors.grantorsname = _self.text();
            $.post('/show_have_unhave',currentGrantors, function (data) {

                refreshHave(data.have);
                refreshUnhave(data.unhave);
                bindHaveClick();
                bindUnhaveClick();
            })
        }
    });

    function refreshHave (have){
        if(have.length == 0){
            $('#have').html('');
        }else {
            var haveStr = '';
            for (var i = 0; i < have.length; i++) {

                haveStr += '<a class="grantor-manage" data-grantorid = "'+have[i].GRANTOR_ID+'">' + have[i].GRANTOR_NAME + '</a>';
                if (i == have.length - 1) {

                    $('#have').html(haveStr);
                }
            }
        }
    }

    function refreshUnhave (unhave){
        if(unhave.length == 0){
            $('#unhave').html('');
        }else{
            var unhaveStr = '';
            for(var i = 0;i<unhave.length;i++){
                unhaveStr += '<a class="grantor-manage" data-grantorid = "'+unhave[i].GRANTOR_ID+'">' + unhave[i].GRANTOR_NAME + '</a>';
                if(i==unhave.length -1){
                    $('#unhave').html(unhaveStr);
                }
            }
        }
    }

    function bindHaveClick () {
        $('#have a').bind('click', function () {
            var _self = $(this);
            var commit = {
                grantorid:_self.data('grantorid'),
                grantorsid:currentGrantors.grantorsid,
                del:true
            };
            $.post('/have_or_unhave',commit, function (data) {
                if(data.success){
                    $.post('/show_have_unhave',currentGrantors, function (data) {

                        refreshHave(data.have);
                        refreshUnhave(data.unhave);
                        bindHaveClick();
                        bindUnhaveClick();
                    })
                }else{

                }
            })

        })
    }

    function bindUnhaveClick (){
        $('#unhave a').bind('click', function () {
            var _self = $(this);
            var commit = {
                grantorid:_self.data('grantorid'),
                grantorsid:currentGrantors.grantorsid,
                del:false
            };
            $.post('/have_or_unhave',commit, function (data) {
                if(data.success){
                    $.post('/show_have_unhave',currentGrantors, function (data) {

                        refreshHave(data.have);
                        refreshUnhave(data.unhave);
                        bindHaveClick();
                        bindUnhaveClick();
                    })
                }else{

                }
            })
        })
    }
});