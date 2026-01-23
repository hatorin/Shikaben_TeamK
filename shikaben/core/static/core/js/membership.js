// core/static/core/js/membership.js
(() => {
  "use strict";

  // =========================
  // 検索パネル開閉
  // =========================
  const searchBtn = document.querySelector("#headerMenu .search_button a");
  const panel = document.querySelector(".search_panel");
  const closeBtn = document.querySelector(".search_close_button");

  const openSearch = () => {
    if (!panel) return;
    panel.style.display = "block";
    panel.setAttribute("aria-hidden", "false");
  };

  const closeSearch = () => {
    if (!panel) return;
    panel.style.display = "none";
    panel.setAttribute("aria-hidden", "true");
  };

  if (searchBtn) {
    searchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (!panel) return;
      const isOpen = panel.style.display === "block";
      isOpen ? closeSearch() : openSearch();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeSearch);
    closeBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") closeSearch();
    });
  }

  // =========================
  // ドロワー開閉
  // =========================
  const drawerBtn = document.getElementById("drawer_btn");
  if (drawerBtn) {
    drawerBtn.addEventListener("click", () => {
      document.body.classList.toggle("menu_open");
    });
  }

  // =========================
  // toTop 表示（スクロールで出す/消す）
  // =========================
  const toTop = document.getElementById("toTop");

  const onScroll = () => {
    if (!toTop) return;
    const y = window.scrollY || document.documentElement.scrollTop;
    if (y > 300) toTop.classList.add("show");
    else toTop.classList.remove("show");
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // =========================
  // Pagetopを滑らか＆少しゆっくりに戻す
  // =========================
  if (toTop) {
    toTop.addEventListener(
      "click",
      (e) => {
        e.preventDefault();

        const startY = window.pageYOffset || document.documentElement.scrollTop;
        const duration = 900; // 大きいほどゆっくり（例: 700〜1200）
        const startTime = performance.now();

        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

        const step = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = easeOutCubic(progress);

          window.scrollTo(0, Math.round(startY * (1 - eased)));

          if (progress < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
      },
      { passive: false }
    );
  }
})();
