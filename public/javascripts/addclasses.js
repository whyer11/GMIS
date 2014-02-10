/**
 * Created by whyer on 14-2-9.
 */
$(function () {
    $('#add_class').click(function () {
        $('#addclass_name').html("" +
            "<a>类型名称：</a>" +
            "<input type='text' id='classname'>" +
            "<a class='btn-primary' id='subclassname'>确定</a>"
        );
        $('#subclassname').click(function () {
            alert($('#classname').val());
            $.ajax({
                type: 'post',
                url: '/add_class_name.json',
                dataType: 'json',
                data: {
                    name: $('#classname').val()
                },
                success: function (data) {
                    console.log(data);
                }
            });
        });
    });

    function addclassprop(propkey, propvalue) {

    }
});