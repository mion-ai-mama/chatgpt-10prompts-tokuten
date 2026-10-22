/**
 * script.js — content.js の内容からページを組み立てる（通常は編集不要）
 */
(function () {
  "use strict";

  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const ext = (url, text, cls) => `<a class="btn ${cls || ""}" href="${esc(url)}" target="_blank" rel="noopener">${text}</a>`;
  const paras = (arr) => (arr || []).map((p) => `<p>${p}</p>`).join("");
  const techId = (i) => `tech${String(i + 1).padStart(2, "0")}`;
  const techNo = (i) => String(i + 1).padStart(2, "0");

  function setMeta(selector, value) {
    const el = document.querySelector(selector);
    if (el && value != null) el.setAttribute("content", value);
  }

  function applyMeta(m) {
    document.title = m.pageTitle;
    setMeta('meta[name="description"]', m.description);
    setMeta('meta[property="og:title"]', m.pageTitle);
    setMeta('meta[property="og:description"]', m.description);
    setMeta('meta[property="og:url"]', m.siteUrl);
  }

  // プロンプト本文を安全にHTML化し、書き換える場所（［ここに入力］）を目立たせる
  function highlightSlots(text) {
    return esc(text).replace(/［ここに[^］\n]*］/g, '<span class="slot">$&</span>');
  }

  function hero(h) {
    return `
    <section class="hero" aria-labelledby="hero-title">
      <div class="container">
        <p class="hero__brand">${h.brand}</p>
        <h1 class="hero__title" id="hero-title">${h.titleLines.map((l) => `<span>${l}</span>`).join("")}</h1>
        <p class="hero__sub">${h.subtitle}</p>
        <div class="hero__lead">${paras(h.lead)}</div>
        <a class="btn btn--ghost" href="#${esc(h.buttonTarget)}" data-scroll>${h.buttonText}</a>
      </div>
    </section>`;
  }

  function topCta(c, url) {
    const image = `<a class="cta-soft__image" href="${esc(url)}" target="_blank" rel="noopener"><img src="${esc(c.image.src)}" alt="${esc(c.image.alt)}" width="1855" height="848"></a>`;
    return `
    <section class="container top-cta" aria-labelledby="top-cta-title">
      <div class="cta-soft">
        ${image}
        <div class="cta-soft__text">
          <h2 class="cta-soft__title" id="top-cta-title">${c.heading}</h2>
          <p>${c.text}</p>
          <ul class="cta-soft__list">${c.items.map((i) => `<li>${i}</li>`).join("")}</ul>
        </div>
        ${ext(url, c.buttonText)}
      </div>
    </section>`;
  }

  function howto(h) {
    const steps = h.steps.map((s) => `<li><span class="route__tool">${s.tag}</span>${s.text}</li>`).join("");
    return `
    <section class="section section--soft" id="${h.id}" aria-labelledby="${h.id}-title">
      <div class="container">
        <h2 class="heading" id="${h.id}-title">${h.heading}</h2>
        <ol class="route">${steps}</ol>
        <ul class="check-list">${h.notes.map((n) => `<li>${n}</li>`).join("")}</ul>
      </div>
    </section>`;
  }

  function toc(t, items) {
    const rows = items
      .map((it, i) => `<li><a href="#${techId(i)}" data-scroll><span class="toc__term">${it.term}<span class="toc__sub">${it.sub}</span></span></a></li>`)
      .join("");
    return `
    <nav class="section" id="${t.id}" aria-labelledby="${t.id}-title">
      <div class="container">
        <h2 class="heading" id="${t.id}-title">${t.heading}</h2>
        <ol class="toc">${rows}</ol>
      </div>
    </nav>`;
  }

  function promptBlock(t, id) {
    const hint = /［ここに/.test(t.prompt)
      ? `色がついた <span class="slot">［ここに入力］</span> を、自分の内容に書き換えて使います。`
      : t.hint || "そのまま貼り付けて使えます。";
    return `
    <div class="prompt">
      <p class="prompt__label">コピペ用プロンプト</p>
      <p class="prompt__hint">${hint}</p>
      <pre class="prompt__text" id="${id}">${highlightSlots(t.prompt)}</pre>
      <button type="button" class="btn btn--primary copy-btn" data-copy-target="${id}">
        <span class="copy-btn__label">プロンプトをコピー</span>
        <span class="copy-btn__done" role="status" aria-live="polite">コピーしました！</span>
      </button>
      <p class="prompt__fallback" hidden>コピーできない場合は、上の文章を長押し（PCはドラッグ）で選択して、手動でコピーしてください。</p>
    </div>`;
  }

  function technique(t, i) {
    const id = techId(i);
    return `
    <section class="step" id="${id}" aria-labelledby="${id}-title">
      <div class="container">
        <article class="step-card">
          <header class="tech__head">
            <p class="tech__no">TECHNIQUE ${techNo(i)}</p>
            <h2 class="tech__title" id="${id}-title">${t.term}<span class="tech__ja">（${t.ja}）</span></h2>
            <p class="tech__sub">${t.sub}</p>
          </header>
          <div class="step__body">
            <div><h3 class="sub-heading">どんなときに使う？</h3><p>${t.when}</p></div>
            ${promptBlock(t, `${id}-prompt`)}
            <aside class="point-box"><p class="point-box__label">使い方のポイント</p><p>${t.tip}</p></aside>
          </div>
        </article>
      </div>
    </section>`;
  }

  function finalCta(c, t, url) {
    const pains = c.pains.map((p) => `<li class="pain__bubble">${p}</li>`).join("");
    const rows = c.solutions
      .map((r) => `<li class="solve__row"><p class="solve__pain">${r.pain}</p><p class="solve__give">${r.give}</p></li>`)
      .join("");
    return `
    <section class="section section--soft" id="line" aria-labelledby="pain-title">
      <div class="container">
        <h2 class="heading" id="pain-title">${c.painHeading}</h2>
        <ul class="pain">${pains}</ul>
        <p class="bridge">${c.bridge}</p>
        <div class="cta-final">
          <h2 class="cta-final__title" id="final-cta-title">${c.heading}</h2>
          <div class="cta-final__lead">${paras(c.lead)}</div>
          <p class="solve__label">${c.solutionsLabel}</p>
          <ul class="solve">${rows}</ul>
          <p class="cta-final__caution">${c.caution}</p>
          ${ext(url, c.buttonText, "btn--large")}
        </div>
        <div class="textbook">
          <p>${t.bridge}</p>
          <a class="textbook__banner" href="${esc(url)}" target="_blank" rel="noopener">
            <img src="${esc(t.banner)}" alt="${esc(t.bannerAlt)}" loading="lazy">
          </a>
          <p>${t.support}</p>
        </div>
      </div>
    </section>`;
  }

  // クリップボードAPIが使えない環境では、本文を選択状態にして手動コピーを案内する
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(() => true, () => false);
    }
    return Promise.resolve(false);
  }

  function selectText(el) {
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function onCopy(btn) {
    const target = document.getElementById(btn.dataset.copyTarget);
    const fallback = btn.parentElement.querySelector(".prompt__fallback");
    copyText(target.textContent).then((ok) => {
      if (!ok) {
        selectText(target);
        fallback.hidden = false;
        return;
      }
      fallback.hidden = true;
      btn.classList.add("is-copied");
      clearTimeout(btn._t);
      btn._t = setTimeout(() => btn.classList.remove("is-copied"), 2200);
    });
  }

  function onScroll(e, link) {
    const dest = document.querySelector(link.getAttribute("href"));
    if (!dest) return;
    e.preventDefault();
    dest.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  function bind() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".copy-btn[data-copy-target]");
      if (btn) return onCopy(btn);
      const link = e.target.closest("a[data-scroll]");
      if (link) onScroll(e, link);
    });
  }

  function init() {
    const main = document.getElementById("main");
    if (typeof CONTENT === "undefined") return;
    const c = CONTENT;
    applyMeta(c.meta);
    main.innerHTML =
      hero(c.hero) +
      topCta(c.topCta, c.lineUrl) +
      howto(c.howto) +
      toc(c.toc, c.techniques) +
      `<div class="basic-zone">${c.techniques.map(technique).join("")}</div>` +
      finalCta(c.finalCta, c.textbook, c.lineUrl);
    document.getElementById("footer").innerHTML = `<p>${c.footer.copyright}</p><p>${c.footer.notice}</p>`;
    bind();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
