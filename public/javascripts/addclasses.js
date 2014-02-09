/**
 * Created by whyer on 14-2-9.
 */
$(function () {
    $('#add_class').click(function () {
        $('#addclass_name').html("" +
            "<a>类型名称：</a>" +
            "<input type='text' id='classname'>" +
            "<a id='subclassname'>确定</a>"
        );
        $('#subclassname').click(function () {
            $.ajax({
                type: 'post',
                url: '/add_class_name',
                dataType: 'json',
                data: $('#subclassname').val(),
                success: function (data) {
                    console.log(data);
                }
            });
        });
    });

    function addclassprop(propkey, propvalue) {

    }
});