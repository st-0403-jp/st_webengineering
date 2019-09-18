function checkWindow () {
    'use strict';
    // if (console.log == null) {
    //     console.log = function (log) { return log; };
    // }
    // if (console.error == null) {
    //     console.error = console.log;
    // }
    // if (console.info == null) {
    //     console.info = console.log;
    // }
    this.isLocalStorage = function () {
        if (window.localStorage != null) {
            return true;
        }
        // try {
        //     throw new Error('ローカルストレージが使えません。');
        // } catch {
        //     return false;
        // }
        return false;
    };
};
var CHECK_WINDOW = new checkWindow();
var IS_LOCAL_STORAGE = CHECK_WINDOW.isLocalStorage();

function Utility () {
    'use strict';
    this.cssTranstionDuration = function ($targetEl, time) {
        if (!($targetEl instanceof jQuery) && $targetEl.length === 0) {
            return;
        }
        time = time || 1000;
        $targetEl.css('transition-duration', (time / 1000) + 's');
    };
    this.cssAnimationDuration = function ($targetEl, time) {
        if (!($targetEl instanceof jQuery) && $targetEl.length === 0) {
            return;
        }
        time = time || 1000;
        $targetEl.css('animation-duration', (time / 1000) + 's');
    };
    this.setLocalSt = function (key, value) {
        if (key == null && value == null) {
            return null;
        }
        return localStorage.setItem(key, JSON.stringify(value));
    };
    this.getLocalSt = function (key) {
        if (key == null) {
            return null;
        }
        var getData = localStorage.getItem(key);
        return (getData) ? JSON.parse(getData) : null;
    };
};
var UTILITY = new Utility();

/**
 * 横幅でPCかSPか判定するクラス
 */
function JudgeDevice () {
    'use strict';
    this.isPc = null;
    this.isSp = null;
    this.init = function () {
        var ww = $(window).width();
        this.isPc = false;
        this.isSp = false;
        if (ww < 480) {
            this.isSp = true;
        } else {
            this.isPc = true;
        }
    };
};

/**
 * レスポンシブ用にリサイズイベント設置
 */
function Responsive () {
    'use strict';
    this.start = function (callback) {
        var $w = $(window);
        var resizeTimer = false;
        $w.on('resize.responsive', function () {
            if (resizeTimer !== false) {
                clearTimeout(resizeTimer);
            }
            resizeTimer = setTimeout(function () {
                if (callback && typeof callback === 'function') {
                    callback();
                }
            }, 200);
        });
    };
};

/**
 * ローディングを操作
 */
function StopLoading () {
    'use strict';
    var $w = $(window),
        $el = $('.js_cmn_loading'),
        transitionTime = 1000;
    this.init = function () {
        if ($el.length === 0) {
            return;
        }
        UTILITY.cssTranstionDuration($el, transitionTime);
    };
    this.show = function () {
        $el.removeClass('is_hide is_none');
    };
    this.hide = function () {
        $el.addClass('is_hide');
        setTimeout(function () {
            $el.addClass('is_none');
        }, transitionTime);
    };
    this.setEvent = function (callback) {
        var _self = this;
        $w.on('load.stop.loading', function () {
            _self.hide();
            setTimeout(function () {
                if (callback && typeof callback === 'function') {
                    callback();
                }
            }, transitionTime);
        });
    };
    this.offEvent = function () {
        $w.off('.stop.loading');
    };
};

/**
 * 遷移時のオープニングアニメーション
 */
function Opening () {
    'use strict';
    var _self = this,
        $header = $('header'),
        $footer = $('footer'),
        transitionTime = 500;
    this.elName = 'cmn_opening';
    this.init = function () {
        $header.addClass(_self.elName);
        $footer.addClass(_self.elName);
        UTILITY.cssTranstionDuration($('.' + _self.elName), transitionTime);
    };
    this.do = function () {
        $header.removeClass(_self.elName);
        $footer.removeClass(_self.elName);
    };
};

/**
 * クラスの初期化
 */
var JUDGE_DEVICE = new JudgeDevice();
var RESPONSIVE = new Responsive();
var STOP_LOADING = new StopLoading();
var OPENING = new Opening();

// 共通処理
(function () {
    'use strict';
    JUDGE_DEVICE.init();
    STOP_LOADING.init();
    OPENING.init();

    // ローディングをストップするイベント設置
    STOP_LOADING.setEvent(OPENING.do);

    function cmnClickHamburger () {
        var $el = $('.js_hamburger');
        $el.off('.hamburger').on('click.hamburger', function () {
            if ($el.hasClass('is_show')) {
                $el.removeClass('is_show');
            } else {
                $el.addClass('is_show');
            }
        });
    };
    cmnClickHamburger();

    RESPONSIVE.start(function () {
        JUDGE_DEVICE.init();
    });
})();