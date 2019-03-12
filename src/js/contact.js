(function () {

    var _invalidName = 'is_invalid';
    var _disabledName = 'is_disabled';

    function checkInput () {
        var $el = $('input, select, textarea');
        $el.on('input', function () {
            var $target = $(this);
            if (!$target.hasClass(_invalidName)) {
                return;
            }
            $target.removeClass(_invalidName);
        });
    };
    checkInput();

    function checkRequired () {
        // var $inputName = $('#form_item_input_name');
        // var $inputMailaddress = $('#form_item_input_mailaddress');
        var $el = $('input:required');
        $el.on('invalid', function () {
            $(this).addClass(_invalidName);
        });
    };
    checkRequired();

    function onSubmit () {
        var form = document.getElementById('contact_form');
        var $submit = $('#form_item_input_submit');

        $submit.on('click', function () {
            if ($submit.hasClass(_disabledName)) {
                return false;
            }
            $submit.addClass(_disabledName);
            setTimeout(function () {
                $submit.removeClass(_disabledName);
            }, 1000);
        });

        $(form).on('submit', function (e) {
            // var form = e.target;
            var inputName = form.name.value;
            var inputGender = form.gender.value;
            var inputAge = form.age.value;
            var inputMailaddress = form.mailaddress.value;
            var inputContent = form.content.value;

            switch (inputGender) {
                case '1':
                    inputGender = '男性';
                    break;
                case '2':
                    inputGender = '女性';
                    break;
                default:
                    inputGender = '';
            }

            switch (inputAge) {
                case '1':
                    inputAge = '10代';
                    break;
                case '2':
                    inputAge = '20代';
                    break;
                case '3':
                    inputAge = '30代';
                    break;
                case '4':
                    inputAge = '40代';
                    break;
                case '5':
                    inputAge = '50代';
                    break;
                case '6':
                    inputAge = '60代以上';
                    break;
                default:
                    inputAge = '';
            }

            $.ajax({
                type: 'POST',
                url: '/contact/mail.php',
                data: {
                    proc: 'send',
                    name: inputName,
                    gender: inputGender,
                    age: inputAge,
                    mailaddress: inputMailaddress,
                    content: inputContent
                }
            }).done(function () {
                alert('送信しました。');
                // location.reload();
                form.name.value = '';
                $(form.gender).prop('checked', false);
                form.age.options[0].selected = true;
                form.mailaddress.value = '';
                form.content.value = '';
            });

            return false;
        });
    };
    onSubmit();

})();