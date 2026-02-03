/* global confetti */
(function ($) {
  "use strict";

  // =========================
  // DOM参照
  // =========================
  const $selectList = () => $("#selectList");
  const $ans = () => $("#ans");
  const $judgeText = () => $("#judgeText strong");
  const $answerMeta = () => $("#answerMeta");
  const $kaisetsuTitle = () => $("#kaisetsuTitle");
  const $kaisetsu = () => $("#kaisetsu");
  const $nextBtn = () => $("#nextBtn");
  const $qno = () => $(".qno");
  const $questionBody = () => $("#questionBody");
  const $anslink = () => $(".anslink");

  // =========================
  // Cookie/CSRF
  // =========================
  function getCookie(name) {
    const m = document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)");
    return m ? decodeURIComponent(m.pop()) : "";
  }

  // toast（あなたの window.b を使う）
  function toast(html, timeout = 3500) {
    if (typeof window.b === "function") return window.b(html, timeout);
    alert(String(html).replace(/<[^>]*>/g, ""));
  }

  // スクロール（fe.js の pageScroll があれば使う）
  function scrollToAns() {
    if (typeof window.pageScroll === "function" && $("#ans").offset()) {
      window.pageScroll($("#ans").offset().top - 5, 650);
    } else {
      document.getElementById("ans")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function setChoicesDisabled(disabled) {
    $("#selectList .selectBtn").prop("disabled", !!disabled);
  }

  function clearSelectedMark() {
    $("#selectList li").removeClass("doujou-selected");
  }

  function markSelected(label) {
    clearSelectedMark();
    const btn = document.querySelector(`#selectList .selectBtn[data-selected="${CSS.escape(label)}"]`);
    btn?.closest("li")?.classList.add("doujou-selected");
  }

  // =========================
  // 公式同等：〇/✕Canvas + streak + confetti
  // =========================
  window.doujouFirst = true;
  window.doujouResult = 0;      // 0=未回答, 1=正解, 2=不正解
  window.doujouInAnimation = false;

  (function (w, r, c) {
    w["r" + r] =
      w["r" + r] ||
      w["webkitR" + r] ||
      w["mozR" + r] ||
      w["msR" + r] ||
      w["oR" + r] ||
      function (f) { w.setTimeout(f, 1000 / 60); };
    w[c] = w[c] || w["webkit" + c] || w["moz" + c] || w["ms" + c] || w["o" + c];
  })(window, "equestAnimationFrame", "cancelAnimationFrame");

  const ease = function (x, t, b, c, d, s) {
    if (s === undefined) s = 2;
    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
  };
  const rads = function (angle) {
    if (angle < 0) angle += 360;
    return (angle - 90) / 180 * Math.PI;
  };
  const fm = ' Helvetica,Arial,HiraKakuProN-W3,"メイリオ",Roboto,sans-serif';

  function setupCanvasOnce() {
    const canvas = $("#canvas_answer_front");
    if (!canvas[0]) return;
    if (canvas.data("scaled")) return;
    canvas.get(0).getContext("2d").scale(2, 2);
    canvas.data("scaled", true);
  }

  function _confetti(times) {
    const option = { particleCount: 150, spread: 110, zIndex: 55 };
    if (typeof confetti === "function") {
      confetti(option);
    } else {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.3.2/dist/confetti.browser.min.js";
      script.onload = function () { confetti(option); };
      document.body.appendChild(script);
    }
    times--;
    if (times > 0) setTimeout(function () { _confetti(times); }, 300);
  }

  function getMilestoneText(count) {
    switch (count) {
      case 5:   return "この調子!";
      case 10:  return "Very Good！";
      case 20:  return "カッコいい!!";
      case 30:  return "素晴らしい!";
      case 40:  return "Great Job！";
      case 50:  return "Wonderful！";
      case 60:  return "Fantastic！";
      case 70:  return "Amazing!!";
      case 80:  return "天才ですか!?";
      case 90:  return "もはや神...";
      case 100: return "神と認定します";
      case 150: return "惚れてまうやろ";
      case 200: return "もう芸術の域です";
      case 250: return "よっ！偏差値８億";
      case 300: return "👑ノーベル努力賞";
      case 350: return "伝説の予感...";
      case 400: return "そして伝説へ...";
      case 450: return "凄すぎて\\a世界が泣くレベル";
      case 500: return "控えめに言って\\a人間国宝ですね";
      default:  return "";
    }
  }

  function clearStreakStyle() {
    $('head style[data-doujou-streak="1"]').remove();
  }

  // 次問用リセット（連続正解countは localStorage なので消さない）
  function resetForNextQuestionUI() {
    window.doujouFirst = true;
    window.doujouResult = 0;
    window.doujouInAnimation = false;

    clearStreakStyle();
    $("body").removeClass("answer ok ng");
    setChoicesDisabled(false);
    clearSelectedMark();

    // 解説系を隠す
    $ans().hide();
    $kaisetsuTitle().hide();
    $kaisetsu().hide().empty();
    $nextBtn().hide();

    // canvasクリア
    const canvas = $("#canvas_answer_front");
    if (canvas[0]) {
      const c = canvas.get(0).getContext("2d");
      c.clearRect(0, 0, canvas.width(), canvas.height());
      canvas.removeClass("fadeout");
    }
  }

  // ここが「上の animateResult()」：連続正解演出まで統合版
  window.animateResult = function (seikai) {
    if (window.doujouInAnimation) return;
    window.doujouInAnimation = true;

    setupCanvasOnce();

    const canvas = $("#canvas_answer_front");
    if (!canvas[0]) {
      window.doujouInAnimation = false;
      return;
    }

    const c = canvas.get(0).getContext("2d");
    const w = canvas.width(), h = canvas.height();
    const center = w / 2;

    let fontSize = 22;
    let fadeTime = 900;
    const animTime = ($.fx && $.fx.off) ? 1 : 400;

    c.textAlign = "center";
    c.textBaseline = "middle";

    let count = Number(localStorage.getItem("count") || 0);
    let str = "";

    clearStreakStyle();

    if (seikai) {
      $("body").addClass("answer ok");
      str = (Math.random() > 0.5) ? " 正解！" : "Good!";

      if (window.doujouFirst || window.doujouResult === 2 || window.doujouResult === 0) count++;

      if (count === 1) {
      } else if (count === 2) {
        str = "Nice!";
      } else if (count === 3) {
        str = "お見事！";
      } else if (count === 4) {
        str = "Great!";
      } else if (count >= 100) {
        str = count + "問連続";
        fontSize = 20;
      } else if (count) {
        str = count + "問連続!";
      }

      if (window.doujouFirst && (count === 5 || count % 10 === 0)) {
        const renzoku = getMilestoneText(count);
        if (renzoku) {
          const styleExtra = (count >= 450)
            ? ';white-space:pre;padding-top:calc(50vh - 200px)'
            : "";
          const cssText = renzoku.replace(/\\a/g, "\\A");
          $('head').append(
            '<style data-doujou-streak="1">body.answer.ok::after{content:"' +
            cssText.replace(/"/g, '\\"') +
            '"' + styleExtra + "}</style>"
          );
          fadeTime = 1200;
        }
      }

      if (count % 50 === 0) _confetti(Math.floor(count / 50));

      c.lineWidth = 14;
      c.lineCap = "round";
      c.strokeStyle = "#aed85b";
      c.fillStyle = "#4dc88d";

      const sttime = Date.now();
      const startRads = rads(180);

      (function loop() {
        const progress = Math.min(Date.now() - sttime, animTime);
        const edpos = 360 * Math.min(progress / animTime / 0.75, 1);

        c.beginPath();
        c.arc(center, center, center - 10, startRads, rads(180 + edpos));
        c.stroke();

        c.clearRect(0, 100, w, 30);
        c.font = "bold " + (fontSize * ease(progress / animTime, progress, 0, 1, animTime)) + "px" + fm;
        c.fillText(str, center, h - 14);

        const requestId = window.requestAnimationFrame(loop);
        if (progress >= animTime) window.cancelAnimationFrame(requestId);
      })();

    } else {
      $("body").addClass("answer ng");

      c.lineWidth = 14;
      c.lineCap = "butt";
      c.strokeStyle = "#c94a4a";
      c.fillStyle = "#b48c53";

      const sin = Math.sin(rads(45 + 90));
      const stX1 = center + center * sin;
      const stY1 = center - center * sin;
      const stX2 = center - center * sin;
      const stY2 = center - center * sin;
      const maxlen = w;
      let len1 = 0, len2 = 0;

      const sttime = Date.now();

      (function loop() {
        const progress = Math.min(Date.now() - sttime, animTime);

        if (len1 < maxlen) {
          len1 = maxlen * Math.min(progress / animTime / 0.6 / 0.75, 1);
          const edX1 = stX1 - len1 * sin;
          const edY1 = stY1 + len1 * sin;
          c.beginPath();
          c.moveTo(stX1, stY1);
          c.lineTo(edX1, edY1);
          c.stroke();
        }

        if (progress / animTime >= 0.4) {
          len2 = maxlen * Math.min((progress / animTime - 0.4) / 0.6 / 0.75, 1);
          const edX2 = stX2 + len2 * sin;
          const edY2 = stY2 + len2 * sin;
          c.beginPath();
          c.moveTo(stX2, stY2);
          c.lineTo(edX2, edY2);
          c.stroke();
        }

        c.clearRect(0, 100, w, 30);
        c.font = "bold " + (fontSize * ease(progress / animTime, progress, 0, 1, animTime)) + "px" + fm;
        c.fillText(" 残念..", center, h - 14);

        const requestId = window.requestAnimationFrame(loop);
        if (progress >= animTime) {
          window.cancelAnimationFrame(requestId);
          c.beginPath();
          c.moveTo(stX1, stY1);
          c.lineTo(stX1 - maxlen * sin, stY1 + maxlen * sin);
          c.stroke();
        }
      })();
    }

    setTimeout(function () {
      canvas.addClass("fadeout");
      $("body").removeClass("answer ok ng");
    }, fadeTime);

    setTimeout(function () {
      canvas.removeClass("fadeout");
      c.clearRect(0, 0, w, h);
      window.doujouInAnimation = false;
    }, fadeTime + 200);

    if (window.doujouFirst) {
      if (seikai) {
        window.doujouResult = 1;
        localStorage.setItem("count", String(count));
      } else {
        window.doujouResult = 2;
        localStorage.removeItem("count");
      }
      window.doujouFirst = false;
    }
  };

  // =========================
  // API 呼び出し
  // =========================
  async function postJson(url, payload) {
    const csrftoken = getCookie("csrftoken");
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      credentials: "same-origin",
      body: JSON.stringify(payload || {}),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error("API error " + res.status + ": " + t);
    }
    return await res.json();
  }

  // =========================
  // 解説表示（採点APIの返却を想定）
  // judged: bool, selected: "ア", correct_label:"イ", explanation_html:"..."
  // =========================
  function showExplainUI(data) {
    $ans().show();
    $judgeText().text(data.judged ? "〇 正解！" : "✕ 残念…");
    $answerMeta().text(`あなたの解答：${data.selected} ／ 正解：${data.correct_label}`);

    $kaisetsuTitle().show();
    $kaisetsu().show().html(data.explanation_html || "解説は未登録です。");

    $nextBtn().show();
    scrollToAns();
  }

  // =========================
  // 次問のDOM差し替え
  // =========================
  function renderQuestion(q) {
    // q.id
    $selectList().attr("data-qid", q.id);

    // 見出し
    if (q.qno != null) $qno().text(`第${q.qno}問`);

    // 問題文（HTMLの場合は body_html を優先）
    const bodyHtml = (q.body_html != null) ? q.body_html : q.body;
    $questionBody().html(bodyHtml || "");

    // メタ
    const year = q.year ?? "";
    const source = q.source ?? "";
    const qno = q.qno ?? (q.idx != null ? (q.idx + 1) : "");
    const total = q.total ?? "";
    $anslink().html(`${year}　${source}<br>${qno}問目／選択中の問題${total}問`);

    // 選択肢
    const choices = Array.isArray(q.choices) ? q.choices : [];
    const ul = document.getElementById("selectList");
    ul.innerHTML = "";
    for (const c of choices) {
      const li = document.createElement("li");

      const btn = document.createElement("button");
      btn.className = "selectBtn";
      btn.type = "button";
      btn.dataset.selected = c.label;
      btn.textContent = c.label;

      const span = document.createElement("span");
      span.textContent = c.text;

      li.appendChild(btn);
      li.appendChild(span);
      ul.appendChild(li);
    }
  }

  // =========================
  // クリック：選択肢 → 採点 → 演出 → 解説表示
  // =========================
  document.addEventListener("click", async function (e) {
    const btn = e.target.closest("#selectList .selectBtn");
    if (!btn) return;

    // 既に解答済み / 演出中は無視
    if (!window.doujouFirst) return;
    if (window.doujouInAnimation) return;

    // 他JSと衝突しにくくする（先取り）
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const qid = $selectList().data("qid");
    const selected = btn.dataset.selected;
    const judgeUrl = $selectList().data("judge-url");
    if (!qid || !selected || !judgeUrl) {
      toast('<i class="caution"></i> judge-url / qid が見つかりません', 4000);
      return;
    }

    markSelected(selected);
    setChoicesDisabled(true);

    try {
      // 例：{ ok:true, judged:true, selected:"ア", correct_label:"ア", explanation_html:"..." }
      const data = await postJson(judgeUrl, { qid: Number(qid), selected });

      if (data.ok === false) throw new Error(data.error || "judge failed");

      window.animateResult(!!data.judged);

      // 表示用の値が欠けてたら補完
      data.selected = data.selected ?? selected;

      showExplainUI(data);

    } catch (err) {
      console.error(err);
      setChoicesDisabled(false);
      toast('<i class="caution"></i> 採点に失敗しました（通信/CSRF/URLを確認）', 5000);
    }
  }, true);

  // =========================
  // クリック：次の問題 → api_doujou_next → DOM差し替え
  // =========================
  document.addEventListener("click", async function (e) {
    const nb = e.target.closest("#nextBtn");
    if (!nb) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const nextUrl = $selectList().data("next-url");
    if (!nextUrl) {
      toast('<i class="caution"></i> next-url が見つかりません', 4000);
      return;
    }

    nb.disabled = true;

    try {
      // あなたの api_doujou_next は payload不要
      const data = await postJson(nextUrl, {});

      if (data.ok === false) throw new Error(data.error || "next failed");

      if (data.finished) {
        toast('<i class="ok"></i> 全問終了！お疲れさまでした！', 5000);
        // 終了画面があるならここで遷移
        // location.href = "/fekakomon.html";
        nb.style.display = "none";
        return;
      }

      if (!data.question) throw new Error("next returned no question");

      // 次問UIへ
      resetForNextQuestionUI();
      renderQuestion(data.question);

      // 先頭付近へ（任意）
      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (err) {
      console.error(err);
      toast('<i class="caution"></i> 次の問題の取得に失敗しました', 5000);
    } finally {
      nb.disabled = false;
    }
  }, true);

})(jQuery);
