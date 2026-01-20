var testID = 'fe', fieldarr = ['テクノロジ系', 'マネジメント系', 'ストラテジ系'], middleFieldarr = ['d', '基礎理論', 'アルゴリズムとプログラミング', 'コンピュータ構成要素', 'システム構成要素', 'ソフトウェア', 'ハードウェア', 'ユーザーインタフェース', '情報メディア', 'データベース', 'ネットワーク', 'セキュリティ', 'システム開発技術', 'ソフトウェア開発管理技術', 'プロジェクトマネジメント', 'サービスマネジメント', 'システム監査', 'システム戦略', 'システム企画', '経営戦略マネジメント', '技術戦略マネジメント', 'ビジネスインダストリ', '企業活動', '法務'], bigFieldarr = ['基礎理論', 'コンピュータシステム', '技術要素', '開発技術', 'プロジェクトマネジメント', 'サービスマネジメント', 'システム戦略', '経営戦略', '企業と法務'], addTimes = {
    "15_aki": "15年秋期",
    "15_haru": "15年春期",
    "14_aki": "14年秋期",
    "14_haru": "14年春期",
    "13_aki": "13年秋期",
    "13_haru": "13年春期",
    "01_moshi": "模擬試験1",
    "02_moshi": "模擬試験2"
}, spField, stYear = 2004, edYear = 2024, aki = true;

// ===== static URL を kakomonApp.js の配置から自動推定（Django/static でもOK）=====
var __KAKOMON_STATIC_ROOT__ = (function () {
    function findSelfSrc() {
        if (document.currentScript && document.currentScript.src) return document.currentScript.src;

        // src に kakomonApp.js を含む script を後ろから探す
        var scripts = document.getElementsByTagName("script");
        for (var i = scripts.length - 1; i >= 0; i--) {
            var s = scripts[i].getAttribute("src") || "";
            if (s.indexOf("kakomonApp.js") !== -1) return scripts[i].src || s;
        }

        // 最後の script
        return scripts.length ? (scripts[scripts.length - 1].src || "") : "";
    }

    var src = findSelfSrc();
    if (!src) return "";

    // 例:
    //   /js/kakomonApp.js                -> /
    //   /static/core/js/kakomonApp.js    -> /static/core/
    try {
        var u = new URL(src, window.location.href);
        var dir = u.pathname.replace(/[^\/?#]+$/, "");   // .../js/
        var root = dir.replace(/\/js\/$/, "/");          // .../
        return u.origin + root;
    } catch (e) {
        // URL が使えない環境向け
        var p = String(src).split("?")[0].split("#")[0];
        var dir2 = p.replace(/[^\/]+$/, "");
        var root2 = dir2.replace(/\/js\/$/, "/");
        return root2;
    }
})();

function __kStatic(path) {
    if (!path) return path;
    if (/^(?:https?:)?\/\//.test(path) || path.charAt(0) === "/") return path; // 絶対URL/絶対パスはそのまま
    var base = __KAKOMON_STATIC_ROOT__ || "";
    if (base && base.charAt(base.length - 1) !== "/") base += "/";
    return base + path.replace(/^\//, "");
}
function __kImg(file) { return __kStatic("img/" + file); }
function __kJs(file)  { return __kStatic("js/"  + file); }

$(function() {
    var s = testID + "kakomon.php"
      , g = "/signup/"
      , a = "/membership/"
      , B = ["-", "○", "×"]
      , V = -1 === $.inArray(testID, ["ip", "sg", "fe", "ap"])
      , m = '<i class="loading"></i>'
      , n = '<i class="loading large"></i>'
      , i = "ログイン・ユーザー登録"
      , h = /^[\w.-]{6,20}$/
      , r = /^[\w`~!@#$%^&*+=(){}[|:;.,?<>"\'\]\/\\\-]{8,32}$/;
    $("body").append('<div id="stateMessage"></div><div id="grayLayer"></div><div id="overLayer" class="doujou"></div>'),
    $('#configform [value="timesFilter"]').prop("checked") || $("#fs3").hide(),
    $("#tabs > div").hide();
    var e, t = $("#tabs li.active a").attr("href").replace(/#tab/, "");
    $("#tab" + t).show(),
    $("#doujoulogo")[0] && ($("dt:gt(4),dd:gt(4)", ".tbl2.appInfo").hide(),
    $(".tbl2.appInfo dd:eq(4)").append('<div class="anslink"><a href="javascript:void(0)">▼すべて表示</a></div>'),
    $('img[src$="doujoulogo.png"]').attr("usemap", "#map").after('<map name="map"></map>'),
    $('map[name="map"]').append('<area shape="rect" coords="317,30,341,54" id="addSwitch">'),
    $("#addSwitch").css("cursor", "default").one("click", function() {
        if (1 != $('#configform [name="addition"]').val() && !spField) {
            for (var e in addTimes)
                $("#tab1 > label:last").after('<label><input type="checkbox" name="times[]" value="' + e + '" checked><span>' + addTimes[e] + "</span></label>");
            $('#configform [name="addition"]').val("1"),
            alert("選べる試験回が" + Object.keys(addTimes).length + "つ追加されました。"),
            delete k.coverage
        }
    }),
    $(".tbl2 .anslink a").click(function() {
        return $(this).parent().remove(),
        $("dt:gt(4),dd:gt(4)", ".tbl2.appInfo").slideDown("fast"),
        !1
    }),
    e = localStorage.getItem("DOUJOU_OPTIONS") || "",
    $('[name="options[]"]:not([value="timesFilter"])').each(function() {
        -1 !== e.indexOf($(this).val()) && $(this).prop("checked", !0)
    })),
    $('[name="options[]"]:not([value="timesFilter"])').change(function() {
        var e, a = localStorage.getItem("DOUJOU_OPTIONS") || "";
        $(this).prop("checked") ? a += $(this).val() : (e = new RegExp($(this).val(),"g"),
        a = a.replace(e, "")),
        localStorage.setItem("DOUJOU_OPTIONS", a)
    }),
    $("#openclose").click(function() {
        return $("#collapsiblebox").is(":visible") ? ($("#collapsiblebox").hide(),
        $(this).html("出題設定")) : ($("#collapsiblebox").show(),
        $(this).html("▲ 閉じる")),
        !1
    }),
    $('[value="timesFilter"]').click(function() {
        $("#fs3").slideToggle("fast")
    }),
    $('[value="noCalc"], [value="onlyCalc"]').click(function() {
        var e = "noCalc" == $(this).attr("value") ? "onlyCalc" : "noCalc";
        $(this).prop("checked") && $('[value="' + e + '"]').prop("checked", !1)
    }),
    $("#tabs > ul > li > a").click(function() {
        $("#tabs > ul > li").removeClass("active"),
        $(this).parent().addClass("active");
        var e = $(this).attr("href");
        if ($("#tabs > div").hide(),
        $(e).show(),
        "#tab3" == e || "#tab4" == e ? $("#options label:gt(0)").hide() : $("#options label").show(),
        "#tab4" == e && !$("#tab4").html()) {
            var a = {}
              , s = $('#configform [name="_q"]').val().split(",")
              , t = $('#configform [name="_r"]').val().split(",");
            -1 != $("#result").val() && t.push($("#result").val());
            for (var i = s.length - 1; 0 <= i; i--)
                s[i] && void 0 === a[s[i]] && 0 != t[i] && (a[s[i]] = t[i]);
            var r = [];
            $.each(a, function(e, a) {
                2 == a && r.push(e)
            });
            var n = r.length
              , l = "";
            if (0 === n)
                l = "見直し対象問題はありません。試験回または分野で出題範囲を指定してください。";
            else {
                l = '見直し対象問題数は<b style="font-size:120%">' + n + "</b>問です。<br>";
                for (r.reverse(),
                i = 0; i <= n - 1; i++) {
                    if (20 == i) {
                        l += "<br><span>その他　" + (n - 20) + "問</span>";
                        break
                    }
                    var o = r[i].split("_")
                      , c = o[0]
                      , d = o[1];
                    q = o[2],
                    l += "<span>" + ie(c + "_" + d) + " 問" + q + "</span>"
                }
            }
            $("#tab4").html(l)
        }
        return !1
    }),
    4 == t && $('#tabs a[href="#tab4"]').click(),
    $('#configform [name="check_all"]').click(function() {
        var e = "ON" == $(this).html();
        ($(this).val() ? $('[type="checkbox"]', "#" + $(this).val()) : $('[type="checkbox"]', $(this).parent().parent())).prop("checked", e)
    }),
    $('#configform [name="recommend"]').click(function() {
        var e = $(this).parent().parent();
        $('[type="checkbox"]', e).prop("checked", !1),
        ("ip" == testID ? $('[type="checkbox"]:lt(10)', e) : "fe" == testID ? $('[type="checkbox"]:lt(20)', e) : "ap" == testID ? $('[type="checkbox"]:lt(22):gt(1)', e) : $('[type="checkbox"]:lt(12):gt(1)', e)).prop("checked", !0)
    }),
    $('#configform [name="fields[]"]').change(function() {
        var e = $(this).prop("checked");
        $('[type="checkbox"]', "#" + $(this).val()).prop("checked", e)
    }),
    $('#configform [name="categories[]"]').change(function() {
        var e = $(this).parent().parent()
          , a = 0 !== $(":checked", e).length;
        $('#configform [value="' + e.attr("id") + '"]').prop("checked", a)
    }),
    $("#configform .submit").click(function() {
        function e(e, a) {
            $(e).css("backgroundColor", "rgba(248,131,131,.2)"),
            $("#tabs > .error").html(a).addClass("show")
        }
        try {
            var a;
            if ($("#tab1, #bunya, #fs3, #tab4, #options").css("background", "transparent"),
            $("#tabs > .error").html("").removeClass("show"),
            $("#tabs .active")[0] && (a = $("#tabs .active a").attr("href").replace(/#tab/, ""),
            $('[name="mode"]', $("#configform")).val(a)),
            (F() || S()) && $("#configform").submit(),
            1 == a && 0 === $(":checked", "#tab1").length)
                return e("#tab1", "※出題する範囲を1つ以上チェックしてください。"),
                !1;
            if (2 == a && 0 === $(":checked", "#bunya h4").length)
                return e("#bunya", "※出題する範囲を1つ以上チェックしてください。"),
                !1;
            if (2 == a && $('[value="timesFilter"]').prop("checked") && 0 === $(":checked", "#fs3").length)
                return e("#fs3", "※出題する範囲を1つ以上チェックしてください。"),
                !1;
            if ($('[value="noCalc"]').prop("checked") && $('[value="onlyCalc"]').prop("checked"))
                return e("#options", "※計算問題のオプションは同時指定できません。"),
                !1;
            if (4 == a && !$("#tab4 span")[0])
                return e("#tab4", "※試験回または分野で出題範囲を指定してください。"),
                !1;
            (2 == a && $('#configform [value="timesFilter"]').prop("checked") ? $('[type="checkbox"]', "#tab1") : $('[type="checkbox"]', "#fs3")).prop("checked", !1)
        } catch (e) {
            console.error(e.message)
        }
    });
    var l, o, Z = {}, k = {}, p = $("#userPanel").text();
    function c() {
        $("#doujoulogo")[0] && $.ajax({
            type: "POST",
            url: g,
            cache: !1,
            data: $.param({
                action: "continue"
            }),
            dataType: "json"
        }).done(function(e) {
            "success" == e.status ? $('<button class="continue submit" data-text="CONTINUE">続きから再開 (' + (Number(e.flags.qno) + 1) + "問目から)</button>").insertAfter($(".submit").eq(0)).data("flags", e.flags).click(function() {
                var e = $(this).data("flags")
                  , a = $("#configform");
                $('[name="mode"]', a).val(e.mode),
                $('[name="addition"]', a).val(e.addition),
                $('[name="qno"]', a).val(e.qno),
                $('[name="sid"]', a).val(e.sid),
                $('[name="_q"]', a).val(e._q),
                $('[name="_r"]', a).val(e._r),
                $('[name="_c"]', a).val(e._c),
                $('[name="startTime"]', a).val(e.startTime),
                e.review && a.append('<input type="hidden" name="review" value="' + e.review + '">'),
                e.unanswer && a.append('<input type="hidden" name="unanswer" value=\'' + e.unanswer + "'>"),
                $('[type="checkbox"]', a).val(Object.keys(e)),
                a.submit()
            }) : "error" == e.status && e.errorcode
        })
    }
    function b(e) {
        $("#stateMessage").html(e).addClass("show").delay(3e3).queue(function(e) {
            $("#stateMessage").removeClass("show"),
            e()
        })
    }
    function w() {
        $("#stateMessage").removeClass("show").delay(500).queue(function(e) {
            $(this).hasClass("show") || ($(this).html(""),
            e())
        })
    }
    function K(e, a, s) {
        $("body").addClass("modal"),
        $("#grayLayer").show();
        var t, i, r, n = $("#overLayer");
        _w = a ? a + "px" : "auto",
        n.css({
            width: _w,
            height: "auto"
        }).html('<div class="textBtn cross">×</div>' + e),
        a = a || n.width(),
        s = s || n.height(),
        $(window).height() > s ? (t = "fixed",
        i = "50%",
        r = -s / 2) : (t = "absolute",
        i = "5px",
        r = 0,
        1 < $(".qtable", n).length && $(".qtable", n).eq(0).remove()),
        n.css({
            width: a + "px",
            height: s + "px",
            "margin-left": -a / 2 + "px",
            "margin-top": r + "px",
            position: t,
            top: i
        }).fadeIn()
    }
    $("#userPanel").html('<style>#userPanel #adminForm, .login + #userPanel #loginForm, #userPanel .membership-menu{display:none}.login + #userPanel #adminForm{display:block}.member + #userPanel .not-membership-menu{display:none}.member + #userPanel .membership-menu{display:inline-block}</style><div id="formTitle">アカウントにログイン</div><form id="loginForm" autocomplete="on"><div class="inputWrap"><i class="user"></i><input type="text" name="userid" maxlength="96" placeholder="　" autocomplete="username" required><label>ユーザーID または メールアドレス</label></div><div class="inputWrap"><i class="password"></i><input type="password" name="password" maxlength="32" placeholder=" " autocomplete="current-password" required><label>パスワード</label><i class="eye togglePassword"></i></div><div><label class="autoLogin"><input type="checkbox" name="autoLogin">ログイン状態を保持する（1か月間）</label></div><div><button type="submit" name="login">ログイン</button></div><div><a href="javascript:void(0)" id="resetPassword">パスワードをお忘れの場合</a></div>アカウントを作成しませんか?<a href="javascript:void(0)" id="register">+新規登録</a></form><form id="adminForm"><ul><li><a href="javascript:void(0)" id="review" title="学習履歴全体の中から直前1回の出題が不正解の問題のみを出題します"><i class="review"></i><br>復習を開始</a><li><a href="javascript:void(0)" id="unanswer" title="学習履歴全体の中から解答歴のない問題のみを出題します"><i class="unanswer"></i><br>未解答を出題</a><li><a href="javascript:void(0)" id="checklist" title="3種類のチェック状態の閲覧、編集および色グループごとに復習できます"><i class="checklist"></i><br>チェック状態</a><li><a href="javascript:void(0)" id="history" title="学習履歴データを学習回ごとに閲覧できる機能です"><i class="history"></i><br>学習履歴</a><li><a href="javascript:void(0)" id="coverage" title="解いた問題の数と収録問題全体に占める割合を確認できます"><i class="coverage"></i><br>達成度</a><li><a href="javascript:void(0)" id="everytest" title="学習履歴を試験回ごとに集計したデータを閲覧できる機能です"><i class="everytest"></i><br>試験毎の成績</a><li><a href="javascript:void(0)"></a><li class="not-membership-menu"><a href="/membership/"><i class="membership"></i><br>メンバー登録</a><li class="membership-menu"><a href="/membership/tokuten/" target="_blank" rel="noopener"><i class="membership"></i><br>メンバー特典</a><li><a href="javascript:void(0)" id="account" title="パスワードの変更、パスワードリセットに必要となるメールアドレスの登録、学習履歴の初期化、アカウントの削除が行えます"><i class="account"></i><br>アカウント</a></ul><a href="javascript:void(0)" id="logout"><u>ログアウト</u></a></form>'),
    $("#userBtn").hasClass("login") && ($("#formTitle").html("学習履歴管理"),
    c()),
    (F() || S() || P()) && (F() ? (l = "復習モード中のため",
    o = "復習モードを終了する") : S() ? (l = "未解答優先モード中のため",
    o = "未解答優先モードを終了する") : (l = "模擬試験中のためオプション・",
    o = "模擬試験モードを終了する",
    $("#options").hide()),
    $("#tabs").hide().before('<div id="reviewWrap">※' + l + '出題範囲の指定ができません。<br><button id="review_end">' + o + "</button></div>")),
    $("#moshi_result")[0] && (f(),
    setTimeout(function() {
        $("#overLayer h2").html("模擬試験結果")
    }, 2e3)),
    $("#userBtn").click(function(e) {
        return $("#userPanel").toggleClass("show"),
        !1
    }),
    $("#userPanel").click(function(e) {
        e.stopPropagation()
    }),
    $("#contentWrap, #headerWrap").click(function() {
        $("#userPanel").removeClass("show")
    }),
    $("#register").click(function() {
        return K('<form id="registForm" class="miniForm validationForm"><h2>アカウントを作成する</h2><div class="message">アカウントを作成すると学習履歴が自動記録され、その履歴を利用した機能が利用できるようになります。</div><div class="inputWrap"><i class="user validate"></i><input type="text" name="userid" maxlength="20" placeholder="　" required><label>ユーザーID（0-9 a-z A-Z ._-で6～20文字)</label><div class="error"></div></div><div class="inputWrap"><i class="password validate"></i><input type="password" name="password" maxlength="32" placeholder="　" autocomplete="new-password" required><label>パスワード（半角英数字・記号で8～32文字)</label><div class="error"></div><i class="eye togglePassword"></i></div><div style="margin-top:-20px;white-space:nowrap">記号の種類 (`~!@#$%^&amp;*_+-={}[]|:;&quot;&apos;&lt;&gt;.,?/)</div><div><label class="autoLogin"><input type="checkbox" name="autoLogin">ログイン状態を保持する（1ヶ月間）</label></div><button type="submit" name="regist">ユーザー登録</button></form>', 360),
        !1
    }),
    $("#resetPassword").click(function() {
        return K('<form id="resetForm" class="miniForm validationForm"><h2>パスワードをリセットする</h2><div class="message">ユーザーIDと登録済メールアドレスをお送りいただくと、アカウントのパスワードをリセットできます。</div><div class="inputWrap"><i class="user"></i><input type="text" name="userid" maxlength="20" placeholder="　" autocomplete="username" required><label>ユーザーID</label><div class="error"></div></div><div class="inputWrap"><i class="email"></i><input type="email" name="email" maxlength="96" placeholder="　" autocomplete="email" required><label>メールアドレス（アカウント設定より登録済のもの）</label><div class="error"></div></div><button type="submit" name="reset">パスワードをリセットする</button></form>', 360),
        !1
    }),
    $("#overLayer").on("input", '[name="userid"], [name^="password"]', function() {
        var e = $(this).siblings(".validate");
        if (!e)
            return !1;
        e.removeClass("ok ng");
        var a = $(this).val();
        if (!a)
            return !1;
        var s = $(this).attr("name");
        "userid" == s && h.test(a) || 0 === s.indexOf("password") && r.test(a) ? e.addClass("ok") : e.addClass("ng"),
        $('#accountForm [name="password_confirm"]')[0] && (a = $('#accountForm [name="password_new"]'),
        e = $('#accountForm [name="password_confirm"]'),
        a.siblings(".validate").hasClass("ok") && a.val() == e.val() ? e.siblings(".validate").removeClass("ng").addClass("ok") : e.val() && e.siblings(".validate").removeClass("ok").addClass("ng"))
    }),
    $("#userPanel, #overLayer").on("click", ".togglePassword", function() {
        var e = $("input", $(this).parent());
        $(e).replaceWith($("<input />").val(e.val()).attr("name", e.attr("name")).attr("placeholder", e.attr("placeholder")).attr("autocomplete", e.attr("autocomplete")).attr("type", "password" == e.attr("type") ? "text" : "password").attr("maxlength", e.attr("maxlength")).attr("style", e.attr("style")))
    }),
    $("#overLayer").on("submit", "#registForm", function() {
        var e = !1
          , s = $(this)
          , t = s.find('[type="submit"]');
        $(".error", s).removeClass("show");
        var a, i = {
            userid: $('[name="userid"]', s).val(),
            password: $('[name="password"]', s).val(),
            action: "regist"
        };
        for (a in i)
            i[a] || ($('[name="' + a + '"]', s).siblings(".error").html("この項目の入力は必須です").addClass("show"),
            e = !0);
        return !e && (h.test(i.userid) || ($('[name="userid"]', s).siblings(".error").html("入力値が要件を満たす形式になっていません").addClass("show"),
        e = !0),
        r.test(i.password) || ($('[name="password"]', s).siblings(".error").html("入力値が要件を満たす形式になっていません").addClass("show"),
        e = !0),
        e || ($('[name="autoLogin"]', s).prop("checked") && (i.autoLogin = !0),
        $(".message", s).html(n),
        t.prop("disabled", !0).addClass("disabled"),
        d = !0,
        $.ajax({
            type: "post",
            url: g,
            cache: !1,
            data: $.param(i),
            dataType: "json"
        }).done(function(e) {
            if ("success" == e.status) {
                var a = '<h2>ユーザー登録が完了しました</h2><div class="img_margin"><img src="/img/ext/12.png" style="max-height:160px" alt="ユーザー登録ありがとう"></div><div class="message">今後とも当サイトをよろしくお願い申し上げます！<br>パスワードリセットに備えてアカウント設定からメールアドレスを登録することをおすすめします。<br><br><div style="font-size:110%"><b>ユーザーID</b>：' + (p = e.uid) + '<br><b>パスワード</b>：<input type="password" readonly value="' + i.password + '" style="border:0;padding:0;font-size:inherit;padding-left:4px;outline:0;width:auto;background:transparent"><i class="eye togglePassword"></i><div></div>';
                $(s).html(a),
                $("#formTitle").html("学習履歴管理"),
                $("#userBtn").addClass("login"),
                $("#userid").html(p + "さん")
                window.location.reload();
            } else if ("error" == e.status)
                switch (t.prop("disabled", !1).removeClass("disabled"),
                e.errorcode) {
                case 1:
                    $(".message", s).html('<i class="caution"></i>入力形式／内容に不備があるようです。<br>お手数ですがもう一度確認をお願い致します。');
                    break;
                case 2:
                    $(".message", s).html('<i class="caution"></i>申し訳ございません。セキュリティ上の理由でユーザーIDを含むパスワードは設定できません。'),
                    $('[name="password"]', s).siblings(".error").html("ユーザーIDを含まない文字列をご指定ください").addClass("show");
                    break;
                case 3:
                    $(".message", s).html('<i class="caution"></i>申し訳ございません。ご指定いただいたユーザーIDは、既に他のユーザーに使用されています。'),
                    $('[name="userid"]', s).siblings(".error").html('ユーザーID"' + e.uid + '"は使用されています').addClass("show");
                    break;
                case 4:
                    $(".message", s).html('<i class="ng"></i>データベース接続に失敗しました。')
                }
        }).fail(function(e, a) {
            t.prop("disabled", !1).removeClass("disabled"),
            $(".message", s).html('<i class="ng"></i>[' + a + "]サーバとの通信に失敗しました。")
        }).always(function() {
            d = !1
        })),
        !1)
    }),
    $("#loginForm").submit(function() {
        if ($("#userBtn").hasClass("login"))
            return b('<i class="caution"></i>不正なログイン要求です。'),
            !1;
        var e, a = $(this), s = a.find('[type="submit"]'), t = {
            userid: $('[name="userid"]', a).val(),
            password: $('[name="password"]', a).val(),
            action: "login"
        };
        for (e in t)
            if (!t[e])
                return b('<i class="caution"></i>未入力項目があります。'),
                !1;
        return $('[name="autoLogin"]', a).prop("checked") && (t.autoLogin = !0),
        b(m + "ログイン処理中です。"),
        s.prop("disabled", !0).addClass("disabled"),
        $.ajax({
            type: "post",
            url: g,
            cache: !1,
            data: $.param(t),
            dataType: "json"
        }).done(function(e) {
            if ("success" == e.status) {
                p = e.uid,
                $("#userid").html(p + "さん"),
                $("#formTitle").html("学習履歴管理"),
                $("#userBtn").addClass("login"),
                0 < e.plan && $("#userBtn").addClass("member");
                var a = new Date(1e3 * e.lasttime);
                b('<i class="ok"></i>"' + p + '"でログインしました。前回のログイン日時: ' + (a.getMonth() + 1) + "月" + a.getDate() + "日" + a.getHours() + "時" + a.getMinutes() + "分"),
                c()
            } else if ("error" == e.status)
                switch (e.errorcode) {
                case 1:
                case 2:
                    b('<i class="caution"></i>ユーザーIDまたはパスワードが正しくありません。');
                    break;
                case 3:
                    b('<i class="caution"></i>セキュリティ上の理由でアカウントはロックアウト中です。');
                    break;
                case 4:
                    b('<i class="ng"></i>データベース接続に失敗しました。');
                    break;
                case 7:
                    b('<i class="ng"></i>あと3回の失敗でアカウントはロックアウトされます。');
                    break;
                case 8:
                    b('<i class="ng"></i>あと2回の失敗でアカウントはロックアウトされます。');
                    break;
                case 9:
                    b('<i class="ng"></i>あと1回の失敗でアカウントはロックアウトされます。');
                    break;
                case 10:
                    b('<i class="ng"></i>連続してログインに失敗したため、アカウントへのアクセスが一定時間禁止されました。')
                }
        }).fail(function(e, a) {
            b('<i class="ng"></i>[' + a + "]サーバとの通信に失敗しました。")
        }).always(function() {
            s.prop("disabled", !1).removeClass("disabled")
        }),
        !1
    }),
    $("#logout").click(function() {
        $("#adminForm").submit()
    }),
    $("#adminForm").submit(function() {
        if (!$("#userBtn").hasClass("login") || !h.test(p))
            return b('<i class="caution"></i>不正なログアウト要求です。'),
            !1;
        return b(m + "ログアウト処理中です。"),
        $.ajax({
            type: "post",
            url: g,
            cache: !1,
            data: $.param({
                action: "logout"
            }),
            dataType: "json"
        }).done(function(e) {
            "success" == e.status ? (b('<i class="ok"></i>ログアウトしました。'),
            $("#formTitle").html("アカウントにログイン"),
            $("#userPanel").removeClass("show"),
            $("#userBtn").removeClass("login member"),
            $('#loginForm [name="userid"], #loginForm [name="password"]').val(""),
            $("#userid").html(i),
            (F() || S()) && ($("#reviewWrap").hide(),
            $("#tabs").fadeIn("normal", function() {
                $('#configform [name="review"], #configform [name="unanswer"], #reviewWrap').remove()
            })),
            $("#checkGroup, button.continue").remove(),
            $("#checkflag").val(-1),
            p = "",
            Z = {},
            k = {}) : "error" == e.status && 1 === e.errorcode && b('<i class="caution"></i>ログアウト処理に失敗しました。')
        }).fail(function(e, a) {
            b('<i class="ng"></i>[' + a + "]サーバとの通信に失敗しました。")
        }),
        !1
    }),
    $("#overLayer").on("submit", "#resetForm", function() {
        var e = !1
          , a = $(this)
          , s = a.find('[type="submit"]');
        $(".error", a).removeClass("show");
        var t, i = {
            userid: $('[name="userid"]', a).val(),
            email: $('[name="email"]', a).val(),
            action: "resetPassword"
        };
        for (t in i)
            i[t] || ($('[name="' + t + '"]', a).siblings(".error").html("この項目の入力は必須です").addClass("show"),
            e = !0);
        return e || ($(".message", a).html(n),
        s.prop("disabled", !0).addClass("disabled"),
        d = !0,
        $.ajax({
            type: "post",
            url: g,
            cache: !1,
            data: $.param(i),
            dataType: "json"
        }).done(function(e) {
            if ("success" == e.status)
                $(a).html('<h2>パスワードをリセットしました</h2><div class="img_margin"><img src="/img/ext/mail.png" style="max-height:170px;"></div><div class="message">仮パスワードを記載したメールを送信しました。メールに記載された手順に従ってアカウントへのアクセスを回復させてください。</div>');
            else if ("error" == e.status)
                switch (s.prop("disabled", !1).removeClass("disabled"),
                e.errorcode) {
                case 1:
                case 2:
                    $(".message", a).html('<i class="caution"></i>ユーザーIDまたはメールアドレスが正しくありません。');
                    break;
                case 3:
                    $(".message", a).html('<i class="caution"></i>セキュリティ上の理由でアカウントはロックアウトされています。');
                    break;
                case 4:
                    $(".message", a).html('<i class="ng"></i>パスワードのリセットに失敗しました。');
                    break;
                case 5:
                    $(".message", a).html('<i class="ng"></i>メール送信に失敗しました。');
                    break;
                case 6:
                    $(".message", a).html('<i class="ng"></i>データベース接続に失敗しました。')
                }
        }).fail(function(e, a) {
            s.prop("disabled", !1).removeClass("disabled"),
            $("#registForm .message").html('<i class="ng"></i>[' + a + "]サーバとの通信に失敗しました。")
        }).always(function() {
            d = !1
        })),
        !1
    }),
    $("#stateMessage").click(function() {
        w()
    });
    var X, ee, d = !1;
    function u() {
        d || ($("#overLayer, #grayLayer").fadeOut(),
        $("body").removeClass("modal"))
    }
    function v(p) {
        var v = new $.Deferred;
        if (!$.isEmptyObject(Z))
            return v.resolve(),
            v.promise();
        var f = {
            action: "load"
        };
        return p && b(m + "サーバからデータを取得しています。"),
        $.ajax({
            type: "POST",
            url: g,
            cache: !1,
            data: $.param(f),
            dataType: "json"
        }).done(function(e) {
            if (w(),
            "success" == e.status) {
                var a;
                Z = e.log,
                1 < $('#configform [name="qno"]').val() && (a = $('#configform [name="sid"]').val(),
                Z[a] = {
                    date: Math.ceil(Date.now() / 1e3),
                    studyTime: Math.ceil(Date.now() / 1e3 - $('#configform [name="startTime"]').val()),
                    _q: $('#configform [name="_q"]').val().replace(/,[^,]+?$/, ""),
                    _r: $('#configform [name="_r"]').val() || "0",
                    _c: $('#configform [name="_c"]').val().replace(/,[^,]+?$/, "")
                },
                se() && (Z[a]._q += "," + $('#configform [name="_q"]').val().split(",").pop(),
                Z[a]._c += "," + $('#configform [name="_c"]').val().split(",").pop()));
                for (var s, t = ae(Z), i = 0, r = "", n = "", l = "", o = [], c = [0], d = 0, u = t.length; d < u; d++) {
                    var m, h = t[d];
                    i += Z[h].studyTime,
                    qcount = Z[h]._q.split(",").length,
                    rcount = Z[h]._r.split(",").length,
                    rcount > qcount && ((m = Z[h]._r.split(",")).length = qcount,
                    Z[h]._r = m.join(",")),
                    r += Z[h]._q + ",",
                    n += Z[h]._r + ",",
                    l += Z[h]._c + ",",
                    o.push(Z[h].date),
                    c.push(r.split(",").length - 1)
                }
                Z.total = {
                    studyTime: i,
                    _q: r.slice(0, -1),
                    _r: n.slice(0, -1),
                    _c: l.slice(0, -1),
                    date: o,
                    dem: c
                },
                v.resolve(),
                window.Worker && ((s = new Worker(__kJs("/static/core/js/worker.js?20240806"))).onmessage = function(e) {
                    k.rankDetail = JSON.parse(e.data),
                    k.rankDetail.rank = getDan(k.rankDetail),
                    $("#slider").is(":visible") && ($(".currentQCount", $("#slider>div").eq(0)).html(k.rankDetail.qCount + "問"),
                    $(".currentRank", $("#slider>div").eq(0)).html(O(k.rankDetail.rank)),
                    $("#initData, #showRankDetail").prop("disabled", !1)),
                    f = {
                        action: "setRank",
                        rank: k.rankDetail.rank
                    },
                    $.ajax({
                        type: "POST",
                        url: g,
                        cache: !1,
                        data: $.param(f),
                        dataType: "json"
                    }).done(function(e) {
                        "success" == e.status && e.rank && (k.rankDetail.rank = e.rank,
                        $("#slider").is(":visible") && $(".currentRank", $("#slider>div").eq(0)).html(O(e.rank)))
                    }),
                    s.terminate()
                }
                ,
                s.postMessage(JSON.stringify({
                    _q: Z.total._q,
                    _r: Z.total._r,
                    allTimes: N(),
                    testID: testID
                })))
            } else if ("error" == e.status && (p && v.reject(),
            !$("#slider").is(":visible")))
                switch (e.errorcode) {
                case 1:
                case 2:
                    b('<i class="caution"></i>集計対象の学習履歴が見つかりません。');
                    break;
                case 3:
                    b('<i class="caution"></i>ユーザーIDまたはセッションIDが不正な値です。')
                }
        }).fail(function(e, a) {
            b('<i class="ng"></i>[' + a + "]サーバとの通信に失敗しました。"),
            v.reject()
        }),
        v.promise()
    }
    function ae(e, s) {
        var a, t = [], i = [];
        for (a in e)
            6 < a.length && i.push({
                sid: a,
                date: e[a].date
            });
        for (i.sort(function(e, a) {
            e = e.date,
            a = a.date;
            return s ? a - e : e - a
        }),
        a = 0,
        len = i.length; a < len; a++)
            t.push(i[a].sid);
        return t
    }
    function f(e) {
        var a = ae(Z, !0)
          , s = ""
          , t = 0;
        if (!$("#overLayer").is(":visible") && e) {
            var i, r, n, l = "", o = "", c = "", d = "", u = "", m = "", h = 0, p = 0, v = $('#configform [name="sid"]').val(), f = new Date, g = f.getFullYear() + ("0" + (f.getMonth() + 1)).slice(-2), b = a[0], u = (L = new Date(1e3 * Z[b].date)).getFullYear() + ("0" + (L.getMonth() + 1)).slice(-2), k = 0;
            for (len = a.length; k < len; k++)
                j = a[k],
                h++,
                t = 0,
                i = (L = new Date(1e3 * Z[j].date)).getDate() + "日 " + ("0" + L.getHours()).slice(-2) + ":" + ("0" + L.getMinutes()).slice(-2),
                j == v && 1 < $('#configform [name="qno"]').val() ? (t = $('#configform [name="qno"]').val() - 1,
                se() && t++,
                l += '<option value="' + v + '" selected>今回 (' + t + "問)") : l += '<option value="' + j + '">' + i + " (" + (t = Z[j]._q.split(",").length) + "問)",
                p += t,
                u != (m = k == len - 1 ? "" : (r = a[k + 1],
                (n = new Date(1e3 * Z[r].date)).getFullYear() + ("0" + (n.getMonth() + 1)).slice(-2))) && (o += '<option value="' + u + '">' + (u == g ? "今月" : g - u == 1 || g - u == 89 ? "先月" : L.getFullYear() + "年" + (L.getMonth() + 1) + "月") + " (" + h + ")",
                l = '<option value="' + u + '">月間合計 (' + p + "問)" + l,
                d = d || l,
                c += '<optgroup label="" class="' + u + '">' + l,
                h = p = 0,
                u = m,
                l = "");
            s = '<div class="selectWrap"><select id="selectMonth">' + o + '<option value="total">全期間</select> &#8811; <select id="selectReport">' + d + '</select><select id="selectReport2" class="displayNone">' + c + '<optgroup label="" class="total"><option value="total">全期間</select></div>'
        }
        var f = s + "<h2>" + ($("#moshi_result")[0] && !e ? "模擬試験結果" : "成績レポート") + "</h2>"
          , w = {};
        if (e) {
            if (/^[0-9]{6}$/.test(e)) {
                var y = 0
                  , _ = ""
                  , C = ""
                  , x = ""
                  , D = []
                  , q = [0];
                for (k = a.length - 1; 0 <= k; k--) {
                    var L, I, j = a[k];
                    e == (L = new Date(1e3 * Z[j].date)).getFullYear() + ("0" + (L.getMonth() + 1)).slice(-2) && (y += Z[j].studyTime,
                    t = Z[j]._q.split(",").length,
                    rcount = Z[j]._r.split(",").length,
                    rcount > t && ((I = Z[j]._r.split(",")).length = t,
                    Z[j]._r = I.join(",")),
                    _ += Z[j]._q + ",",
                    C += Z[j]._r + ",",
                    x += Z[j]._c + ",",
                    D.push(Z[j].date),
                    q.push(_.split(",").length - 1))
                }
                Z[e] = {
                    studyTime: y,
                    _q: _.slice(0, -1),
                    _r: C.slice(0, -1),
                    _c: x.slice(0, -1),
                    date: D,
                    dem: q
                }
            }
            w = {
                date: 0 | Z[e].date,
                studyTime: Math.ceil(Z[e].studyTime / 60),
                _q: Z[e]._q.split(","),
                _r: Z[e]._r.split(","),
                _c: Z[e]._c.split(",")
            },
            "total" != e && !/^[0-9]{6}$/.test(e) || (w.date = Z[e].date,
            w.dem = Z[e].dem)
        } else
            w = {
                date: Date.now(),
                studyTime: Math.ceil(Date.now() / 6e4 - $('#configform [name="startTime"]').val() / 60),
                _q: $('#configform [name="_q"]').val().replace(/,[^,]+?$/, "").split(","),
                _r: $('#configform [name="_r"]').val().split(","),
                _c: $('#configform [name="_c"]').val().replace(/,[^,]+?$/, "").split(",")
            },
            se() && (w._q.push($('#configform [name="_q"]').val().split(",").pop()),
            w._c.push($('#configform [name="_c"]').val().split(",").pop()));
        for (var T, F, S = w._q.length, b = $.grep(w._r, function(e) {
            return 1 == e
        }).length, s = ($.grep(w._r, function(e) {
            return 0 == e
        }).length,
        (b / S * 100).toFixed(1)), P = [], W = [], O = [], M = 0; M <= 2; M++) {
            for (P[M] = [],
            W[M] = [],
            O[M] = [],
            k = 0; k <= 2; k++)
                P[M].push(0);
            for (k = 0; k <= 8; k++)
                W[M].push(0);
            for (k = 0; k <= 23; k++)
                O[M].push(0)
        }
        for (k = 0; k <= S - 1; k++)
            T = V ? w._c[k] == spField ? 0 : 1 : getFieldIdx(w._c[k]),
            F = getBigIdx(w._c[k]),
            P[0][T]++,
            W[0][F]++,
            O[0][w._c[k]]++,
            1 == w._r[k] && (P[1][T]++,
            W[1][F]++,
            O[1][w._c[k]]++);
        for (k = 0; k <= 2; k++)
            0 < P[0][k] && (P[2][k] = (P[1][k] / P[0][k] * 100).toFixed(1));
        for (k = 0; k <= 8; k++)
            0 < W[0][k] && (W[2][k] = (W[1][k] / W[0][k] * 100).toFixed(1));
        for (k = 1; k <= 23; k++)
            0 < O[0][k] && (O[2][k] = (O[1][k] / O[0][k] * 100).toFixed(1));
        var B, N = "";
        for (k = 0; k <= 2; k++)
            B = V ? 0 == k ? "★" + middleFieldarr[spField] : 1 == k ? "その他の分野" : "" : fieldarr[k],
            N += V && 2 == k ? '<dt class="hidden">&nbsp;</dt><dd class="hidden"></dd>' : "<dt>" + B + "（" + P[1][k] + " / " + P[0][k] + ' 問中）</dt><dd><div style="width:' + P[2][k] + '%"></div><p>' + (0 == P[0][k] ? "－" : P[2][k] + "%") + "</p></dd>";
        var A = ["", "", "", "", "", "", "", "", ""];
        for (k = 1; k <= 23; k++)
            bidx = getBigIdx(k),
            bigFieldarr[bidx] && (A[bidx] += middleFieldarr[k] + "（" + O[1][k] + "/" + O[0][k] + "問：" + (0 == O[0][k] ? "－" : O[2][k] + "%") + "）&#x0A;");
        var R = "";
        for (k = 0; k <= 8; k++)
            R += bigFieldarr[k] ? "<dt>" + bigFieldarr[k] + "（" + W[1][k] + " / " + W[0][k] + ' 問中）</dt><dd title="' + A[k] + '"><div style="width:' + W[2][k] + '%"></div><p>' + (0 == W[0][k] ? "－" : W[2][k] + "%") + "</p></dd>" : '<dt class="hidden">&nbsp;</dt><dd class="hidden"></dd>';
        var E = ""
          , Y = V ? "am2_" : "q"
          , G = 0;
        for (k = 0; k <= S - 1; k++)
            if (w._q[k]) {
                var z = w._q[k].split("_")
                  , J = z[0]
                  , U = z[1]
                  , _ = z[2]
                  , z = ie(J + "_" + U);
                "total" != e && !/^[0-9]{6}$/.test(e) || w.dem[G] != k || (E += '<tr class="h"><th colspan="5">' + function(e) {
                    e = new Date(e);
                    return e.getFullYear() + "." + ("0" + (e.getMonth() + 1)).slice(-2) + "." + ("0" + e.getDate()).slice(-2) + " " + ("0" + e.getHours()).slice(-2) + ":" + ("0" + e.getMinutes()).slice(-2)
                }(1e3 * w.date[G]) + "　" + (w.dem[G + 1] - w.dem[G]) + "問",
                G++);
                var Q = "";
                switch (Number(w._r[k])) {
                case 1:
                    Q = '<i class="maru"></i>';
                    break;
                case 2:
                    Q = '<i class="ng"></i>';
                    break;
                default:
                    Q = "－"
                }
                E += "<tr><td>" + (k + 1) + '<td class="r">' + Q + "<td>" + fieldarr[getFieldIdx(w._c[k])] + "<td>" + middleFieldarr[w._c[k]] + '<td><a href="/kakomon/' + J + "_" + U + "/" + Y + _ + '.html" target="_blank" rel="noopener">' + z + " 問" + _ + "</a>"
            }
        var H = '<div id="reportWrap"><div class="reportInnerWrap"><div class="leftCol"><div class="box"><h3>総合成績<em class="r" style="font-size:16px;margin-left:1em">' + te(s) + "</em></h3><dl><dt>" + S + "問中" + b + '問正解</dt><dd><div style="width:' + s + '%"></div><p class="big"><span>' + s + '</span>%</p></dd></dl></div><div class="box"><h3>分野別の成績</h3><dl>' + N + '</dl></div><div class="box"><h3>大分類別の成績</h3><dl>' + R + '</dl></div></div><div class="rightCol"><div class="historyTableWrap"><table class="qtable"><tr class="h sticky"><th width="25">&#8470;<th width="30">正誤<th>分野<th>中分類<th>出典' + E + '</table></div></div></div><div class="reportInnerWrap"><div class="leftCol"><a href="javascript:void(0)" id="csvDownload"><i class="csv"></i>CSV形式でダウンロード</a></div><div class="rightCol anslink">○:正解 ×:不正解 -:未解答</div></div></div>'
          , s = 0;
        $("#overLayer").is(":visible") ? ($("#reportWrap").fadeOut(300, function() {
            $(this).replaceWith(H).fadeIn(300)
        }),
        s = 300) : K(f + H, 800),
        setTimeout(function() {
            $("#overLayer dd div").addClass("show"),
            ee = 100,
            X = $("tr", $(".historyTableWrap")).eq(ee - 10),
            $(".historyTableWrap").scroll(function() {
                var e;
                X[0] && (e = $(this).height() + $(this).offset().top,
                X.offset().top < e && (e = $(this),
                ee += 100,
                $("tr:lt(" + (ee + 1) + ")", e).show(),
                X = $("tr", e).eq(ee - 10)))
            })
        }, 100 + s)
    }
    function _(P) {
        var W = N().reverse();
        P = P || W[0];
        var e, s, O = [], M = [];
        e = P,
        s = new $.Deferred,
        e = {
            y_k: e,
            action: "cdata"
        },
        $.ajax({
            type: "GET",
            url: g,
            data: $.param(e),
            dataType: "json"
        }).done(function(e) {
            if ("success" == e.status)
                M = e.cdata,
                s.resolve();
            else if ("error" == e.status) {
                switch (e.errorcode) {
                case 1:
                    b('<i class="caution"></i>分野データの取得に失敗しました。');
                    break;
                case 2:
                    b('<i class="caution"></i>ユーザーIDまたはセッションIDが不正な値です。')
                }
                s.reject()
            }
        }).fail(function(e, a) {
            b('<i class="ng"></i>[' + a + "]サーバとの通信に失敗しました。"),
            s.reject()
        }),
        s.promise().done(function() {
            for (var e = "", a = 0, s = W.length; a < s; a++) {
                var t = W[a];
                e += '<option value="' + t + '">' + ie(t)
            }
            var i, r, n, l = '<div class="selectWrap"><select id="selectTest">' + e + "</select></div>" + "<h2>試験回別レポート</h2>", o = Z.total._q.split(","), c = Z.total._r.split(","), d = Z.total._c.split(","), u = 0, m = 0, h = 0, p = [], v = [], f = [];
            for (j = 0; j <= 2; j++) {
                for (p[j] = [],
                v[j] = [],
                f[j] = [],
                a = 0; a <= 2; a++)
                    p[j].push(0);
                for (a = 0; a <= 8; a++)
                    v[j].push(0);
                for (a = 0; a <= 23; a++)
                    f[j].push(0)
            }
            for (a = 0,
            s = o.length; a < s; a++)
                o[a] && -1 !== o[a].indexOf(P) && (i = V ? d[a] == spField ? 0 : 1 : getFieldIdx(d[a]),
                n = getBigIdx(d[a]),
                u++,
                p[0][i]++,
                v[0][n]++,
                f[0][d[a]]++,
                1 == c[a] && (m++,
                p[1][i]++,
                v[1][n]++,
                f[1][d[a]]++),
                n = (r = o[a].split("_"))[2],
                O[n] = void 0 === O[n] ? c[a] : O[n] + String(c[a]));
            for (h = u ? (m / u * 100).toFixed(1) : "－",
            a = 0; a <= 2; a++)
                0 < p[0][a] && (p[2][a] = (p[1][a] / p[0][a] * 100).toFixed(1));
            for (a = 0; a <= 8; a++)
                0 < v[0][a] && (v[2][a] = (v[1][a] / v[0][a] * 100).toFixed(1));
            for (a = 1; a <= 23; a++)
                0 < f[0][a] && (f[2][a] = (f[1][a] / f[0][a] * 100).toFixed(1));
            for (var g, b = "", k = "", a = 0; a <= 2; a++)
                g = V ? 0 == a ? "★" + middleFieldarr[spField] : 1 == a ? "その他の分野" : "" : fieldarr[a],
                b += "<dt" + (k = V && 2 == a ? ' class="hidden"' : "") + ">" + g + "（" + p[1][a] + " / " + p[0][a] + " 問中）</dt><dd" + k + '><div style="width:' + p[2][a] + '%"></div><p>' + (0 == p[0][a] ? "－" : p[2][a] + "%") + "</p></dd>";
            var w = ["", "", "", "", "", "", "", "", ""];
            for (a = 1; a <= 23; a++)
                bidx = getBigIdx(a),
                bigFieldarr[bidx] && (w[bidx] += middleFieldarr[a] + "（" + f[1][a] + " / " + f[0][a] + " 問中：" + (0 == f[0][a] ? "－" : f[2][a] + "%") + "）&#x0A;");
            var y = "";
            for (a = 0; a <= 8; a++)
                y += "<dt" + (k = bigFieldarr[a] ? "" : ' class="hidden"') + ">" + bigFieldarr[a] + "（" + v[1][a] + " / " + v[0][a] + " 問中）</dt><dd" + k + ' title="' + w[a] + '"><div style="width:' + v[2][a] + '%"></div><p>' + (0 == v[0][a] ? "－" : v[2][a] + "%") + "</p></dd>";
            var _ = ""
              , C = V ? "am2_" : "q";
            for (a = 1,
            s = A(P); a <= s; a++) {
                var x, D, q = "-", L = "-", I = "－", T = "", F = "";
                O[a] && (x = (r = P.split("_"))[0],
                D = r[1],
                q = O[a].length,
                I = ((L = O[a].split("1").length - 1) / q * 100).toFixed(1),
                F = O[a].replace(/1/g, B[1]).replace(/2/g, B[2]).replace(/0/g, B[0]),
                T = 60 <= I ? " ok" : 40 <= I ? " caution" : " ng"),
                _ += '<tr><td><a href="/kakomon/' + x + "_" + D + "/" + C + a + '.html">問' + a + "</a><td>" + fieldarr[getFieldIdx(M[a])].replace(/プログラミング/, "") + "<td>" + middleFieldarr[M[a]] + "<td>" + L + " / " + q + '<td class="r' + T + '">' + I + "%<td>" + F
            }
            var S = '<div id="reportWrap"><div class="reportInnerWrap"><div class="leftCol"><div class="box"><h3>総合成績<em class="r" style="font-size:16px;margin-left:1em">' + te(h) + "</em></h3><dl><dt>" + u + "問中" + m + '問正解</dt><dd><div style="width:' + h + '%"></div><p class="big"><span>' + h + '</span>%</p></dd></dl></div><div class="box"><h3>分野別の成績</h3><dl>' + b + '</dl></div><div class="box"><h3>大分類別の成績</h3><dl>' + y + '</dl></div></div><div class="rightCol"><div class="historyTableWrap" style="max-width:490px"><table class="qtable"><tr class="h sticky"><th width="25">&#8470;<th>分野<th>中分類<th>正解/出題<th>正解率<th>履歴(→直近)' + _ + '</table></div></div></div><div class="reportInnerWrap"><div class="leftCol"></div><div class="rightCol anslink">○:正解 ×:不正解 -:未解答</div></div></div>'
              , h = 0;
            $("#overLayer").is(":visible") ? ($("#reportWrap").fadeOut(300, function() {
                $(this).replaceWith(S).fadeIn(300)
            }),
            h = 300) : K(l + S, 800),
            setTimeout(function() {
                $("#overLayer dd div").addClass("show")
            }, 100 + h)
        })
    }
    function C() {
        var e = 0;
        return $("#checkGroup span").each(function() {
            e += $(this).hasClass("checked") ? +$(this).attr("data-flag") : 0
        }),
        e
    }
    $("#grayLayer").click(function() {
        u()
    }),
    $("#overLayer").on("click", ".cross", function() {
        u()
    }),
    $("#coverage").click(function() {
        return $("#userBtn").hasClass("login") && h.test(p) ? v().done(function() {
            !function() {
                var e, a, s = {}, t = N().reverse();
                for (e = 0,
                len = t.length; e < len; e++)
                    s[t[e]] = [];
                var i, r = Z.total._q.split(","), n = Z.total._r.split(",");
                for (e = 0,
                len = r.length; e < len; e++)
                    r[e] && (i = r[e].split("_"),
                    a = i[0] + "_" + i[1],
                    i = i[2],
                    s[a] && (s[a][i] = void 0 === s[a][i] ? n[e] : s[a][i] + String(n[e])));
                switch (testID) {
                case "ip":
                    maxLen = 100;
                    break;
                case "sg":
                    maxLen = 50;
                    break;
                case "sc":
                case "nw":
                case "db":
                case "pm":
                    maxLen = 25;
                    break;
                default:
                    maxLen = 80
                }
                var l = 0
                  , o = 0
                  , c = ""
                  , d = [[], [], [], []];
                for (e = 1; e <= maxLen; e++)
                    c += "<th>" + e;
                var u = V ? "am2_" : "q";
                for (e = 0,
                len = t.length; e < len; e++) {
                    var m = ie(a = t[e]);
                    c += '<tr><th class="fixedCol">' + m;
                    var h = ""
                      , p = ""
                      , v = ""
                      , f = A(a);
                    l += f;
                    for (var g = 1; g <= f; g++)
                        s[a][g] && 0 != s[a][g] ? (h = s[a][g].replace(/2/g, B[2]).replace(/1/g, B[1]).replace(/0/g, B[0]),
                        "11" == (p = ("0" + s[a][g].replace(/0/g, "")).slice(-2)) ? (v = 3,
                        d[0].push(a + "_" + g)) : "01" == p || "21" == p ? (v = 2,
                        d[1].push(a + "_" + g)) : "02" == p || "12" == p ? (v = 1,
                        d[2].push(a + "_" + g)) : "22" == p && (v = 0,
                        d[3].push(a + "_" + g)),
                        o++) : (h = "",
                        v = "-"),
                        c += "<td" + (h = h ? ' title="' + h + '"' : "") + '><a href="/kakomon/' + a + "/" + u + g + '.html" target="_blank" rel="noopener"><i class="rank' + v + '"></i></a>'
                }
                for (e = 0,
                len = d.length; e < len; e++)
                    d[e].sort(function() {
                        return Math.random() - .5
                    });
                var b = -1 != $.inArray(testID, ["sg"]) ? Math.min(o / (l - 1), 1) : o / l;
                b = (100 * b).toFixed(1);
                var k = "<button>復習</button>"
                  , w = d[0].length ? k : ""
                  , y = d[1].length ? k : ""
                  , _ = d[2].length ? k : ""
                  , k = d[3].length ? k : "";
                K('<span id="review_ok"></span><ul class="submenu displayNone"><li><i class="rank3"></i> ' + d[0].length + "問" + w + '<li><i class="rank2"></i> ' + d[1].length + "問" + y + '<li><i class="rank1"></i> ' + d[2].length + "問" + _ + '<li><i class="rank0"></i> ' + d[3].length + "問" + k + '</ul><h2>網羅度レポート<span class="studyTime">〔全' + l + "問中" + o + '問解答済み〕</span><dl><dd><div style="width:' + b + '%"></div><p class="big"><span>' + b + '</span>%</p></dd></dl><button class="plus">色ごとに復習</button></h2><div class="coverageTableWrap"><table class="qtable coverage"><tr class="h sticky"><th class="fixedCol">' + c + '</table></div><div class="anslink"><i class="rank3"></i>直前2回の出題が共に正解　<i class="rank2"></i>直前1回が正解　<i class="rank1"></i>直前1回が不正解　<i class="rank0"></i>:直前2回が共に不正解　空欄：解答歴なし<br>表の各セルをクリックすると、その問題を別タブで開きます。</div>', V ? 800 : 1e3),
                setTimeout(function() {
                    $("#overLayer dd div").addClass("show")
                }, 100),
                $("#overLayer .submenu>li").each(function() {
                    var e;
                    $("button", $(this))[0] && (e = $("#overLayer .submenu>li").index(this),
                    $("button", $(this)).data("val", d[e].join(",")))
                })
            }()
        }) : b('<i class="caution"></i>不正なリクエストです。'),
        !1
    }),
    $("#history").click(function() {
        return $("#userBtn").hasClass("login") && h.test(p) ? v().done(function() {
            var e, a = $('#configform [name="sid"]').val();
            $('#configform [name="qno"]').val() <= 1 && (e = ae(Z, !0),
            a = (e = new Date(1e3 * Z[e[0]].date)).getFullYear() + ("0" + (e.getMonth() + 1)).slice(-2)),
            f(a)
        }) : b('<i class="caution"></i>不正なリクエストです。'),
        !1
    }),
    $("#showReport").click(function() {
        return f(),
        !1
    }),
    $("#overLayer").on("change", "#selectMonth", function() {
        $("#selectReport").html($("#selectReport2 ." + $(this).val()).html()).children().first().prop("selected", !0),
        $("#selectReport").change()
    }),
    $("#overLayer").on("change", "#selectReport", function() {
        f($(this).val())
    }),
    $("#overLayer").on("change", "#selectTest", function() {
        _($(this).val())
    }),
    $("#everytest").click(function() {
        return $("#userBtn").hasClass("login") && h.test(p) ? v().done(function() {
            _()
        }) : b('<i class="caution"></i>不正なリクエストです。'),
        !1
    });
    var x = C();
    function D() {
        var e = N().reverse();
        switch (testID) {
        case "ip":
            maxLen = 100;
            break;
        case "sg":
            maxLen = 50;
            break;
        case "sc":
        case "nw":
        case "db":
        case "pm":
            maxLen = 25;
            break;
        default:
            maxLen = 80
        }
        for (var a = "", s = "", t = "", i = "", r = [[], [], []], n = 1; n <= maxLen; n++)
            a += "<th>" + n;
        var l = V ? "am2_" : "q"
          , n = 0;
        for (len = e.length; n < len; n++) {
            var o = e[n].split("_")
              , c = o[0] + "_" + o[1]
              , o = ie(c);
            s += '<tr><th title="' + c + '" class="fixedCol">' + o,
            t += '<tr><th title="' + c + '" class="fixedCol">' + o,
            i += '<tr><th title="' + c + '" class="fixedCol">' + o;
            for (var d = A(c), u = ' class="checked"', m = 1; m <= d; m++) {
                var h = ""
                  , p = ""
                  , v = "";
                k.checklist[c] && 0 < (1 & k.checklist[c][m - 1]) && (h = u,
                r[0].push(c + "_" + m)),
                k.checklist[c] && 0 < (2 & k.checklist[c][m - 1]) && (p = u,
                r[1].push(c + "_" + m)),
                k.checklist[c] && 0 < (4 & k.checklist[c][m - 1]) && (v = u,
                r[2].push(c + "_" + m)),
                s += '<td><a href="/kakomon/' + c + "/" + l + m + '.html" target="_blank" rel="noopener"' + h + ">&#10003;</a>",
                t += '<td><a href="/kakomon/' + c + "/" + l + m + '.html" target="_blank" rel="noopener"' + p + ">&#10003;</a>",
                i += '<td><a href="/kakomon/' + c + "/" + l + m + '.html" target="_blank" rel="noopener"' + v + ">&#10003;</a>"
            }
        }
        for (n = 0,
        len = r.length; n < len; n++)
            r[n].sort(function() {
                return Math.random() - .5
            });
        var f = "<button>復習</button>"
          , g = r[0].length ? f : ""
          , b = r[1].length ? f : ""
          , f = r[2].length ? f : ""
          , g = '<ul class="submenu displayNone"><li><span class="checkG checked">&#10003;</span> ' + r[0].length + "問" + g + '<li><span class="checkY checked">&#10003;</span> ' + r[1].length + "問" + b + '<li><span class="checkP checked">&#10003;</span> ' + r[2].length + "問" + f + '</ul><h2>問題チェックリスト<div class="tabs"><span class="checkG checked" data-flag="1">&#10003;</span><span class="checkY" data-flag="2">&#10003;</span><span class="checkP" data-flag="4">&#10003;</span></div><span id="editbox"><button class="start">編集</button></span><button class="plus">色ごとに復習</button><span id="review_ok"></span></span></h2><div class="coverageTableWrap"><table class="qtable coverage" id="tabG"><tr class="h sticky"><th class="fixedCol">&#8470;' + a + s + '</table><table class="qtable coverage" id="tabY"><tr class="h sticky"><th class="fixedCol">&#8470;' + a + t + '</table><table class="qtable coverage" id="tabP"><tr class="h sticky"><th class="fixedCol">&#8470;' + a + i + '</table></div><div class="anslink">表の各セルをクリックすると、その問題を別タブで開きます。</div>'
          , b = $(".tabs .checkY.checked")[0] ? "Y" : $(".tabs .checkP.checked")[0] ? "P" : "G"
          , f = $(".coverageTableWrap").scrollLeft();
        K(g, V ? 850 : 1e3),
        $(".coverageTableWrap").scrollLeft(f),
        "G" != b && $(".tabs .check" + b).trigger("click"),
        $("#overLayer .submenu>li").each(function() {
            var e;
            $("button", $(this))[0] && (e = $("#overLayer .submenu>li").index(this),
            $("button", $(this)).data("val", r[e].join(",")))
        })
    }
    $("body").on("click", "#checkGroup span", function() {
        $(this).toggleClass("checked");
        var e = C();
        e != x ? $("#checkflag").val(e) : $("#checkflag").val(-1)
    }),
    $("#overLayer").on("click", '.tabs [class^="check"]', function() {
        $('.tabs [class^="check"]').removeClass("checked");
        var e = "#tab" + $(this).attr("class").slice(-1);
        $(this).addClass("checked"),
        $('#overLayer [id^="tab"]:not("' + e + '")').hide(0, function() {
            $("#overLayer " + e).fadeIn("fast")
        })
    }),
    $("#overLayer").on("click", ".plus", function() {
        $(".coverageTableWrap").hasClass("edit") || ($(".submenu", $("#overLayer")).toggleClass("displayNone"),
        $(".submenu>li>button", $("#overLayer")).removeClass("action").html("復習"))
    }),
    $("#overLayer").on("click", ".submenu>li>button", function() {
        $(this).hasClass("action") ? ($("#review").data("val", $(this).data("val")),
        $("#review_ok").trigger("click")) : ($(".submenu>li>button", $("#overLayer")).removeClass("action").html("復習"),
        $(this).addClass("action").html("開始"))
    }),
    $("#overLayer").on("click", "#editbox .start", function() {
        $(".coverageTableWrap").addClass("edit"),
        $("#overLayer .anslink").html("表の各セルをクリックすると、チェック状態の切替えができます。"),
        $(".submenu", $("#overLayer")).addClass("displayNone"),
        $("#editbox .mes").remove(),
        $(this).toggleClass("start done").html('<i class="ok"></i>完了').before('<button class="end">キャンセル</button>'),
        k.checklist2 = $.extend({}, k.checklist)
    }),
    $("#overLayer").on("click", "#editbox .done, #editbox .end", function() {
        $(this).hasClass("done") && (k.checklist = k.checklist2,
        inputParams = {
            action: "saveCheckList",
            checklist: JSON.stringify(k.checklist)
        },
        $.ajax({
            type: "POST",
            url: g,
            cache: !1,
            data: $.param(inputParams),
            dataType: "json"
        }).done(function(e) {
            var a, s;
            "success" == e.status ? ($("#editbox").prepend('<span class="mes"><i class="ok"></i>saved!</span>'),
            $("#checkGroup")[0] && (a = (s = $('#configform [name="_q"]').val().split(",").pop().split("_"))[0] + "_" + s[1],
            s = s[2],
            !k.checklist[a] || (s = k.checklist[a][s - 1]) != C() && ($("#checkGroup span").removeClass("checked"),
            0 < (1 & s) && $("#checkGroup .checkG").trigger("click"),
            0 < (2 & s) && $("#checkGroup .checkY").trigger("click"),
            0 < (4 & s) && $("#checkGroup .checkP").trigger("click")))) : "error" == e.status && $("#editbox").prepend('<span class="mes"><i class="ng"></i>save failed</span>')
        }).fail(function(e, a) {
            $("#editbox").prepend('<span class="mes"><i class="ng></i>save failed</span>')
        }).always(function() {
            $("#editbox .mes").delay(3e3).fadeOut(500, function() {
                $(this).remove()
            })
        })),
        delete k.checklist2,
        $("#checklist").trigger("click")
    }),
    $("#overLayer").on("click", '[id^="tab"] a', function() {
        if ($(".coverageTableWrap").hasClass("edit")) {
            var e = $(this).parent().parent()
              , a = $("th", e).attr("title")
              , s = $("a", e).index(this)
              , t = $(".tabs .checked").attr("data-flag")
              , i = 0
              , r = "";
            return $(this).hasClass("checked") ? ($(this).removeClass("checked"),
            r = k.checklist2[a],
            i = Number(r[s]) - Number(t),
            !isNaN(i) && 0 <= i && i <= 7 || (i = 0),
            k.checklist2[a] = r.slice(0, s) + i + r.slice(s + 1),
            -1 != k.checklist2[a].search(/^0+$/) && delete k.checklist2[a]) : ($(this).addClass("checked"),
            k.checklist2[a] || (e = new Array(A(a) + 1),
            k.checklist2[a] = e.join("0")),
            r = k.checklist2[a],
            i = Number(r[s]) + Number(t),
            !isNaN(i) && 0 <= i && i <= 7 || (i = 0),
            k.checklist2[a] = r.slice(0, s) + i + r.slice(s + 1)),
            !1
        }
    }),
    $("#checklist").click(function() {
        return $("#userBtn").hasClass("login") && h.test(p) ? $.isEmptyObject(k.checklist) ? (inputParams = {
            action: "loadChecklist"
        },
        b(m + "サーバからデータを取得しています。"),
        $.ajax({
            type: "POST",
            url: g,
            cache: !1,
            data: $.param(inputParams),
            dataType: "json"
        }).done(function(e) {
            b(""),
            "success" == e.status ? k.checklist = e.log : "error" == e.status && (k.checklist = []),
            D()
        }).fail(function(e, a) {
            b('<i class="ng"></i>[' + a + "]サーバとの通信に失敗しました。")
        }),
        !1) : void D() : (b('<i class="caution"></i>不正なリクエストです。'),
        !1)
    }),
    $("#review").click(function() {
        return F() ? b('<i class="caution"></i>復習モードで出題中です。「出題設定」より終了できます。') : $("#userBtn").hasClass("login") && h.test(p) ? v().done(function() {
            !function() {
                for (var e = {}, a = Z.total._q.split(","), s = Z.total._r.split(","), t = a.length - 1; 0 <= t; t--)
                    a[t] && void 0 === e[a[t]] && 0 != s[t] && (e[a[t]] = s[t]);
                var i = [];
                $.each(e, function(e, a) {
                    2 == a && i.push(e)
                });
                var r = i.length;
                if (0 === r)
                    return b('<i class="caution"></i>復習対象の問題が存在しません。'),
                    0;
                i.sort(function() {
                    return Math.random() - .5
                }),
                $("#review").data("val", i.join(",")),
                K('<h2>間違えた問題を復習する</h2><div class="confirmTableWrap"><div class="img_margin">直前の1回が不正解だった問題(網羅度レポートで<i class="rank1"></i><i class="rank0"></i>)だけを出題します。よろしいですか?<br>※復習モードでは出題範囲の指定はできません。</div>' + W("confirm", {
                    "対象問題数": r + "問"
                }) + '<fieldset class="refine review"><legend>出題回で絞り込み</legend>' + $("#tab1").html() + '</fieldset><div class="img_margin"><button id="review_cancel">戻る</button><button id="review_ok" autofocus><b>復習開始</b></button></div><div>');
                var n = localStorage.getItem("REVIEW");
                n && (n = n.split(","),
                $('.refine [name="times[]"]', "#overLayer").each(function() {
                    var e = -1 !== $.inArray($(this).val(), n);
                    $(this).prop("checked", e)
                }),
                $('.refine [name="times[]"]', "#overLayer").eq(0).change())
            }()
        }) : b('<i class="caution"></i>不正なリクエストです。'),
        !1
    }),
    $("#unanswer").click(function() {
        return S() ? b('<i class="caution"></i>未解答優先モード中。「出題設定」より終了できます。') : $("#userBtn").hasClass("login") && h.test(p) ? v().done(function() {
            !function() {
                for (var e = {}, a = Z.total._q.split(","), s = Z.total._r.split(","), t = a.length - 1; 0 <= t; t--)
                    a[t] && void 0 === e[a[t]] && 0 != s[t] && (e[a[t]] = s[t]);
                var i, r = {}, n = 0, l = 0, o = N();
                for (i in o) {
                    var c = o[i]
                      , d = A(c);
                    l += d;
                    var u = ""
                      , m = "";
                    for (t = 1; t <= d; t++)
                        e[c + "_" + t] ? m += String(0) : (m += String(1),
                        n++),
                        t % 8 == 0 && (u += ("0" + parseInt(m, 2).toString(16)).slice(-2),
                        m = "");
                    m && (m = (m + "0000000").slice(0, 8),
                    u += ("0" + parseInt(m, 2).toString(16)).slice(-2)),
                    r[c] = u
                }
                if (0 === n)
                    return b('<i class="caution"></i>未解答の問題が存在しません。'),
                    0;
                $("#unanswer").data("val", JSON.stringify(r)),
                K('<h2>未解答問題だけを出題する</h2><div class="confirmTableWrap"><div class="img_margin">解答歴がない問題だけを出題します。よろしいですか?<br>※このモードでは出題範囲の指定はできません。</div>' + W("confirm", {
                    "総問題数": l + "問",
                    "未解答の問題数": n + "問"
                }) + '<fieldset class="refine unanswer"><legend>出題回で絞り込み</legend>' + $("#tab1").html() + '</fieldset><div class="img_margin"><button id="unanswer_cancel">戻る</button><button id="unanswer_ok" autofocus><b>出題開始</b></button></div><div>');
                var h = localStorage.getItem("UNANSWER");
                h && (h = h.split(","),
                $('.refine [name="times[]"]', "#overLayer").each(function() {
                    var e = -1 !== $.inArray($(this).val(), h);
                    $(this).prop("checked", e)
                }),
                $('.refine [name="times[]"]', "#overLayer").eq(0).change())
            }()
        }) : b('<i class="caution"></i>不正なリクエストです。'),
        !1
    }),
    $("#overLayer").on("change", '.refine [name="times[]"]', function() {
        var e = 0
          , a = 0
          , s = $(this).parents(".refine")
          , t = $('[name="times[]"]:checked', s).map(function() {
            return $(this).val()
        }).get();
        if (s.hasClass("review")) {
            var i = t[0] ? new RegExp("^(" + t.join("|") + ")") : "/^-$/"
              , r = $("#review").data("val").split(",")
              , e = $.grep(r, function(e) {
                return e.match(i)
            }).length;
            $(".confirmTable td").eq(0).html(e + "問"),
            localStorage.setItem("REVIEW", t.join(","))
        } else if (s.hasClass("unanswer")) {
            var n, l = $.parseJSON($("#unanswer").data("val"));
            for (n in t) {
                a += A(t[n]);
                for (var o = l[t[n]].split(""), c = 0, d = o.length; c < d; c++)
                    switch (o[c]) {
                    case "f":
                        e += 4;
                        break;
                    case "7":
                    case "b":
                    case "d":
                    case "e":
                        e += 3;
                        break;
                    case "3":
                    case "5":
                    case "9":
                    case "6":
                    case "a":
                    case "c":
                        e += 2;
                        break;
                    case "1":
                    case "2":
                    case "4":
                    case "8":
                        e += 1
                    }
            }
            $(".confirmTable td").eq(0).html(a + "問"),
            $(".confirmTable td").eq(1).html(e + "問"),
            localStorage.setItem("UNANSWER", t.join(","))
        }
    }),
    $("#overLayer").on("click", '.refine [name="check_all"]', function() {
        var e = "ON" == $(this).html()
          , a = $(this).parents(".refine");
        $('[name="times[]"]', a).prop("checked", e).eq(0).change()
    }),
    $("#overLayer").on("click", "#review_ok, #unanswer_ok", function() {
        $('#configform [name="review"], #configform [name="unanswer"]').remove();
        var e = $(this).attr("id").split("_")[0];
        if ($("#overLayer .confirmTable").is(":visible")) {
            if ($(".refine .error", "#overLayer").html(""),
            0 === $('.refine [name="times[]"]:checked', "#overLayer").length || "0問" == $(".confirmTable td").last().html())
                return void $(".refine .error", "#overLayer").html("※出題数が1問以上になるように選択してください。");
            if ("review" == e) {
                var a = $('.refine [name="times[]"]:checked', "#overLayer").map(function() {
                    return $(this).val()
                }).get()
                  , s = a[0] ? new RegExp("^(" + a.join("|") + ")") : "/^-$/"
                  , a = $("#review").data("val").split(",")
                  , a = $.grep(a, function(e) {
                    return e.match(s)
                });
                $("#" + e).data("val", a.join(","))
            } else if ("unanswer" == e) {
                var t, i = $('.refine [name="times[]"]:not(:checked)', "#overLayer").map(function() {
                    return $(this).val()
                }).get(), r = $.parseJSON($("#" + e).data("val"));
                for (t in i)
                    delete r[i[t]];
                $("#" + e).data("val", JSON.stringify(r))
            }
        }
        $("#configform").append($("<input/>", {
            type: "hidden",
            name: e,
            value: $("#" + e).data("val")
        }));
        e = $('#configform [name="qno"]').val();
        e <= 1 ? $('#configform [name="_q"], #configform [name="_c"]').val("") : se() || $('#configform [name="_q"], #configform [name="_c"]').val(function(e, a) {
            return a.replace(/,[^,]+?$/, "")
        }),
        $("#result").val(-1),
        0 == e || se() || $('#configform [name="qno"]').val(e - 1),
        P() && $('#configform [name="mode"]').val(["1"]),
        $("#configform").submit()
    }),
    $("#overLayer").on("click", "#review_cancel, #unanswer_cancel", function() {
        var e = $(this).attr("id").split("_")[0];
        return $("#" + e).removeData("val"),
        u(),
        !1
    }),
    $("#configform").on("click", "#review_end", function() {
        return P() && ($("#tabs ul li.active").remove(),
        $("#tabs ul li:first-child").addClass("active"),
        $("#tab1, #options").show()),
        $("#reviewWrap").hide(),
        $("#tabs").fadeIn("normal", function() {
            $('#configform [name="review"], #configform [name="unanswer"], #reviewWrap').remove()
        }),
        !1
    }),
    $("#overLayer").on("keypress", "#slider", function(e) {
        if (13 === e.which || 13 === e.keyCode)
            return !1
    });
    var L = 560
      , I = 150;
    function T(e) {
        var s = new $.Deferred
          , e = {
            action: "cancel_membership",
            password: e
        };
        return $.ajax({
            type: "POST",
            url: a,
            cache: !1,
            data: $.param(e),
            dataType: "json"
        }).done(function(e) {
            if ("success" == e.status)
                s.resolve();
            else if ("error" == e.status) {
                var a = $("#accountForm");
                switch (e.errorcode) {
                case 1:
                    $(".message", a).html('<i class="caution"></i>対象のユーザーIDが見つかりませんでした。');
                    break;
                case 2:
                    $(".message", a).html('<i class="caution"></i>パスワードが正しくありません。入力値の再確認をお願いいたします。'),
                    $('[name="password"]', a).siblings(".error").html("正しいパスワードをご入力ください。").addClass("show");
                    break;
                case 3:
                    $(".message", a).html('<i class="caution"></i>解約対象となる決済情報が見つかりませんでした。');
                    break;
                case 4:
                    $(".message", a).html('<i class="caution"></i>既にメンバーシップ登録は解除されています。');
                    break;
                case 5:
                    $(".message", a).html('<i class="caution"></i>解約対象となる決済情報が取得できませんでした。');
                    break;
                case 6:
                    $(".message", a).html('<i class="caution"></i>データベース処理のエラーによりキャンセルできません。');
                    break;
                case 7:
                    $(".message", a).html('<i class="caution"></i>キャンセル手続き中にエラーが発生しました。');
                    break;
                case 11:
                    $(".message", a).html('<i class="caution"></i>時間経過によりログイン状態が切れています。再ログインしてお試しください。');
                    break;
                case 12:
                    $(".message", a).html('<i class="ng"></i>不正なリクエストです（errorcode:12）');
                    break;
                case 13:
                    $(".message", a).html('<i class="ng"></i>不正なリクエストです（errorcode:13）')
                }
                s.reject()
            }
        }).fail(function(e, a) {
            b('<i class="ng"></i>[' + a + "]サーバとの通信に失敗しました。"),
            s.reject()
        }),
        s.promise()
    }
    function F() {
        return $('#configform [name="review"]')[0]
    }
    function S() {
        return $('#configform [name="unanswer"]')[0]
    }
    function se() {
        return $("#errorPage")[0]
    }
    function P() {
        return 3 == t
    }
    function te(val) {
    if (val === null || val === undefined || !$.isNumeric(val)) return "－";

    const e = Number(val);

    if (e >= 95) return "A<sup>+</sup>";
    if (e >= 87) return "A";
    if (e >= 80) return "A<sup>-</sup>";

    if (e >= 75) return "B<sup>+</sup>";
    if (e >= 67) return "B";
    if (e >= 60) return "B<sup>-</sup>";

    if (e >= 55) return "C<sup>+</sup>";
    if (e >= 47) return "C";
    if (e >= 40) return "C<sup>-</sup>";

    if (e >= 35) return "D<sup>+</sup>";
    if (e >= 27) return "D";
    if (e >= 20) return "D<sup>-</sup>";

    // ここが元コードで「7<=e」が常に真になって "E" が出ない問題があったので修正
    if (e >= 15) return "E<sup>+</sup>";
    if (e >= 7)  return "E";
    return "E<sup>-</sup>";
}
    function N() {
        for (var e = [], a = stYear; a <= edYear; a++)
            2020 == a ? "fe" == testID ? e.push("02_menjo") : "nw" != testID && "sg" != testID && e.push("02_aki") : 2020 < a ? (y = ("0" + (a - 2018)).slice(-2),
            "fe" != testID ? ("db" != testID && "pm" != testID && e.push(y + "_haru"),
            !aki && a == edYear || "nw" == testID || "ip" == testID || e.push(y + "_aki")) : e.push(y + "_menjo")) : (y = a - 1988,
            "nw" != testID && (2011 != a ? e.push(y + "_haru") : e.push(y + "_toku")),
            2019 == a && (y = "01"),
            "db" != testID && "pm" != testID && e.push(y + "_aki"));
        if (1 == $('#configform [name="addition"]').val())
            for (a in addTimes)
                e.push(a);
        return e
    }
    function W(e, a) {
        var s, t = '<table class="' + e + 'Table">';
        for (s in a)
            t += "dummy" == s ? "<tr><td><td>" + a[s] : "<tr><th>" + s + "<td>" + a[s];
        return t += "</table>"
    }
    function ie(e) {
        if (-1 !== e.search(/(yosou|moshi|sample)/i))
            return addTimes[e];
        e = e.split("_");
        var a = Number(e[0])
          , s = a <= 12 ? "令和" : "平成"
          , t = s + (1 == a ? "元" : a) + "年"
          , e = {
            haru: "春期",
            aki: "秋期",
            toku: "特別",
            menjo: "免除",
            ad: "春期"
        }[e[1]];
        return "令和" == s && (("fe" == testID || "sg" == testID) && 2 <= a || "ip" == testID && 3 <= a) && (e = "度"),
        t + e
    }
    function A(code) {
    if (testID === "ip") {
        const parts = String(code).split("_"); // 例: ["01","sample"]
        const y = Number(parts[0]);            // 年(令和の数字等)
        const kind = parts[1];                 // "haru","aki","sample","yosou" 等

        // 文字列そのものを比較（split後の配列と文字列比較バグを解消）
        if (code === "01_sample") return 71;
        if (code === "02_sample") return 22;

        if (kind === "yosou" || code === "21_ad" || code === "20_aki") return 80;

        // 元コードの条件を忠実に数値化して復元
        if (y >= 28 || y <= 20) return 100;
        if (y >= 24) return 84;
        return 88;
    }

    if (testID === "fe") {
        const parts = String(code).split("_");
        const y = Number(parts[0]);
        const kind = parts[1];

        // sample または menjo(かつ年>=5) は 60、それ以外は 80
        if (kind === "sample") return 60;
        if (kind === "menjo" && y >= 5) return 60;
        return 80;
    }

    if (testID === "ap") return 80;
    if (testID === "sg") return 50;
    if (V) return 25;
    return void 0;
}
    function O(e) {
        return ["五級", "四級", "三級", "二級", "一級", "初段", "二段", "三段", "四段", "五段", "六段", "七段", "八段", "九段", "十段", "名人"][e]
    }
    $("#account").click(function(e, a) {
        if (!$("#userBtn").hasClass("login") || !h.test(p))
            return b('<i class="caution"></i>不正なリクエストです。'),
            !1;
        var s = ""
          , t = ""
          , i = ""
          , r = ""
          , n = ""
          , l = ""
          , o = ""
          , c = [" disabled", " disabled", " disabled"]
          , o = memberBtnStrs = m;
        void 0 !== k.email && (o = k.email ? (s = k.email,
        "変更") : (s = "未登録　※パスワードリセットに必要",
        "登録")),
        void 0 !== k.rankDetail && (0 < k.rankDetail.qCount ? (t = k.rankDetail.qCount + "問",
        i = O(k.rankDetail.rank),
        c[0] = "") : (t = "0問",
        i = "なし")),
        void 0 !== k.backupStatus && (r = Object.keys(k.backupStatus).length + "日分",
        c[1] = "");
        var d = ["未登録", "メンバー登録済", "招待メンバー"]
          , u = ["メンバーになる", "メンバーシップ管理", "メンバーシップ管理"];
        void 0 !== k.plan && (n = d[k.plan],
        l = u[k.plan],
        0 === k.plan ? c[2] = ' class="register"' : 1 === k.plan && (c[2] = "")),
        K('<h2>アカウント管理</h2><div id="sliderWrap"><div id="slider"><div>' + W("edit", {
            "ユーザーID": p,
            "メンバーシップ": '<span class="currentMemberStatus">' + n + '</span><button id="changeMembership"' + c[2] + ">" + l + "</button>",
            "パスワード": '非表示<button id="editPassword">パスワード変更</button>',
            "メールアドレス": '<span class="currentEmail">' + s + '</span><button id="editEmail">' + o + "</button>",
            "総学習問題数": '<span class="currentQCount">' + t + '</span><button id="initData"' + c[0] + ">学習履歴の初期化</button>",
            "段位": '<span class="currentRank">' + i + '</span><button id="showRankDetail"' + c[0] + ">詳細</button>",
            "バックアップ": '<span class="currentBackupStatus">' + r + '</span><button id="showBackupStatus"' + c[1] + ">取得状況</button>",
            dummy: '<button id="deleteAccount">アカウントの削除</button>'
        }) + "</div><div></div><div></div></div></div>", L),
        $("#slider").removeAttr("style").css("width", 3 * L).fadeIn("fast"),
        $("#sliderWrap, #slider>div").css("width", L),
        a && $("#slider").css("left", 0).fadeIn("fast");
        r = !1;
        return void 0 !== k.backupStatus && (c = new Date(k.backupStatusDate).getDate(),
        (new Date).getDate() != c && (r = !0,
        $("#showBackupStatus").prop("disabled", !0))),
        void 0 !== k.email && void 0 !== k.backupStatus && void 0 !== k.plan && !r || $.ajax({
            type: "POST",
            url: g,
            cache: !1,
            data: $.param({
                action: "getAccountInfo"
            }),
            dataType: "json"
        }).done(function(e) {
            if ("success" == e.status) {
                k.email = e.email,
                k.backupStatus = e.backupStatus,
                k.backupStatusDate = Date.now(),
                k.plan = +e.plan;
                var a = $("#slider>div").eq(0)
                  , s = "未登録　※パスワードリセットに必要"
                  , t = "登録";
                k.email && (s = e.email,
                t = "変更"),
                $(".currentEmail", a).html(s),
                $('[name="email_now"]', $("#slider>div").eq(1)).val(s),
                $("#editEmail").html(t),
                void 0 !== k.backupStatus && ($(".currentBackupStatus", a).html(Object.keys(k.backupStatus).length + "日分"),
                $("#showBackupStatus").prop("disabled", !1)),
                void 0 !== k.plan && ($(".currentMemberStatus", a).html(d[k.plan]),
                $("#changeMembership").html(u[k.plan]).prop("disabled", !1),
                0 === k.plan && $("#changeMembership").addClass("register"),
                2 === k.plan && $("#changeMembership").prop("disabled", !0))
            } else if ("error" == e.status)
                switch (e.errorcode) {
                case 1:
                    b('<i class="caution"></i>ユーザーIDまたはセッションIDが不正な値です。');
                    break;
                case 2:
                    b('<i class="caution"></i>データベース接続に失敗しました。')
                }
        }).fail(function(e, a) {
            b('<i class="ng"></i>[' + a + "]サーバとの通信に失敗しました。")
        }),
        void 0 === k.rankDetail && (3 == a ? ($(".currentQCount", $("#slider>div").eq(0)).html("0問"),
        $(".currentRank", $("#slider>div").eq(0)).html("なし"),
        k.rankDetail = !1) : v(!0).done(function() {
            !function() {
                if (!window.Worker) {
                    for (var e, a, s = {}, t = N(), i = 0, r = t.length; i < r; i++)
                        s[t[i]] = [];
                    var n, l = Z.total._q.split(","), o = Z.total._r.split(","), c = Z.total._q.split(",").length, d = [0, 0, 0];
                    for (i = 0,
                    r = l.length; i < r; i++)
                        d[o[i]]++,
                        l[i] && (a = l[i].split("_"),
                        e = a[0] + "_" + a[1],
                        n = a[2],
                        s[e] && (s[e][n] = void 0 === s[e][n] ? o[i] : s[e][n] + String(o[i])));
                    var u = 0
                      , m = 0
                      , h = [0, 0, 0, 0];
                    for (i = 0,
                    r = t.length; i < r; i++) {
                        e = t[i],
                        a = e.split("_");
                        var p = A(t[i]);
                        u += p;
                        for (var v = 1; v <= p; v++)
                            s[e][v] && 0 != s[e][v] && (val = ("0" + s[e][v].replace(/0/g, "")).slice(-2),
                            "11" == val ? h[3]++ : "01" == val || "21" == val ? h[2]++ : "02" == val || "12" == val ? h[1]++ : "22" == val && h[0]++,
                            m++)
                    }
                    k.rankDetail = {
                        qCount: c,
                        seigoArr: d,
                        totalCount: u,
                        answerCount: m,
                        rankArr: h
                    },
                    k.rankDetail.rank = getDan(k.rankDetail),
                    $(".currentQCount", $("#slider>div").eq(0)).html(k.rankDetail.qCount + "問"),
                    $(".currentRank", $("#slider>div").eq(0)).html(O(k.rankDetail.rank)),
                    $("#initData, #showRankDetail").prop("disabled", !1),
                    inputParams = {
                        action: "setRank",
                        rank: k.rankDetail.rank
                    },
                    $.ajax({
                        type: "POST",
                        url: g,
                        cache: !1,
                        data: $.param(inputParams),
                        dataType: "json"
                    }).done(function(e) {
                        "success" == e.status && e.rank && (k.rankDetail.rank = e.rank,
                        $(".currentRank", $("#slider>div").eq(0)).html(O(e.rank)))
                    })
                }
            }()
        }).fail(function() {
            $(".currentQCount", $("#slider>div").eq(0)).html("0問"),
            $(".currentRank", $("#slider>div").eq(0)).html("なし"),
            k.rankDetail = !1
        })),
        !1
    }),
    $("#overLayer").on("click", "#editPassword, #editEmail, #initData, #deleteAccount", function() {
        function e(e, a, s, t) {
            return '<div class="inputWrap"><i class="' + (e = e || "password") + '"></i><input type="password" name="password' + (a = a || "") + '" maxlength="32" autocomplete="' + (s = s || "current") + '-password" placeholder="' + (t = t || "現在のパスワード") + '"><div class="error"></div><i class="eye togglePassword"></i></div>'
        }
        var a = $(this).attr("id")
          , s = {};
        switch (a) {
        case "editPassword":
            s = {
                "現在のパスワード": e(),
                "新しいパスワード": e("password validate", "_new", "new", "半角英数字・記号で8～32文字") + '<div style="font-size:12px;white-space:nowrap">記号の種類 (`~!@#$%^&amp;*_+-={}[]|:;&quot;&apos;&lt;&gt;.,?/)</div>',
                "新しいパスワード<br>（確認）": '<input type="text" hidden name="userid" autocomplete="username" value="' + p + '">' + e("confirm validate", "_confirm", "new", "もう一度入力して確認")
            },
            t = "パスワード変更",
            i = "",
            r = "変更する";
            break;
        case "editEmail":
            var s = {
                "現在のメールアドレス": '<div class="inputWrap"><i class="email"></i><input type="text" name="email_now" readonly value="' + (-1 === $(".currentEmail", $(this).parent()).html().indexOf("<") ? $(".currentEmail", $(this).parent()).html() : "") + '"></div>',
                "新しいメールアドレス": '<div class="inputWrap"><i class="email"></i><input type="email" name="email" maxlength="96" placeholder="メールアドレスを選択"><div class="error"></div></div>'
            }
              , t = "メールアドレス登録／変更"
              , i = "本メールアドレスは、パスワードリセットやアカウント情報変更などの重要なお知らせの連絡先となりますので、普段ご利用のメールアドレスをご登録ください。"
              , r = "認証メール送信";
            break;
        case "initData":
            s = {
                "パスワード": e(),
                dummy: '<label><input type="checkbox" name="leaveCheck">チェック状態を残す</label>'
            },
            t = "学習履歴の初期化",
            i = '<i class="caution"></i><em class="r">ご注意ください。</em><br>この操作を行うと学習履歴と問題に付けたチェックがリセットされます。',
            r = "初期化する";
            break;
        case "deleteAccount":
            s = {
                "パスワード": e()
            },
            t = "アカウントの削除",
            i = '<i class="caution"></i><em class="r">ご注意ください。</em><br>この操作を行うとアカウントに関連する全てのデータが削除されます。メンバーシップに登録している方は自動的に解約となります。',
            r = "削除する"
        }
        return i = i && '<div class="message">' + i + "</div>",
        a = '<form id="accountForm" class="validationForm">' + W("edit", s) + i + '</form><div class="img_margin"><button id="account_cancel">戻る</button><button id="' + a + '_ok"><b>' + r + "</b></button></div>",
        $("#overLayer h2").html($("#overLayer h2").html() + " &raquo " + t),
        $("#slider>div").eq(1).html(a),
        $("#slider").animate({
            left: "-=" + L
        }, I),
        !1
    }),
    $("#overLayer").on("click", "#showBackupStatus", function() {
        for (var e, a, s = k.backupStatus, t = "", i = "", r = "", n = "", l = new Date, o = 0; o <= 9; o++)
            a = (a = new Date(l.getTime() - 864e5 * o)).getMonth() + 1 + "月" + a.getDate() + "日",
            a = s[o] ? (e = '<th><label><input type="radio" name="day" value="' + o + '">' + a + "</label>",
            "<td>" + s[o]) : (e = "<th>" + a,
            "<td>×"),
            o < 5 ? (t += e,
            r += a) : (i += e,
            n += a);
        $("#overLayer h2").html($("#overLayer h2").html() + " &raquo; バックアップ");
        var c = '<form id="accountForm"><table class="editTable backup" style="border-collapse:collapse"><tr>' + t + "<tr>" + r + '<tr style="height:20px"><tr>' + i + "<tr>" + n + '</table><div class="message">学習日ごとに作成されているバックアップから、学習履歴とチェック状態を指定日付の状態に復元できます。<br>※続きから再開するためのデータは復元の対象外です。<br>※現在の学習履歴は上書きされます。</div><div class="img_margin"><button id="account_cancel">戻る</button><button id="backup_ok"><b>復元する</b></button></div></form>';
        return $("#slider>div").eq(1).html(c),
        $("#slider").animate({
            left: "-=" + L
        }, I),
        !1
    }),
    $("#overLayer").on("click", "#changeMembership", function() {
        if ($(this).is(".register"))
            return !(location.href = a);
        var e = $(this);
        e.prop("disabled", !0).addClass("disabled"),
        d = !0;
        return $.ajax({
            type: "POST",
            url: g,
            cache: !1,
            data: $.param({
                action: "getMembershipInfo"
            }),
            dataType: "json"
        }).done(function(e) {
            if ("success" == e.status) {
                var a = e.plan < 1500 ? "月" : "年";
                e.plan = a + "額プラン（" + Number(e.plan).toLocaleString() + "円／" + a + "）",
                e.start_date = e.start_date.replace("-", "年").replace("-", "月") + "日",
                e.billing_date = e.billing_date.replace("-", "年").replace("-", "月") + "日",
                e.duration = e.duration.replace("-", "カ月と") + "日";
                a = '<table class="editTable"><tr><th>利用プラン</th><td>' + e.plan + "</td><tr><th>最終登録日</th><td>" + e.start_date + "</td><tr><th>次回請求日</th><td>" + e.billing_date + "</td><tr><th>利用期間</th><td>" + e.duration + '</td><tr><td colspan="2"><div class="img_margin" style="color:var(--color-666);font-size:90%">クレジットカードの変更、請求履歴の確認、請求書・領収書のダウンロード<br><form method="POST" action="/membership/customer_portal.php" target="_blank"><button type="submit" style="position:static;color:var(--main-bg);background:var(--body-color);margin-top:0.5em">サブスクリプションの管理</button></form></div></td></table><form id="accountForm" class="validationForm" style="display:none"><table class="editTable"><tr><th>パスワード</th><td><div class="inputWrap"><i class="password"></i><input type="password" name="password" maxlength="32" autocomplete="current-password" placeholder="現在のパスワード"><div class="error"></div><i class="eye togglePassword"></i></div></td></table><div class="message"><i class="caution"></i><b>メンバーシップを解約して特典の利用を終了します。</b><br>解約をもって広告非表示その他のメンバーシップサービス特典の利用はできなくなります。解約時に請求対象期間が残っていても、その部分についての払い戻しはいたしませんのでご注意ください。</div></form><div class="img_margin"><button id="account_cancel">戻る</button><button id="changeMembership_ok" style="display:none">解約する</button><button id="show_cancel_membership" style="font-size:unset">メンバーシップを解約する</button></div>';
                $("#overLayer h2").html($("#overLayer h2").html() + " &raquo; メンバーシップ管理"),
                $("#slider>div").eq(1).html(a),
                $("#slider").animate({
                    left: "-=" + L
                }, I)
            } else if ("error" == e.status)
                switch (e.errorcode) {
                case 1:
                    b('<i class="caution"></i>既にメンバーシップ登録は解約されているようです。');
                    break;
                case 2:
                    b('<i class="caution"></i>メンバーシップ情報の取得中にエラーが発生しました。');
                    break;
                case 3:
                    b('<i class="caution"></i>時間経過によりログイン状態が切れています。再ログインしてお試しください。')
                }
        }).fail(function(e, a) {
            b('<i class="ng"></i>[' + a + "]サーバとの通信に失敗しました。")
        }).always(function() {
            d = !1,
            e.prop("disabled", !1).removeClass("disabled")
        }),
        !1
    }),
    $("#overLayer").on("click", "#show_cancel_membership", function() {
        $(this).hide(),
        $("#accountForm").prevAll().hide(),
        $("#changeMembership_ok").show(),
        $("#accountForm").fadeIn()
    }),
    $("#overLayer").on("click", "#editPassword_ok", function() {
        if (!$("#userBtn").hasClass("login") || !h.test(p))
            return !1;
        var e = !1
          , a = $(this)
          , s = $("#accountForm");
        $(".error", s).removeClass("show");
        var t, i = {
            password_new: $('[name="password_new"]', s).val(),
            password_confirm: $('[name="password_confirm"]', s).val()
        };
        for (t in i)
            r.test(i[t]) || ($('[name="' + t + '"]', s).siblings(".error").html("入力値が要件を満たす形式になっていません").addClass("show"),
            e = !0);
        for (t in i.password = $('[name="password"]', s).val(),
        i)
            i[t] || ($('[name="' + t + '"]', s).siblings(".error").html("この項目の入力は必須です").addClass("show"),
            e = !0);
        return i.password == i.password_new && ($('[name="password_new"]', s).siblings(".error").html("現在のパスワードと異なる文字列をご指定ください").addClass("show"),
        e = !0),
        i.password_new != i.password_confirm && ($('[name="password_confirm"]', s).siblings(".error").html("新しいパスワード欄と同じものをご入力ください").addClass("show"),
        e = !0),
        e || (i.action = "changePassword",
        $(".message", s).html(n),
        a.prop("disabled", !0).addClass("disabled"),
        d = !0,
        $.ajax({
            type: "POST",
            url: g,
            cache: !1,
            data: $.param(i),
            dataType: "json"
        }).done(function(e) {
            if ("success" == e.status)
                $("#overLayer h2").html($("#overLayer h2").html() + " &raquo; 完了"),
                $("#slider>div").eq(2).html('<div class="img_margin"><i class="ok exlarge"></i><div class="message-headline"><u>パスワードの変更が完了しました</u></div><div class="message-detail">パスワードは重要な操作を行うときに必要となります。<br>忘れることのないようどこかに控えておいてください。</div><button id="edit_ok" data-flag="1">戻る</button></div>'),
                $("#slider").animate({
                    left: "-=" + L
                }, I, function() {
                    $("i.ok.exlarge").addClass("show"),
                    $("#slider>div").eq(1).html("")
                });
            else if ("error" == e.status)
                switch (e.errorcode) {
                case 1:
                    $(".message", s).html('<i class="caution"></i>入力値が要件を満たす形式になっていません。');
                    break;
                case 2:
                    $(".message", s).html('<i class="caution"></i>セキュリティ上の理由でユーザーIDを含むパスワードは設定できません'),
                    $('[name="password_new"]', s).siblings(".error").html("ユーザーIDを含まない文字列をご指定ください").addClass("show");
                    break;
                case 3:
                    $(".message", s).html('<i class="caution"></i>新しいパスワードには現在のパスワードとは異なる文字列をご指定ください'),
                    $('[name="password_new"]', s).siblings(".error").html("現在のパスワードと異なる文字列をご指定ください").addClass("show");
                    break;
                case 4:
                    $(".message", s).html('<i class="caution"></i>再入力欄のパスワードが新しいパスワード欄の文字列と一致しません'),
                    $('[name="password_confirm"]', s).siblings(".error").html("新しいパスワード欄と同じものをご入力ください").addClass("show");
                    break;
                case 5:
                    $(".message", s).html('<i class="caution"></i>現在のパスワードが正しくありません。再確認いただくようお願いいたします'),
                    $('[name="password"]', s).siblings(".error").html("正しいパスワードをご入力ください").addClass("show");
                    break;
                case 6:
                    $(".message", s).html('<i class="caution"></i>ユーザーIDまたはセッションIDが不正な値です');
                    break;
                case 7:
                    $(".message", s).html('<i class="ng"></i>データベース接続に失敗しました。')
                }
        }).fail(function(e, a) {
            $(".message", s).html('<i class="ng"></i>[' + a + "]サーバとの通信に失敗しました。")
        }).always(function() {
            d = !1,
            a.prop("disabled", !1).removeClass("disabled")
        })),
        !1
    }),
    $("#overLayer").on("click", "#editEmail_ok", function() {
        if (!$("#userBtn").hasClass("login") || !h.test(p))
            return !1;
        var e = !1
          , a = $(this)
          , s = $("#accountForm");
        $(".error", s).removeClass("show");
        var t = $('[name="email"]', s)
          , i = t.val();
        if (i == $(".currentEmail", s).html() && (t.siblings(".error").html("現在のアドレスと異なるものをご指定ください").addClass("show"),
        e = !0),
        /^([a-zA-Z0-9])+([\w.\-])*@([\w\-])+([\w.\-]+)+$/.test(i) || (t.siblings(".error").html("適切な形式の文字列をご指定ください").addClass("show"),
        e = !0),
        i || (t.siblings(".error").html("この項目の入力は必須です").addClass("show"),
        e = !0),
        e)
            return !1;
        var r = {
            email: i,
            action: "changeEmail"
        };
        return $(".message", s).html(n),
        a.prop("disabled", !0).addClass("disabled"),
        d = !0,
        $.ajax({
            type: "POST",
            url: g,
            cache: !1,
            data: $.param(r),
            dataType: "json"
        }).done(function(e) {
            if ("success" == e.status) {
                delete k.email;
                var a = '<div class="img_margin"><img src="/img/ext/mail.png" style="max-height:170px;"><div class="message-headline"><u>"' + r.email + '"に<br>本人確認用のメールを送信しました</u></div><div class="message-detail">メール本文中の認証用URLにアクセスして登録を完了させてください。</div><button id="edit_ok" data-flag="2">戻る</button></div>';
                $("#overLayer h2").html($("#overLayer h2").html() + " &raquo; 仮登録完了"),
                $("#slider>div").eq(2).html(a),
                $("#slider").animate({
                    left: "-=" + L
                }, I, function() {
                    $("#slider>div").eq(1).html("")
                })
            } else if ("error" == e.status)
                switch (e.errorcode) {
                case 1:
                    $(".message", s).html('<i class="caution"></i>メールアドレスの形式が不適切です。長さや使用している文字が適切かをご確認ください。');
                    break;
                case 2:
                    $(".message", s).html('<i class="caution"></i>ユーザーIDまたはセッションIDが不正な値です。')
                }
        }).fail(function(e, a) {
            $(".message", s).html('<i class="ng"></i>[' + a + "]サーバとの通信に失敗しました。")
        }).always(function() {
            d = !1,
            a.prop("disabled", !1).removeClass("disabled")
        }),
        !1
    }),
    $("#overLayer").on("click", "#initData_ok", function() {
        if (!$("#userBtn").hasClass("login") || !h.test(p))
            return !1;
        var e = !1
          , a = $(this)
          , s = $("#accountForm");
        if ($(".error", s).removeClass("show"),
        $('[name="password"]', s).val() || ($('[name="password"]', s).siblings(".error").html("この項目の入力は必須です").addClass("show"),
        e = !0),
        e)
            return !1;
        e = {
            password: $('[name="password"]', s).val(),
            action: "initData"
        };
        return $('[name="leaveCheck"]', s).prop("checked") && (e.leaveCheck = !0),
        $(".message", s).html(n),
        a.prop("disabled", !0).addClass("disabled"),
        d = !0,
        $.ajax({
            type: "POST",
            url: g,
            cache: !1,
            data: $.param(e),
            dataType: "json"
        }).done(function(e) {
            if ("success" == e.status) {
                (F() || S()) && $("#tabs, #reviewWrap").toggle(0, function() {
                    $('#configform [name="review"], #configform [name="unanswer"], #reviewWrap').remove()
                }),
                Z = {},
                k = {};
                $("#overLayer h2").html($("#overLayer h2").html() + " &raquo; 完了"),
                $("#slider>div").eq(2).html('<div class="img_margin"><i class="ok exlarge"></i><div class="message-headline"><u>学習履歴の初期化が完了しました</u></div><div class="message-detail">また１問ずつ積み上げていきましょう。<br>これからもよろしくお願い申し上げます。</div><button id="edit_ok" data-flag="3">戻る</button></div>'),
                $("#slider").animate({
                    left: "-=" + L
                }, I, function() {
                    $("i.ok.exlarge").addClass("show"),
                    $("#slider>div").eq(1).html("")
                })
            } else if ("error" == e.status)
                switch (e.errorcode) {
                case 1:
                case 2:
                    $(".message", s).html('<i class="caution"></i>パスワードが正しくありません。再確認いただくようお願い致します。'),
                    $('[name="password"]', s).siblings(".error").html("正しいパスワードをご入力ください").addClass("show");
                    break;
                case 3:
                    $(".message", s).html('<i class="caution"></i><i class="ng"></i>学習履歴データが存在しません。');
                    break;
                case 4:
                    $(".message", s).html('<i class="caution"></i><i class="caution"></i>ユーザーIDまたはセッションIDが不正な値です。');
                    break;
                case 5:
                    $(".message", s).html('<i class="ng"></i>データベース接続に失敗しました。')
                }
        }).fail(function(e, a) {
            $(".message", s).html('<i class="ng"></i>[' + a + "]サーバとの通信に失敗しました。")
        }).always(function() {
            d = !1,
            a.prop("disabled", !1).removeClass("disabled")
        }),
        !1
    }),
    $("#overLayer").on("click", "#changeMembership_ok", function() {
        if (!$("#userBtn").is(".login.member") || !h.test(p))
            return !1;
        var e = !1
          , a = $(this)
          , s = $("#accountForm")
          , t = $(".message", s).html();
        return $(".error", s).removeClass("show"),
        $('[name="password"]', s).val() || ($('[name="password"]', s).siblings(".error").html("この項目の入力は必須です").addClass("show"),
        e = !0),
        e || ($(".message", s).html(n),
        a.prop("disabled", !0),
        d = !0,
        T($('[name="password"]', s).val()).done(function() {
            k.plan = 0,
            $("#userBtn").removeClass("member");
            $("#overLayer h2").html($("#overLayer h2").html() + " &raquo; 解約完了"),
            $("#slider>div").eq(2).html('<div class="img_margin"><img src="/img/ext/thankyou.png" style="max-height:160px;margin-bottom:1em"><div class="message-headline"><u>メンバーシップを解約しました</u></div><div class="message-detail">これまでのサポートに感謝申し上げます。<br>再びメンバーとしてサポートしていただけるのをお待ちしております。</div><button id="edit_ok" data-flag="4">戻る</button></div>'),
            $("#slider").animate({
                left: "-=" + L
            }, I, function() {
                $("#slider>div").eq(1).html("")
            })
        }).always(function() {
            d = !1,
            a.prop("disabled", !1),
            $(".message", s).html(t)
        })),
        !1
    }),
    $("#overLayer").on("click", "#deleteAccount_ok", function() {
        if (!$("#userBtn").hasClass("login") || !h.test(p))
            return !1;
        var e = !1
          , a = $(this)
          , s = $("#accountForm")
          , t = $(".message", s).html();
        return $(".error", s).removeClass("show"),
        $('[name="password"]', s).val() || ($('[name="password"]', s).siblings(".error").html("この項目の入力は必須です").addClass("show"),
        e = !0),
        e || confirm("アカウントに関連するすべてのデータが削除されます。\n本当によろしいですか？") && ($(".message", s).html(n),
        a.prop("disabled", !0).addClass("disabled"),
        d = !0,
        T($('[name="password"]', s).val()).done(function() {
            k.plan = 0,
            $("#userBtn").removeClass("member");
            var e = {
                password: $('[name="password"]', s).val(),
                action: "deleteAccount"
            };
            $.ajax({
                type: "POST",
                url: g,
                cache: !1,
                data: $.param(e),
                dataType: "json"
            }).done(function(e) {
                if ("success" == e.status) {
                    $("#formTitle").html("アカウントにログイン"),
                    $("#userPanel").removeClass("show"),
                    $("#userBtn").removeClass("login"),
                    $('#loginForm [name="userid"], #loginForm [name="password"]').val(""),
                    $("#userid").html(i),
                    (F() || S()) && $("#tabs, #reviewWrap").toggle(0, function() {
                        $('#configform [name="review"], #configform [name="unanswer"], #reviewWrap').remove()
                    }),
                    $("#checkGroup, button.continue").css("visibility", "hidden"),
                    $("#checkflag").val(-1),
                    p = "",
                    Z = {},
                    k = {};
                    $("#overLayer h2").html($("#overLayer h2").html() + " &raquo; 完了"),
                    $("#slider>div").eq(2).html('<div class="img_margin"><i class="ok exlarge"></i><div class="message-headline"><u>アカウントの削除が完了しました</u></div><div class="message-detail">これまで当サイトをご利用くださいまして、<br>誠にありがとうございました。</div></div>'),
                    d = !1,
                    $("#slider").animate({
                        left: "-=" + L
                    }, I, function() {
                        $("i.ok.exlarge").addClass("show"),
                        $("#slider>div").eq(1).html("")
                    })
                } else if ("error" == e.status)
                    switch (e.errorcode) {
                    case 1:
                    case 2:
                        $(".message", s).html('<i class="caution"></i>パスワードが正しくありません。再確認いただくようお願い致します。'),
                        $('[name="password"]', s).siblings(".error").html("正しいパスワードをご入力ください").addClass("show");
                        break;
                    case 3:
                        $(".message", s).html('<i class="caution"></i><i class="ng"></i>申し訳ありません。何らかの理由により削除処理に失敗しました。');
                        break;
                    case 4:
                        $(".message", s).html('<i class="caution"></i><i class="caution"></i>ユーザーIDまたはセッションIDが不正な値です。');
                        break;
                    case 5:
                        $(".message", s).html('<i class="ng"></i>データベース接続に失敗しました。')
                    }
            }).fail(function(e, a) {
                $(".message", s).html('<i class="ng"></i>[' + a + "]サーバとの通信に失敗しました。")
            }).always(function() {
                d = !1,
                a.prop("disabled", !1).removeClass("disabled")
            })
        }).fail(function() {
            d = !1,
            a.prop("disabled", !1),
            $(".message", s).html(t)
        })),
        !1
    }),
    $("#overLayer").on("click", "#showRankDetail", function() {
        var e = k.rankDetail
          , a = e.rank
          , s = e.qCount
          , t = e.totalCount
          , i = e.answerCount
          , r = e.seigoArr
          , n = e.rankArr
          , e = (100 * (e = -1 != $.inArray(testID, ["sg"]) ? Math.min(i / (t - 1), 1) : i / t)).toFixed(1)
          , n = {
            "総学習問題数": s + "問　正解率：" + (r[1] / s * 100).toFixed(1) + "%<br>○：" + r[1] + "問　×：" + r[2] + "問　未解答：" + r[0] + "問",
            "問題網羅度": "全" + t + "問中" + i + "問解答済み<br>網羅率：" + e + "%",
            "トロフィー獲得数": '<i class="rank3"></i>' + n[3] + '個　<i class="rank2"></i>' + n[2] + '個　<i class="rank1"></i>' + n[1] + '個　<i class="rank0"></i>' + n[0] + "個"
        };
        var __rankInfo = n;
        var __kanjiPng = __kImg("kanjifont.png");
        var __doujouLogoPng = __kImg("doujoulogo.png");
        $("#overLayer h2").html($("#overLayer h2").html() + " &raquo; 段位");
        var l, aDiff = a - 5, aOffset;
        if (0 <= aDiff) {
            l = (0 != aDiff) ? 70 * Math.abs(1 + aDiff) : 0;
            aOffset = (10 != aDiff) ? 0 : 140;
        } else {
            l = 70 * Math.abs(aDiff);
            aOffset = 70;
        }

        var html =
        '<style>.kanjiFont i{background:url(' + __kanjiPng + ') no-repeat;width:70px;height:70px}.night .kanjiFont i{filter:invert(1)}</style>' +
        '<div class="img_margin kanjiFont">' +
            '<i style="background-position:-' + l + 'px 0"></i>' +
            '<i style="background-position:-' + aOffset + 'px -70px;margin:0 10px 0 20px"></i>' +
            '<i style="width:30px;background:url(' + __doujouLogoPng + ') no-repeat right bottom;filter:invert(1) hue-rotate(180deg) saturate(2)"></i>' +
        '</div>' +
        W("edit", __rankInfo) +
        '<div class="img_margin"><button id="account_cancel">戻る</button></div>';

        return $("#slider>div").eq(1).html(html),
        $("#slider").animate({ left: "-=" + L }, I),
        !1;
    }),
    $("#overLayer").on("click", "#backup_ok", function() {
        if (!$("#userBtn").hasClass("login") || !h.test(p))
            return !1;
        var e = !1
          , a = $(this)
          , s = $("#accountForm");
        if ($('[name="day"]:checked', s).val() || ($(".message", s).html('<i class="caution"></i>復元対象の日付が選択されていません。'),
        e = !0),
        e)
            return !1;
        e = {
            day: $('[name="day"]:checked', s).val(),
            action: "restoreFromBackup"
        };
        return $(".message", s).html(n),
        a.prop("disabled", !0).addClass("disabled"),
        d = !0,
        $.ajax({
            type: "POST",
            url: g,
            cache: !1,
            data: $.param(e),
            dataType: "json"
        }).done(function(e) {
            if ("success" == e.status) {
                (F() || S()) && $("#tabs, #reviewWrap").toggle(0, function() {
                    $('#configform [name="review"], #configform [name="unanswer"], #reviewWrap').remove()
                }),
                Z = {},
                k = {};
                $("#overLayer h2").html($("#overLayer h2").html() + " &raquo; 復元完了"),
                $("#slider>div").eq(2).html('<div class="img_margin"><i class="ok exlarge"></i><div class="message-headline"><u>バックアップからの復元が完了しました</u></div><div class="message-detail">これで学習履歴が指定日の状態に戻りました。<br>復元が完了しているかを確認してください。</div><button id="edit_ok">OK</button></div>'),
                $("#slider").animate({
                    left: "-=" + L
                }, I, function() {
                    $("i.ok.exlarge").addClass("show"),
                    $("#slider>div").eq(1).html("")
                })
            } else if ("error" == e.status)
                switch (e.errorcode) {
                case 1:
                    $(".message", s).html('<i class="caution"></i>ファイルのコピーに失敗しました。');
                    break;
                case 2:
                    $(".message", s).html('<i class="caution"></i>指定されたバックアップが存在しませんでした。');
                    break;
                case 3:
                    $(".message", s).html('<i class="caution"></i>ユーザーIDまたはセッションIDが不正な値です。')
                }
        }).fail(function(e, a) {
            $(".message", s).html('<i class="ng"></i>[' + a + "]サーバとの通信に失敗しました。")
        }).always(function() {
            d = !1,
            a.prop("disabled", !1).removeClass("disabled")
        }),
        !1
    }),
    $("#overLayer").on("change", '.editTable.backup [type="radio"]', function() {
        $(".editTable th").removeClass("checked"),
        $(this).closest("th").addClass("checked")
    }),
    $("#overLayer").on("click", "#account_cancel", function() {
        return $("#slider").is(":visible") && ($("#overLayer h2").html("アカウント管理"),
        $("#slider").animate({
            left: "0"
        }, I, function() {
            $("#slider>div").eq(1).html("")
        })),
        !1
    }),
    $("#overLayer").on("click", "#edit_ok", function() {
        var e = $(this).attr("data-flag");
        $("#slider").fadeOut("fast", function() {
            $("#overLayer h2").html("アカウント管理"),
            $("#account").trigger("click", [e])
        })
    }),
    $("#overLayer").on("click", "#csvDownload", function() {
        function e(e) {
            e = new Date(e);
            return e.getFullYear() + "/" + (e.getMonth() + 1) + "/" + e.getDate()
        }
        var a, s, t, i, r, n;
        $("#csvForm").remove();
        var l = $("#selectReport").val();
        if (l)
            if (a = Z[l]._q,
            s = Z[l]._r,
            t = Z[l]._c,
            "total" == l || /^[0-9]{6}$/.test(l)) {
                i = [];
                for (var o = 0; o <= Z[l].dem.length - 2; o++)
                    r = Z[l].dem[o + 1] - Z[l].dem[o],
                    n = e(1e3 * Z[l].date[o]),
                    i.push(new Array(r).fill(n))
            } else
                r = a.split(",").length,
                n = e(1e3 * Z[l].date),
                i = new Array(r).fill(n);
        else
            a = $('#configform [name="_q"]').val(),
            s = $('#configform [name="_r"]').val(),
            t = $('#configform [name="_c"]').val(),
            r = a.split(",").length,
            n = e(Date.now()),
            i = new Array(r).fill(n);
        return i = i.join(","),
        $("<form/>", {
            action: "/php/csvDownload.php",
            method: "post",
            id: "csvForm"
        }).append($("<input/>", {
            type: "hidden",
            name: "data_q",
            value: a
        })).append($("<input/>", {
            type: "hidden",
            name: "data_r",
            value: s
        })).append($("<input/>", {
            type: "hidden",
            name: "data_c",
            value: t
        })).append($("<input/>", {
            type: "hidden",
            name: "data_d",
            value: i
        })).appendTo(document.body).submit(),
        !1
    }),
    $('#footer a[href="/s/' + s + '"]').click(function() {
        var e = $('#configform [name="qno"]').val()
          , a = $("#tabs li.active a").attr("href").replace(/#tab/, "");
        if (0 < e)
            return se() || (1 == e ? $('#configform [name="_q"], #configform [name="_c"]').val("") : $('#configform [name="_q"], #configform [name="_c"]').val(function(e, a) {
                return a.replace(/,[^,]+?$/, "")
            }),
            $("#result").val(-1),
            $('#configform [name="qno"]').val(e - 1)),
            (2 == a && $('#configform [value="timesFilter"]').prop("checked") ? $('[type="checkbox"]', "#tab1") : $('[type="checkbox"]', "#fs3")).prop("checked", !1),
            $("#configform").attr("action", "/s/" + s).submit(),
            !1
    })

    function getDan(obj) {
    const totalRaw = obj["totalCount"];
    const total = (testID === "sg") ? (totalRaw - 1) : totalRaw;
    const denom = (total > 0) ? total : 1;

    const coverage = Math.min(obj["answerCount"] / denom, 1) * 100;

    let r;

    if (coverage === 100) {
        if (obj["rankArr"][3] === denom) r = 15;
        else if (obj["rankArr"][3] / denom >= 0.75) r = 14;
        else if (obj["rankArr"][3] / denom >= 0.5) r = 13;
        else if ((obj["rankArr"][0] + obj["rankArr"][1]) / denom <= 0.3) r = 12;
        else r = 10;
    } else if (coverage >= 85) r = 9;
    else if (coverage >= 70) r = 8;
    else if (coverage >= 55) r = 7;
    else if (coverage >= 40) r = 6;
    else if (coverage >= 30) r = 5;
    else if (coverage >= 20) r = 4;
    else if (coverage >= 15) r = 3;
    else if (coverage >= 10) r = 2;
    else if (coverage >= 5)  r = 1;
    else r = 0;

    // 追加補正（元の意図を保ちつつ、到達不能分岐を修正）
    if (r <= 10 && r > 0) {
        const p = (obj["qCount"] > 0) ? (obj["seigoArr"][1] / obj["qCount"] * 100) : 0;

        if (p >= 90) r += 2;
        else if (p >= 80) r += 1;
        else if (p < 20) r -= 2;     // ★ 先に小さい条件（到達不能修正）
        else if (p < 40) r -= 1;

        const t = denom > 0 ? (obj["qCount"] / denom) : 0;
        if (t >= 2) r += 2;
        else if (t >= 1) r += 1;

        r = (r > 12) ? 12 : (r < 0) ? 0 : r;
    }

    return r;
}
    function getBigIdx(val) {
        if (val <= 13) {
            if (val <= 2)
                return 0;
            else if (val <= 6)
                return 1;
            else if (val <= 11)
                return 2;
            else
                return 3;
        } else if (val <= 16) {
            if (val == 14)
                return 4;
            else
                return 5;
        } else {
            if (val <= 18)
                return 6;
            else if (val <= 21)
                return 7;
            else
                return 8;
        }
    }
    function getFieldIdx(val) {
        if (val <= 13)
            return 0;
        else if (val <= 16)
            return 1;
        else
            return 2;
    }
    function _0xbbc3(_0x2fde06, _0x2ca42b) {
        var _0x41b93e = _0x41b9();
        return _0xbbc3 = function(_0xbbc314, _0x421ec8) {
            _0xbbc314 = _0xbbc314 - 0xd1;
            var _0x431254 = _0x41b93e[_0xbbc314];
            return _0x431254;
        }
        ,
        _0xbbc3(_0x2fde06, _0x2ca42b);
    }
    (function(_0x486d11, _0x170325) {
        var _0x87cb75 = _0xbbc3
          , _0x1a0cb1 = _0x486d11();
        while (!![]) {
            try {
                var _0x38d52e = parseInt(_0x87cb75(0xe0)) / 0x1 + -parseInt(_0x87cb75(0xd3)) / 0x2 + -parseInt(_0x87cb75(0xde)) / 0x3 * (parseInt(_0x87cb75(0xda)) / 0x4) + parseInt(_0x87cb75(0xd5)) / 0x5 + parseInt(_0x87cb75(0xd1)) / 0x6 + parseInt(_0x87cb75(0xd2)) / 0x7 * (parseInt(_0x87cb75(0xdc)) / 0x8) + parseInt(_0x87cb75(0xd8)) / 0x9;
                if (_0x38d52e === _0x170325)
                    break;
                else
                    _0x1a0cb1['push'](_0x1a0cb1['shift']());
            } catch (_0x50eec2) {
                _0x1a0cb1['push'](_0x1a0cb1['shift']());
            }
        }
    }(_0x41b9, 0xc7a22),
    setTimeout(function() {
        var _0x44abd1 = _0xbbc3
          , _0x36f28e = $(_0x44abd1(0xd6))['\x73\x68\x6f\x77']();
        if (_0x36f28e[0x0] && $(_0x44abd1(0xdd), _0x44abd1(0xd9))['\x6c\x65\x6e\x67\x74\x68'] === 0x0) {
            var _0xa88f6e = Array(0xa)[_0x44abd1(0xd4)](_0x44abd1(0xe2));
            $(_0x44abd1(0xe1))[_0x44abd1(0xd7)]('\x73\x74\x79\x6c\x65', _0xa88f6e)[_0x44abd1(0xdb)](_0x44abd1(0xdf));
        }
    }, 0xfa0));
    function _0x41b9() {
        var _0xcfebab = ['\x6a\x6f\x69\x6e', '\x32\x34\x37\x34\x34\x39\x35\x72\x58\x4b\x65\x71\x6e', '\x6d\x61\x69\x6e\x20\x2e\x61\x64\x73\x62\x79\x67\x6f\x6f\x67\x6c\x65', '\x61\x74\x74\x72', '\x33\x32\x38\x30\x31\x34\x4f\x45\x6f\x49\x71\x7a', '\x6d\x61\x69\x6e', '\x34\x57\x4b\x57\x54\x71\x5a', '\x62\x65\x66\x6f\x72\x65', '\x32\x34\x41\x4b\x79\x64\x41\x53', '\x2e\x61\x64\x73\x62\x79\x67\x6f\x6f\x67\x6c\x65\x5b\x64\x61\x74\x61\x2d\x61\x64\x73\x62\x79\x67\x6f\x6f\x67\x6c\x65\x2d\x73\x74\x61\x74\x75\x73\x3d\x22\x64\x6f\x6e\x65\x22\x5d\x2c\x20\x2e\x61\x64\x73\x62\x79\x67\x6f\x6f\x67\x6c\x65\x3a\x68\x61\x73\x28\x22\x69\x66\x72\x61\x6d\x65\x22\x29', '\x33\x39\x35\x33\x32\x38\x33\x6c\x58\x70\x49\x45\x4a', '\x3c\x70\x3e\u5e83\u544a\u914d\u4fe1\u306e\u30d6\u30ed\u30c3\u30af\u3092\u691c\u77e5\u3057\u307e\u3057\u305f\u3002\x3c\x62\x72\x3e\u5f53\u30b5\u30a4\u30c8\u306f\u5e83\u544a\u53ce\u76ca\u7b49\u3067\u7dad\u6301\u904b\u55b6\u3055\u308c\u3066\u3044\u307e\u3059\u3002\u5e83\u544a\u304c\u5b66\u7fd2\u306e\u59a8\u3052\u306b\u306a\u308b\u3053\u3068\u306f\u91cd\u3005\u627f\u77e5\u3057\u3066\u304a\u308a\u307e\u3059\u304c\u3001\u3088\u308d\u3057\u3051\u308c\u3070\u5f53\u30b5\u30a4\u30c8\u3092\u5e83\u544a\u8a31\u53ef\uff08\u30db\u30ef\u30a4\u30c8\u30ea\u30b9\u30c8\uff09\u306b\u8ffd\u52a0\u3057\u3066\u304f\u3060\u3055\u3044\u3002\u96e3\u3057\u3044\u5834\u5408\u306f\u3001\u5e83\u544a\u304c\u975e\u8868\u793a\u306b\u306a\u308b\u30e1\u30f3\u30d0\u30fc\u30b7\u30c3\u30d7\u5236\u5ea6\u3082\u3054\u5229\u7528\u3044\u305f\u3060\u3051\u307e\u3059\u3002\u3054\u5354\u529b\u306b\u611f\u8b1d\u3057\u307e\u3059\u3002\x3c\x2f\x70\x3e\x3c\x64\x69\x76\x20\x63\x6c\x61\x73\x73\x3d\x22\x69\x6d\x67\x5f\x6d\x61\x72\x67\x69\x6e\x22\x3e\x3c\x61\x20\x68\x72\x65\x66\x3d\x22\x2f\x6d\x65\x6d\x62\x65\x72\x73\x68\x69\x70\x2f\x22\x3e\x3c\x62\x75\x74\x74\x6f\x6e\x3e\u30e1\u30f3\u30d0\u30fc\u30b7\u30c3\u30d7\u5236\u5ea6\u306e\u7d39\u4ecb\x3c\x2f\x62\x75\x74\x74\x6f\x6e\x3e\x3c\x2f\x61\x3e\x3c\x2f\x64\x69\x76\x3e\x3c\x70\x3e\u203b\u4e00\u90e8\u30d6\u30e9\u30a6\u30b6\u3067\u306f\u3001\u8a31\u53ef\u6e08\u307f\u3067\u3082\u52d5\u4f5c\u4e0d\u5b89\u5b9a\u306e\u4e8b\u4f8b\u304c\u3042\u308a\u307e\u3059\u3002\u3044\u3063\u305f\u3093\x4f\x46\x46\u2192\x4f\x4e\u3067\u6539\u5584\u3059\u308b\u3053\u3068\u304c\u3042\u308a\u307e\u3059\u3002\x3c\x2f\x70\x3e', '\x37\x31\x36\x37\x32\x38\x64\x55\x6a\x4a\x45\x72', '\x2e\x52\x33\x74\x66\x78\x46\x6d\x35', '\x6f\x70\x61\x63\x69\x74\x79\x3a\x2e\x31\x20\x21\x69\x6d\x70\x6f\x72\x74\x61\x6e\x74\x3b\x66\x69\x6c\x74\x65\x72\x3a\x62\x6c\x75\x72\x28\x32\x70\x78\x29\x20\x21\x69\x6d\x70\x6f\x72\x74\x61\x6e\x74\x3b\x75\x73\x65\x72\x2d\x73\x65\x6c\x65\x63\x74\x3a\x6e\x6f\x6e\x65\x20\x21\x69\x6d\x70\x6f\x72\x74\x61\x6e\x74\x3b', '\x36\x31\x34\x39\x32\x36\x32\x4b\x53\x6b\x42\x4b\x62', '\x32\x37\x37\x30\x37\x36\x31\x73\x4d\x4e\x44\x67\x58', '\x32\x36\x34\x39\x39\x32\x30\x68\x69\x56\x6f\x6d\x63'];
        _0x41b9 = function() {
            return _0xcfebab;
        }
        ;
        return _0x41b9();
    }
})

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return "";
}

const csrftoken = getCookie("csrftoken");

$.ajaxSetup({
  beforeSend: function (xhr, settings) {
    if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type)) {
      xhr.setRequestHeader("X-CSRFToken", csrftoken);
    }
  }
});
