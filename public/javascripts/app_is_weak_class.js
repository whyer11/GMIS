/**
 * Created by wanghuanyu on 14-10-23.
 */
$(function () {
    /**
     *
     * @type {{}}
     */
    var currentApp = {};

    $('#applist li a').bind('click',function (e) {

        var _self = $(this);
        if(_self.hasClass('app-unselected')){
            $('#applist').find('a').removeClass('app-selected').addClass('app-unselected');
            _self.removeClass('app-unselected').addClass('app-selected');
            currentApp.appid = _self.data('appid');
            currentApp.appname = _self.text();
            $.post('/app_weakclassview',currentApp, function (data) {

                refreshStrong(data.strong);
                refreshWeak(data.weak);
                bindStrongClick();
                bindWeakClick();
            })
        }
    });

    function refreshStrong(strong) {
        if(strong.length == 0){
            $('#strong').html('');
        }else {
            var strongStr = '';
            for (var i = 0; i < strong.length; i++) {
                strongStr += '<a class="btn btn-primary" data-clsid = "'+strong[i].CLS_ID+'">' + strong[i].CLS_NAME + '</a><br>';
                if (i == strong.length - 1) {

                    $('#strong').html(strongStr);
                }
            }
        }


    }

    function refreshWeak(weak) {
        if(weak.length == 0){
            $('#weak').html('');
        }else {
            var weakStr = '';
            for (var i = 0; i < weak.length; i++) {
                weakStr += '<a class="btn btn-primary" data-clsid = "'+weak[i].CLS_ID+'">' + weak[i].CLS_NAME + '</a><br>';
                if (i == weak.length - 1) {

                    $('#weak').html(weakStr);
                }
            }
        }
    }

    function bindStrongClick() {
        $('#strong a').bind('click', function () {
            var _self = $(this);

            var commit = {
                clsid : _self.data('clsid'),
                appid : currentApp.appid,
                IS_WEAK : 'T'
            };

            $.post('/app_tobewors',commit, function (data) {
                if(data.success){
                    $.post('/app_weakclassview',currentApp, function (data) {

                        refreshStrong(data.strong);
                        refreshWeak(data.weak);
                        bindStrongClick();
                        bindWeakClick();
                    })
                }else{

                }
            })
        })
    }

    function bindWeakClick() {
        $('#weak a').bind('click', function () {
            var _self = $(this);

            var commit = {
                clsid : _self.data('clsid'),
                appid : currentApp.appid,
                IS_WEAK : 'F'
            };

            $.post('/app_tobewors',commit, function (data) {
                if(data.success){
                    $.post('/app_weakclassview',currentApp, function (data) {

                        refreshStrong(data.strong);
                        refreshWeak(data.weak);
                        bindStrongClick();
                        bindWeakClick();
                    })
                }else{

                }
            })
        })
    }
});