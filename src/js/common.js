
function Utility () {
    'use strict';
    var _self = this;
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
 * スクロールストップクラス TODO: リリース時削除
 */
function NoScroll () {
    'use strict';
    this.$html = null;
    this.init = function () {
        this.$html = $('html');
    };
    this.do = function () {
        this.$html.addClass('is_no_scroll');
    };
    this.remove = function () {
        this.$html.removeClass('is_no_scroll');
    };
};

/**
 * モーダルクラス TODO: リリース時削除
 */
function Modal () {
    'use strict';
    var $body = $('body');

    this.el = '';
    this.elName = 'js_cmn_modal';
    this.elBody = 'js_cmn_modal_inner';
    this.elClose = 'js_cmn_modal_close';
    this.elPrev = 'js_cmn_modal_prev';
    this.elNext = 'js_cmn_modal_next';
    this.elCurrent = 'js_cmn_modal_current';
    this.elAll = 'js_cmn_modal_all';

    // <div class="cmn_modal">
    //     <div class="cmn_modal_inner">
    //         <span class="cmn_modal_close"></span>
    //         <span class="cmn_modal_prev"></span>
    //         <span class="cmn_modal_next"></span>
    //         <div class="cmn_modal_paging">
    //             <span class="current"></span>/<span class="all"></span>
    //         </div>
    //     </div>
    // </div>

    /**
     * モーダルを準備
     */
    this.el = '<div class="cmn_modal ' + this.elName + '">';
    this.el += '<div class="cmn_modal_inner">';
    this.el += '<div class="cmn_modal_body ' + this.elBody + '">';
    this.el += '</div>';
    this.el += '<span class="cmn_modal_close ' + this.elClose + '"></span>';
    this.el += '<span class="cmn_modal_prev ' + this.elPrev + '"></span>';
    this.el += '<span class="cmn_modal_next ' + this.elNext + '"></span>';
    this.el += '<div class="cmn_modal_paging"><span class="current ' + this.elCurrent + '"></span>/<span class="all ' + this.elAll + '"></span></div>';
    this.el += '</div>';
    this.el += '</div>';
    $body.append(this.el);

    /**
     * モーダルを初期化
     */
    this.init = function () {
        this.hide();

        // 閉じる機能
        var _self = this;
        $('.' + _self.elClose).on('click.modal.close', function () {
            _self.hide();
        });
    };

    /**
     * モーダルの機能
     */
    this.show = function () {
        $('.' + this.elName).show();
    };
    this.hide = function () {
        $('.' + this.elName).hide();
    };
    this.onPaging = function (callback) {
        var _self = this;
        function getCurrentVal () {
            return Number($('.' + _self.elCurrent).html());
        };
        function getAllVal () {
            return Number($('.' + _self.elAll).html());
        };

        $('.' + this.elPrev).on('click', function () {
            var val = getCurrentVal();
            if (val === 1) {
                return;
            }
            val = val - 1;
            $('.' + _self.elCurrent).html(val);
            if (callback && typeof callback === 'function') {
                callback(String(val));
            }
        });
        $('.' + this.elNext).on('click', function () {
            var val = getCurrentVal();
            if (val === getAllVal()) {
                return;
            }
            val = val + 1;
            $('.' + _self.elCurrent).html(val);
            if (callback && typeof callback === 'function') {
                callback(String(val));
            }
        });
    };
};

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