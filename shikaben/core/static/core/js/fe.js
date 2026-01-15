(function ($) {
  'use strict';

  // ---------- Utilities ----------
  function escapeSelector(val) {
    // CSS.escape が無い環境向け
    if (window.CSS && typeof window.CSS.escape === 'function') return window.CSS.escape(val);
    return String(val).replace(/([ !"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, '\\$1');
  }

  function pageScroll(pos, duration) {
    // jQuery easing が無い場合も動作するよう linear fallback
    const easingName = ($.easing && $.easing.easeOutCirc) ? 'easeOutCirc' : 'swing';

    const scrollEvent =
      ('onwheel' in document) ? 'wheel' :
      ('onmousewheel' in document) ? 'mousewheel' :
      'DOMMouseScroll';

    function stopScroll(e) { e.preventDefault(); }

    document.addEventListener(scrollEvent, stopScroll, { passive: false });
    $('html, body').stop(true).animate({ scrollTop: pos }, duration, easingName, function () {
      document.removeEventListener(scrollEvent, stopScroll, { passive: false });
    });
  }

  // easeOutCirc を追加（元サイト互換）
  if (!($.easing && $.easing.easeOutCirc)) {
    $.easing.easeOutCirc = function (x, t, b, c, d) {
      return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    };
  }

  // ---------- Main ----------
  $(function () {
    // --- 1) カウントダウン表示（#countdown） ---
    (function initCountdown() {
      const $cd = $('#countdown');
      if (!$cd.length) return;

      const yyyymmdd = /^20[2-9][0-9]-(1[0-2]|0[1-9])-(0[1-9]|[1-2][0-9]|3[01])$/;
      const defaultMessage = '<a href="/config.html#xday">受験予定日を設定する</a>';

      try {
        const xdayStr = localStorage.getItem('XDAY');
        if (xdayStr && yyyymmdd.test(xdayStr)) {
          const [ys, ms, ds] = xdayStr.split('-');
          const y = Number(ys), m = Number(ms), d = Number(ds);
          const xday = new Date(y, m - 1, d);
          const now = new Date();
          const diffdays = Math.ceil((xday - now) / (24 * 60 * 60 * 1000));

          let msg = '';
          if (diffdays > 0) {
            msg = `受験予定日は <span>${y}</span>年<span>${m}</span>月<span>${d}</span>日　試験本番まであと<span class="big">${diffdays}</span>日です`;
          } else if (diffdays === 0) {
            msg = `本日は <span>${y}</span>年<span>${m}</span>月<span>${d}</span>日　基本情報技術者試験の<em class="r">受験日</em>です`;
          } else {
            localStorage.removeItem('XDAY');
            msg = defaultMessage;
          }
          $cd.html(msg);
        } else {
          $cd.html(defaultMessage);
        }
      } catch (e) {
        // localStorage が使えない環境でも落とさない
        $cd.html(defaultMessage);
      }
    })();

    // --- 2) ドロワーメニュー（#drawer_btn / body.menu_open） ---
    (function initDrawer() {
      const $btn = $('#drawer_btn');
      if (!$btn.length) return;

      $btn.on('click', function () {
        $('body').toggleClass('menu_open');
      });

      // メニュー外クリックで閉じたい場合（必要ならON）
      $(document).on('click', function (e) {
        if (!$('body').hasClass('menu_open')) return;
        const $menu = $('#drawer_menu');
        if (!$menu.length) return;

        // ボタン or メニュー内クリックなら無視
        if ($(e.target).closest('#drawer_btn, #drawer_menu').length) return;
        $('body').removeClass('menu_open');
      });
    })();

    // --- 3) ドロワー内アコーディオン（.drawer_accordion） ---
    (function initDrawerAccordion() {
      $('.drawer_accordion').on('click', function () {
        $(this).toggleClass('open');
      });
    })();

    // --- 4) toTop 表示＆ページ内スクロール（#toTop / a[href^="#"] の一部） ---
    (function initToTop() {
      const $toTop = $('#toTop');
      if ($toTop.length) {
        $(window).on('scroll', function () {
          if ($(this).scrollTop() > 300) $toTop.addClass('show');
          else $toTop.removeClass('show');
        });
      }

      // #header / #top などへのスムーススクロール（要素が存在する場合のみ）
      $(document).on('click', 'a[href^="#"]', function (e) {
        const href = $(this).attr('href');
        if (!href || href === '#') return;

        const $target = $(href);
        if (!$target.length) return;

        e.preventDefault();
        pageScroll($target.offset().top - 20, 600);
      });
    })();

    // --- 5) 出題設定フォーム：Enterで送信しない（意図しないsubmit防止） ---
    (function preventEnterSubmit() {
      const $form = $('#configform');
      if (!$form.length) return;

      $form.find('input:not(.allowSubmit)').on('keydown', function (e) {
        if (e.which === 13) return false;
      });
    })();

    // --- 6) 「全項目チェック ON/OFF」ボタン（.check_all_wrap 内の button[name="check_all"]） ---
    (function initCheckAllButtons() {
      $(document).on('click', '.check_all_wrap button[name="check_all"]', function () {
        const $wrap = $(this).closest('.check_all_wrap');
        const isOn = ($(this).text().trim().toUpperCase() === 'ON');

        // 対象：この wrap の1つ上のコンテナ内の checkbox
        // tab1/tab2/fs3 で構造が少し違うので近い範囲で拾う
        const $scope = $wrap.closest('#tab1, #tab2, #fs3').length
          ? $wrap.closest('#tab1, #tab2, #fs3')
          : $wrap.parent();

        $scope.find('input[type="checkbox"]').prop('checked', isOn);
      });
    })();

    // --- 7) 「★おすすめ」ボタン（簡易実装）
    // ※本家のロジックを完全再現するのは卒業制作の範囲外になりやすいので、
    //   ここでは「直近の数年」を優先チェックするシンプル版にしています。
    (function initRecommendButton() {
      function applyRecommend($container) {
        const $boxes = $container.find('input[type="checkbox"][name="times[]"]');
        if (!$boxes.length) return;

        // まず全部OFF
        $boxes.prop('checked', false);

        // value の先頭2桁(例: 06_menjo)が新しいものを優先して最大6つON
        const sorted = $boxes.toArray().sort(function (a, b) {
          const av = String(a.value || '');
          const bv = String(b.value || '');
          const an = parseInt(av.split('_')[0], 10);
          const bn = parseInt(bv.split('_')[0], 10);
          // 数値が取れないものは後ろへ
          if (isNaN(an) && isNaN(bn)) return 0;
          if (isNaN(an)) return 1;
          if (isNaN(bn)) return -1;
          return bn - an; // 降順
        });

        $(sorted.slice(0, 6)).prop('checked', true);
      }

      $(document).on('click', '.check_all_wrap button[name="recommend"]', function () {
        const $scope = $(this).closest('#tab1, #fs3, #tab2');
        if (!$scope.length) return;
        applyRecommend($scope);
      });
    })();

    // --- 8) タブ切替（#tabs 内 ul > li > a で #tab1/#tab2/#tab3 を表示） ---
    (function initTabs() {
      const $tabs = $('#tabs');
      if (!$tabs.length) return;

      const $tabLinks = $tabs.find('> ul > li > a[href^="#tab"]');
      if (!$tabLinks.length) return;

      function showTab(hash) {
        // hash: "#tab1" など
        $tabs.find('> div[id^="tab"]').hide();
        $tabs.find(hash).show();

        // active 切替
        $tabs.find('> ul > li').removeClass('active');
        $tabs.find(`> ul > li > a[href="${hash}"]`).parent().addClass('active');
      }

      // 初期：active があるもの or #tab1
      const $active = $tabs.find('> ul > li.active > a[href^="#tab"]');
      showTab($active.length ? $active.attr('href') : '#tab1');

      $tabLinks.on('click', function (e) {
        e.preventDefault();
        const hash = $(this).attr('href');
        showTab(hash);
      });
    })();

    // --- 9) userPanel（#userBtn クリックで簡易トグル）
    // ※ログインUIは後で実装する想定。まずはパネルの開閉だけ用意。
    (function initUserPanel() {
      const $btn = $('#userBtn');
      const $panel = $('#userPanel');
      if (!$btn.length || !$panel.length) return;

      $btn.on('click', function (e) {
        e.preventDefault();
        $panel.toggleClass('show');
      });

      // 外側クリックで閉じる
      $(document).on('click', function (e) {
        if (!$panel.hasClass('show')) return;
        if ($(e.target).closest('#userBtn, #userPanel').length) return;
        $panel.removeClass('show');
      });
    })();
  });

})(jQuery);
