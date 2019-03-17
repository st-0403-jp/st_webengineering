(function () {

    function slideshow () {
        var $el = $('.js_slideshow');
        var $imgList = $el.find('li');
        var count = 1;
        $imgList.eq(0).addClass('is_show');
        $imgList.eq(1).addClass('is_pre_show');
        setInterval(function () {
            if (count === 5) {
                count = 0;
            }
            $imgList.removeClass('is_show');
            $imgList.removeClass('is_pre_show');
            $imgList.each(function (idx, li) {
                if (idx === count) {
                    $(li).addClass('is_show');
                }
                if (count !== 4 && idx === count + 1) {
                    $(li).addClass('is_pre_show');
                }
                if (count === 4 && idx === 0) {
                    $(li).addClass('is_pre_show');
                }
            });
            count++;
        }, 5000);
    };

    function autoScrollPhoto () {
        var $photoList = $('.js_home_photo_list').find('ul');
        var animationTime = 40000;
        UTILITY.cssAnimationDuration($photoList, animationTime);
    };

    function onLoad () {
        var $w = $(window);
        $w.on('load.home', function () {
            // slideshow();
            autoScrollPhoto();
        });
    };
    onLoad();

})();