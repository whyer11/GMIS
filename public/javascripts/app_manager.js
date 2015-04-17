/**
 * Created by wanghuanyu on 14-10-6.
 */
$(function () {
    /* 方法:Array.remove(dx)
     * 功能:删除数组元素.
     * 参数:dx删除元素的下标.
     * 返回:在原数组上修改数组
     */
    //经常用的是通过遍历,重构数组.
    /**
     *
     * @param dx
     */
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
    /**
     *
     * @param value
     * @returns {number}
     */
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

    /**
     *
     * @type {{}}
     */
    var currentApp = {};
    /**
     *
     * @type {Array}
     */
    var forLink = [];
    /**
     *
     * @type {Array}
     */
    var forUnlink = [];

    /**
     *
     */
    $('#applist li a').bind('click',function (e) {
    //console.log(this);
        var _self = $(this);
        if(_self.hasClass('app-unselected')){
            $('#applist').find('a').removeClass('app-selected').addClass('app-unselected');
            _self.removeClass('app-unselected').addClass('app-selected');
            currentApp.appid = _self.data('appid');
            currentApp.appname = _self.text();
            forLink = [];
            forUnlink = [];
            $('#delapp').addClass('btn btn-danger').text('删除');
            $('#alterapp').addClass('btn btn-info').text('修改名称');
            $.post('/app_clslinks',currentApp, function (data) {
                refreshLinked(data.linked);
                refreshUnlinked(data.unlinked);
                bindLinkedClick();
                bindUnlinkedClick();
            })
        }
    });

    /**
     * 删除这个app的按钮事件
     */
    $('#delapp').bind('click', function (e) {
        if(confirm('确定删除选中的App?')){
            if(currentApp.appid == 0){
                alert('无法删除全局对象浏览器');
            }else {
                $.post('/app_del.json', currentApp, function (data) {
                    if (data.success) {
                        alert('删除成功');
                        window.location = '/app_manager';
                    } else {
                        alert(data.err);
                        console.log(data.err);
                    }
                })
            }
        }
    });

    $('#alterapp').bind('click', function (e) {
        if(currentApp.appid == 0){
            alert('无法为全局对象浏览器重新命名');
        }else {
            var appname = prompt("请为这个App重新命名", currentApp.appname);
            currentApp.appname = appname;
            if (appname != null && appname != '') {
                $.post('/app_alertname.json', currentApp, function (data) {
                    if (data.success) {
                        alert('修改成功');
                        window.location = '/app_manager';
                    } else {
                        alert(data.err);
                    }
                })
            } else {
                alert('请输入新的名字.');
            }
        }
    });

    /**
     *
     * @param linked
     */
    function refreshLinked (linked) {
        $('#linked').html(generateLinked(linked));
    }

    /**
     *
     * @param unlined
     */
    function refreshUnlinked (unlined) {
        $('#unlinked').html(generateUnlinked(unlined));
    }

    /**
     * 生成已连接的类型HTML
     * @param linked
     * @returns {string}
     */
    function generateLinked (linked) {
        var linkedHtml = '';
        for(var i = 0;i<linked.length;i++){
            linkedHtml += '' +
                '<div class="accordion-group">' +
                '   <div class="accordion-heading">' +
                '       <a class="accordion-toggle collapsed" data-toggle="collapse" data-clsid="'+linked[i].CLS_ID+'" data-parent="#linked" href="#linked_'+i+'">'+linked[i].CLS_NAME+'' +
                '           <span class="label label-success pull-right" style="display: none;">已选中</span>' +
                '       </a>' +
                '   </div>' +
                //'   <div id="linked_'+i+'" class="accordion-body collapse">' +
                //'       <div class="accordion-inner">'+generateAccBody(linked[i])+'</div>' +
                //'   </div>' +
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
            _self.find('.label').toggle(100, function () {
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

    /**
     *
     */
    function bindLinkedClick () {
        $('.accordion-toggle').bind('click', function (e) {
            var _self = $(this);
            if(_self.data('clsid') != 0) {
                _self.find('.label').toggle(100, function () {
                    //console.log($(this).attr('style'));
                    if ($(this).attr('style') == 'display: none;') {
                        /**
                         * 取消选中
                         */
                        var index = forUnlink.getIndexByValue(_self.data('clsid'));
                        forUnlink.remove(index);
                    } else {
                        /**
                         * 选中
                         */
                        forUnlink.push(_self.data('clsid'));

                    }
                });
            }else{
                alert('无法取消根对象的链接');
            }
        })
    }

    $('#link').bind('click', function (e) {
        var _self = $(this);
        if(_self.hasClass('disabled')){

        }else if(forLink.length != 0){
            $.post('/app_linkclses',{appid:currentApp.appid,gom_clsid:forLink}, function (data) {
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
        if(_self.hasClass('disabled')){

        }else if(forUnlink.length != 0){
            $.post('/app_unlinkclses',{appid:currentApp.appid,gom_clsid:forUnlink}, function (data) {
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

    function optSuccess () {
        forLink =[];
        forUnlink = [];
        $.post('/app_clslinks',currentApp, function (data) {
            refreshLinked(data.linked);
            refreshUnlinked(data.unlinked);
            bindLinkedClick();
            bindUnlinkedClick();
        })
    }

    function optFail () {
        forLink =[];
        forUnlink = [];
        $.post('/app_clslinks',currentApp, function (data) {
            refreshLinked(data.linked);
            refreshUnlinked(data.unlinked);
            bindLinkedClick();
            bindUnlinkedClick();
        })
    }
});

