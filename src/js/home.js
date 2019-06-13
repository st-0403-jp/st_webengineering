(function () {
    'use strict';

    STOP_LOADING.offEvent();

    $(window).on('load.home', function () {
        STOP_LOADING.hide();
        landing();
    });

    function landing () {
        var $el = $('.js_is_animation');
        var $body = $('body');
        var nameTarget = 'is_animation';
        var nameTarget_child = 'is_animation_child';
        var animationTime = 8000;
        var getData = UTILITY.getLocalSt('landing');
        var saveData = {
            is: true,
            date: toTime
        };

        var newDate = new Date();
        var toTime = newDate.getTime();

        newDate.setDate(newDate.getDate() + 7);
        var storageDate = new Date(getData.date);

        var calcDate = newDate.getDate() - storageDate.getDate()

        if (getData && getData.is === true) {
            setTimeout(function () {
                OPENING.do();
            }, 300);
            return;
        }

        $body.addClass('is_landing');
        $el.addClass(nameTarget).children().addClass(nameTarget_child);

        if (JUDGE_DEVICE.isSp) {
            $el.addClass('is_sp').children().addClass('is_sp');
            animationTime = 2500;
        }

        setTimeout(function () {
            $el.removeClass(nameTarget).children().removeClass(nameTarget_child);
            setTimeout(function () {
                OPENING.do();
                $body.removeClass('is_landing');
            }, 300);
        }, animationTime);

        $el.children().on('animationend', function () {
            UTILITY.setLocalSt('landing', saveData);
            return false;
        });
    };

    function slider () {
        var $el = $('.js_slider_list');
        var $paging = $('.js_paging');

        function translate () {
            var translate = $el.data('translate');
            $el.css('transform', 'translateX(' + translate + 'vw)');
        };

        function prev () {
            var translate = $el.data('translate');
            translate = Number(translate) + 100;
            $el.data('translate', translate + '');
        };

        function next () {
            var translate = $el.data('translate');
            translate = Number(translate) - 100;
            $el.data('translate', translate + '');
        };

        translate();
        $paging.on('click', '.prev', function () {
            prev();
            translate();
        });
        $paging.on('click', '.next', function () {
            next();
            translate();
        });
    };
    slider();

})();