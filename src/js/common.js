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
        isExist = $el.length === 0 ? false : true;
    this.init = function () {
        if (!isExist) return;
        // UTILITY.cssTranstionDuration($el, transitionTime);
    };
    this.hide = function () {
        // $el.addClass('is_hide');
        $el.addClass('is_none');
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
    var _self = this;
    var elName = 'cmn_opening';
    var $el = $('.' + elName);
    var isExist = $el.length === 0 ? false : true;
    this.do = function () {
        if (!isExist) return;
        $el.addClass('is_show');
        $el.addClass('is_show');
    };
};

/**
 * インスタンス
 */
var JUDGE_DEVICE = new JudgeDevice();
var RESPONSIVE = new Responsive();
var STOP_LOADING = new StopLoading();
var OPENING = new Opening();

// 共通処理
(function () {
    'use strict';

    // 初期化
    JUDGE_DEVICE.init();
    STOP_LOADING.init();

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

    // ローディングをストップするイベント設置
    $(window).on('load', function () {
        STOP_LOADING.hide();
        setTimeout(function () {
            OPENING.do();
        }, 500);
    });
})();