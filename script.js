/* Dermalux. Ванильный JS: плиты и раскрытие кадра «мазком», меню, якоря, язык, форма в WhatsApp. */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement, W = window;
  root.classList.add("js");
  var ASSET_V = ((doc.currentScript && doc.currentScript.src.match(/[?&]v=([^&]+)/)) || [])[1] || "";
  var REDUCED = W.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var clamp = function (v, a, b) { return Math.max(a === undefined ? 0 : a, Math.min(b === undefined ? 1 : b, v)); };
  var easeOut = function (x) { return 1 - Math.pow(1 - x, 3); };
  var smooth = function (x) { x = clamp(x); return x * x * (3 - 2 * x); };
  var LANG = "ru";
  var MOBILE = W.matchMedia("(max-width:760px)").matches;
  var TOUCH = W.matchMedia("(pointer:coarse)").matches;
  var VW = W.innerWidth, VH = W.innerHeight;

  /* ---------- WhatsApp: один номер, текст по ключу карточки ---------- */
  var PHONE = "77075254092";
  var WA = {
    ru: {
      "default": "Здравствуйте! Пишу с сайта Dermalux. Хочу записаться на приём к дерматологу-косметологу.",
      hero: "Здравствуйте! Пишу с сайта Dermalux. Хочу записаться на приём. Что беспокоит: ",
      menu: "Здравствуйте! Пишу с сайта Dermalux. Хочу записаться на приём. Что беспокоит: ",
      sticky: "Здравствуйте! Пишу с сайта Dermalux. Хочу записаться на приём. Что беспокоит: ",
      kontakty: "Здравствуйте! Пишу с сайта Dermalux. Хочу записаться на приём. Что беспокоит: ",
      rflifting: "Здравствуйте! Интересует безоперационная подтяжка лица, RF-лифтинг. Подскажите стоимость и свободное время.",
      pochemu: "Здравствуйте! Пишу с сайта Dermalux. Хочу записаться на консультацию. Что беспокоит: ",
      papillomy: "Здравствуйте! Интересует удаление папиллом или бородавок. Подскажите стоимость и свободное время.",
      rodinki: "Здравствуйте! Интересует осмотр родинки с дерматоскопией и удаление по показаниям. Подскажите стоимость и свободное время.",
      pigmentaciya: "Здравствуйте! Интересует лечение пигментации или веснушек. Подскажите стоимость и свободное время.",
      morshchiny: "Здравствуйте! Интересует армирование лица. Подскажите стоимость и свободное время.",
      akne: "Здравствуйте! Интересует лечение акне или постакне. Подскажите стоимость и свободное время.",
      vrach: "Здравствуйте! Хочу задать вопрос врачу перед записью: ",
      klinika: "Здравствуйте! Подскажите, как доехать до клиники Dermalux и есть ли время на приём.",
      item: "Здравствуйте! Пишу с сайта Dermalux. Интересует: {name}. Подскажите стоимость и свободное время."
    }
  };
  var FORM_LABELS = {
    ru: { head: "Заявка с сайта Dermalux", name: "Имя", phone: "Телефон", svc: "Что беспокоит", msg: "Комментарий" }
  };
  function itemName(a) {
    var key = a.getAttribute("data-for");
    var el = key ? doc.querySelector('[data-i="' + key + '"]') : null;
    return el ? el.textContent.trim() : "";
  }
  W.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[data-wa]") : null;
    if (!a) return;
    var key = a.getAttribute("data-wa") || "default";
    var dict = WA[LANG] || WA.ru;
    var text = dict[key] || WA.ru[key] || WA.ru["default"];
    if (key === "item") text = text.replace("{name}", itemName(a));
    a.setAttribute("href", "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(text));
  }, true);

  /* ---------- Конверсии Google Ads: gtag подключается на этапе деплоя, здесь только вызовы ---------- */
  function fireConv(key) {
    if (typeof W.gtag_report_conversion !== "function" || !W.AW_CONV) return;
    var sendTo = W.AW_CONV[key];
    if (sendTo) W.gtag_report_conversion(undefined, sendTo);
  }
  W.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href^="tel:"], a[href*="wa.me"], a[href^="mailto:"]') : null;
    if (!a) return;
    fireConv(a.getAttribute("href").indexOf("tel:") === 0 ? "phone" : "contact");
  }, true);

  /* ---------- Меню ---------- */
  var burger = doc.querySelector(".burger"), menu = doc.getElementById("menu");
  var behind = [doc.getElementById("main"), doc.querySelector(".foot"), doc.getElementById("sticky")];
  function setMenu(open, returnFocus) {
    if (!menu || !burger) return;
    var was = doc.body.classList.contains("menu-open");
    if (open === was) return;
    doc.body.classList.toggle("menu-open", open);
    behind.forEach(function (el) { if (el) { if (open) el.setAttribute("inert", ""); else el.removeAttribute("inert"); } });
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(function () { menu.classList.add("open"); });
      setTimeout(function () { var first = menu.querySelector("a"); if (first) first.focus({ preventScroll: true }); }, 60);
    } else {
      menu.classList.remove("open");
      setTimeout(function () { if (!doc.body.classList.contains("menu-open")) menu.hidden = true; }, 340);
      if (returnFocus) burger.focus({ preventScroll: true });
    }
  }
  if (burger) burger.addEventListener("click", function () { var o = doc.body.classList.contains("menu-open"); setMenu(!o, o); });
  doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && doc.body.classList.contains("menu-open")) setMenu(false, true); });

  /* ---------- Якоря ---------- */
  var HDR = function () { return parseFloat(getComputedStyle(root).getPropertyValue("--hdr")) || 68; };
  function targetTop(el) {
    var r = el.getBoundingClientRect().top + W.pageYOffset;
    if (el.classList.contains("pw")) return MOBILE ? r - HDR() : r;
    if (el.classList.contains("sec")) return r - HDR();
    return r - HDR() - 14;
  }
  function goTo(id, instant) {
    var el = doc.getElementById(id);
    if (!el) return false;
    setMenu(false);
    var top = Math.max(0, targetTop(el));
    if (instant || REDUCED) { root.style.scrollBehavior = "auto"; W.scrollTo(0, top); root.style.scrollBehavior = ""; }
    else W.scrollTo({ top: top, behavior: "smooth" });
    return true;
  }
  doc.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var id = a.getAttribute("href").slice(1);
    if (!id) return;
    if (goTo(id)) {
      e.preventDefault();
      try { history.pushState(null, "", "#" + id); } catch (err) {}
      var t = doc.getElementById(id);
      if (t) { if (!t.hasAttribute("tabindex") && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(t.tagName)) t.setAttribute("tabindex", "-1"); try { t.focus({ preventScroll: true }); } catch (err2) {} }
    }
  });

  /* ---------- Плиты: enter / stay / exit, раскрытие кадра --open ---------- */
  var pws = [].slice.call(doc.querySelectorAll(".pw"));
  var sticky = doc.getElementById("sticky"), kont = doc.getElementById("kontakty");
  var hdr = doc.getElementById("hdr");
  var INTRO = (location.hash.length > 1 || W.pageYOffset > 80 || REDUCED) ? 1 : 0;
  var introStart = 0, ticking = false;
  var st = pws.map(function () { return { open: -1, out: {} }; });
  var lastTs = 0;
  function put(el, s, k, v) { if (s.out[k] !== v) { s.out[k] = v; el.style.setProperty(k, v); } }
  function markDone(pw, s, open) {
    if (!s.ph) s.ph = pw.querySelectorAll(".ph");
    var done = open >= 0.999;
    if (s.done !== done) { s.done = done; for (var i = 0; i < s.ph.length; i++) s.ph[i].classList.toggle("done", done); }
  }
  function update(ts) {
    ticking = false;
    var now = typeof ts === "number" ? ts : performance.now();
    var dt = lastTs ? Math.min(64, now - lastTs) : 16.7; lastTs = now;
    var k = 1 - Math.pow(1 - 0.18, dt / 16.7);
    var H = VH;
    var pageY = W.pageYOffset;
    var kontTop = kont ? kont.getBoundingClientRect().top : null;
    var rects = [], nxtTops = [], i;
    for (i = 0; i < pws.length; i++) {
      rects.push(pws[i].getBoundingClientRect());
      var nx = pws[i].nextElementSibling;
      nxtTops.push(nx ? nx.getBoundingClientRect().top : null);
    }
    var moving = false;
    for (i = 0; i < pws.length; i++) {
      var pw = pws[i], r = rects[i], s = st[i];
      var near = r.bottom > -H * 0.5 && r.top < H * 1.5;
      if (!near && s.out["--enter"] !== undefined && !s.reset) { s.reset = true; } else if (near) s.reset = false;
      if (!near && s.reset) continue;
      var enter = clamp(1 - r.top / H);
      var stay = r.height > H ? clamp(-r.top / (r.height - H)) : 0;
      var exit = (nxtTops[i] !== null && !MOBILE) ? clamp(1 - nxtTops[i] / H) : 0;
      var isHero = pw.classList.contains("pw-hero");
      var open;
      /* мазок: герой - по интро; плиты - по въезду (на телефоне раньше, кадр у верха экрана) */
      if (isHero) open = REDUCED ? 1 : smooth(INTRO);
      else open = REDUCED ? 1 : (MOBILE ? smooth((enter - 0.15) / 0.5) : smooth((enter - 0.28) / 0.58));
      if (s.open < 0 || REDUCED || isHero) s.open = open;
      else {
        s.open += (open - s.open) * k;
        if (Math.abs(open - s.open) > 0.002) moving = true; else s.open = open;
      }
      put(pw, s, "--enter", enter.toFixed(4));
      put(pw, s, "--stay", (isHero ? easeOut(stay) : stay).toFixed(4));
      put(pw, s, "--exit", exit.toFixed(4));
      put(pw, s, "--open", s.open.toFixed(4));
      markDone(pw, s, s.open);
      var plate = pw.firstElementChild;
      if (plate) plate.classList.toggle("gone", exit >= 1 && !MOBILE);
      if (!s.txts) s.txts = pw.querySelectorAll(".txt, .hero-txt");
      var on = isHero ? INTRO > 0.15 : (MOBILE ? enter > 0.3 : enter > 0.6);
      if (s.on !== on) { s.on = on; for (var t = 0; t < s.txts.length; t++) s.txts[t].classList.toggle("on", on); }
    }
    if (sticky) {
      var show = pageY > H * 0.55;
      if (kontTop !== null && kontTop < H * 0.5) show = false;
      sticky.classList.toggle("show", show);
    }
    if (hdr) hdr.classList.toggle("scrolled", pageY > 12);
    if (moving) onScroll();
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  W.addEventListener("scroll", onScroll, { passive: true });
  W.addEventListener("resize", function () {
    /* на телефоне смена только высоты - это адресная строка: раскладку не пересчитываем */
    if (W.innerWidth !== VW) { VW = W.innerWidth; VH = W.innerHeight; MOBILE = W.matchMedia("(max-width:760px)").matches; buildLines(); }
    else if (!TOUCH) VH = W.innerHeight;
    onScroll();
  });
  function runIntro(ts) {
    if (!introStart) introStart = ts;
    INTRO = clamp((ts - introStart) / 1500);
    update(ts);
    if (INTRO < 1) requestAnimationFrame(runIntro);
  }

  /* ---------- Золотая линия мазка: путь через центры мазков, в пикселях кадра ---------- */
  var lines = [].slice.call(doc.querySelectorAll(".ph-line"));
  function buildLines() {
    lines.forEach(function (svg) {
      var ph = svg.parentNode, r = ph.getBoundingClientRect();
      if (!r.width || !r.height) return;
      var cs = getComputedStyle(ph), pts = [];
      for (var i = 1; i <= 6; i++) {
        var x = parseFloat(cs.getPropertyValue("--x" + i)), y = parseFloat(cs.getPropertyValue("--y" + i));
        if (isNaN(x) || isNaN(y)) return;
        pts.push([x / 100 * r.width, y / 100 * r.height]);
      }
      var d = "M" + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
      for (i = 0; i < pts.length - 1; i++) {
        var p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
        var c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
        d += "C" + c1[0].toFixed(1) + " " + c1[1].toFixed(1) + " " + c2[0].toFixed(1) + " " + c2[1].toFixed(1) + " " + p2[0].toFixed(1) + " " + p2[1].toFixed(1);
      }
      svg.setAttribute("viewBox", "0 0 " + Math.round(r.width) + " " + Math.round(r.height));
      var paths = svg.querySelectorAll("path"), len = 0;
      for (i = 0; i < paths.length; i++) { paths[i].setAttribute("d", d); len = paths[i].getTotalLength(); }
      svg.style.setProperty("--len", Math.ceil(len) + "");
    });
  }
  buildLines();

  /* ---------- Кадры секций (врач): раскрытие по появлению ---------- */
  var secPh = [].slice.call(doc.querySelectorAll(".sec .ph"));
  secPh.forEach(function (ph) { ph.style.setProperty("--open", REDUCED ? "1" : "0"); if (REDUCED) ph.classList.add("done"); });
  function openPh(ph) {
    var t0 = 0;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = smooth((ts - t0) / 1300);
      ph.style.setProperty("--open", p.toFixed(4));
      if (p < 1) requestAnimationFrame(step); else ph.classList.add("done");
    }
    requestAnimationFrame(step);
  }

  /* ---------- Бегущая лента героя: вторая копия для бесшовного цикла ---------- */
  var bandT = doc.getElementById("bandT");
  if (bandT) bandT.innerHTML += bandT.innerHTML;

  /* ---------- Язык: RU в разметке, KZ подгружается отдельным файлом по кнопке ---------- */
  var I18N = { ru: {} };
  var RU = I18N.ru;
  var iEls = [].slice.call(doc.querySelectorAll("[data-i]"));
  var phEls = [].slice.call(doc.querySelectorAll("[data-i-ph]"));
  var ariaEls = [].slice.call(doc.querySelectorAll("[data-i-aria]"));
  var altEls = [].slice.call(doc.querySelectorAll("[data-i-alt]"));
  var metaDesc = doc.querySelector('meta[name="description"]');
  iEls.forEach(function (el) { var k = el.getAttribute("data-i"); if (RU[k] == null) RU[k] = el.innerHTML; });
  phEls.forEach(function (el) { RU[el.getAttribute("data-i-ph")] = el.getAttribute("placeholder"); });
  ariaEls.forEach(function (el) { RU[el.getAttribute("data-i-aria")] = el.getAttribute("aria-label"); });
  altEls.forEach(function (el) { RU[el.getAttribute("data-i-alt")] = el.getAttribute("alt"); });
  RU["meta.title"] = doc.title;
  RU["meta.desc"] = metaDesc ? metaDesc.getAttribute("content") : "";
  function t(key) { var d = I18N[LANG] || RU; return d[key] != null ? d[key] : RU[key]; }
  function applyLang(lang) {
    if (!I18N[lang]) lang = "ru";
    LANG = lang;
    iEls.forEach(function (el) { var v = t(el.getAttribute("data-i")); if (v != null) el.innerHTML = v; });
    phEls.forEach(function (el) { var v = t(el.getAttribute("data-i-ph")); if (v != null) el.setAttribute("placeholder", v); });
    ariaEls.forEach(function (el) { var v = t(el.getAttribute("data-i-aria")); if (v != null) el.setAttribute("aria-label", v); });
    altEls.forEach(function (el) { var v = t(el.getAttribute("data-i-alt")); if (v != null) el.setAttribute("alt", v); });
    doc.title = t("meta.title");
    if (metaDesc) metaDesc.setAttribute("content", t("meta.desc"));
    root.setAttribute("lang", lang);
    [].forEach.call(doc.querySelectorAll(".lang button"), function (b) {
      var on = b.getAttribute("data-lang") === lang;
      b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    try { localStorage.setItem("dermalux-lang", lang); } catch (e) {}
  }
  function loadLang(lang, done) {
    if (I18N[lang] || lang !== "kk") return done();
    var s = doc.createElement("script");
    s.src = "assets/lang/kk.js" + (ASSET_V ? "?v=" + ASSET_V : "");
    s.onload = function () {
      if (W.SITE_KK) {
        I18N.kk = W.SITE_KK;
        if (W.SITE_KK_WA) WA.kk = W.SITE_KK_WA;
        if (W.SITE_KK_FORM) FORM_LABELS.kk = W.SITE_KK_FORM;
      }
      done();
    };
    s.onerror = function () { done(); };
    doc.head.appendChild(s);
  }
  function setLang(lang) { loadLang(lang, function () { applyLang(lang); }); }
  [].forEach.call(doc.querySelectorAll(".lang button"), function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
  });
  (function initLang() {
    /* ?lang= в адресе главнее сохранённого выбора: реклама ведёт на ?lang=ru */
    var forced = (location.search.match(/[?&]lang=(ru|kk)/) || [])[1];
    var saved = null; try { saved = localStorage.getItem("dermalux-lang"); } catch (e) {}
    var lang = forced || saved || "ru";
    if (lang !== "ru") setLang(lang);
  })();

  /* ---------- Проявление секций ---------- */
  var rv = [].slice.call(doc.querySelectorAll(".rv"));
  if ("IntersectionObserver" in W && !REDUCED) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) {
        if (!x.isIntersecting) return;
        x.target.classList.add("in");
        [].forEach.call(x.target.querySelectorAll(".ph"), function (ph) { if (!ph.classList.contains("done")) openPh(ph); });
        io.unobserve(x.target);
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    rv.forEach(function (el) { io.observe(el); });
    setTimeout(function () { rv.forEach(function (el) { if (!el.classList.contains("in") && el.getBoundingClientRect().top < W.innerHeight) { el.classList.add("in"); [].forEach.call(el.querySelectorAll(".ph"), openPh); } }); }, 1500);
  } else { rv.forEach(function (el) { el.classList.add("in"); }); secPh.forEach(function (ph) { ph.style.setProperty("--open", "1"); ph.classList.add("done"); }); }

  /* ---------- Форма -> WhatsApp ---------- */
  var form = doc.getElementById("form"), thanks = doc.getElementById("thanks"), ferr = doc.getElementById("ferr");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = form.elements;
      if (f.website && f.website.value) { form.hidden = true; if (thanks) thanks.hidden = false; return; }
      var name = f.name.value.trim(), phone = f.phone.value.trim();
      var badPhone = phone.replace(/\D/g, "").length < 10;
      f.phone.classList.toggle("bad", badPhone);
      f.phone.setAttribute("aria-invalid", badPhone ? "true" : "false");
      if (badPhone) { if (ferr) ferr.hidden = false; f.phone.focus(); return; }
      if (ferr) ferr.hidden = true;
      var L = FORM_LABELS[LANG] || FORM_LABELS.ru;
      var lines = [L.head];
      if (name) lines.push(L.name + ": " + name);
      lines.push(L.phone + ": " + phone);
      var svc = f.service.options[f.service.selectedIndex];
      if (svc && svc.value && f.service.selectedIndex > 0) lines.push(L.svc + ": " + svc.textContent.trim());
      var msg = f.message.value.trim();
      if (msg) lines.push(L.msg + ": " + msg);
      var url = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(lines.join("\n"));
      fireConv("form");
      W.open(url, "_blank", "noopener");
      if (thanks) { thanks.hidden = false; try { thanks.focus({ preventScroll: true }); } catch (err) {} }
      form.reset();
    });
  }

  /* ---------- Ролик награды: немая петля в кадре, полный ролик со звуком по кнопке ---------- */
  var awVid = doc.getElementById("awVid");
  if (awVid) {
    var awV = awVid.querySelector("video"), awBtn = awVid.querySelector(".aw-play");
    awV.addEventListener("playing", function () { awVid.classList.add("is-live"); });
    if (!REDUCED && "IntersectionObserver" in W) {
      new IntersectionObserver(function (es) {
        es.forEach(function (x) {
          if (awVid.classList.contains("is-full")) return;
          if (x.isIntersecting) {
            if (!awV.getAttribute("src")) awV.src = awV.getAttribute("data-loop");
            var pr = awV.play(); if (pr && pr.catch) pr.catch(function () {});
          } else { awV.pause(); }
        });
      }, { threshold: 0.55 }).observe(awVid);
    }
    awBtn.addEventListener("click", function () {
      awVid.classList.add("is-full", "is-live");
      awV.loop = false; awV.muted = false; awV.controls = true;
      awV.src = awV.getAttribute("data-full");
      var pr = awV.play(); if (pr && pr.catch) pr.catch(function () {});
    });
  }

  var year = doc.getElementById("year"); if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Старт ---------- */
  function start() {
    buildLines();
    if (location.hash.length > 1) {
      var id = location.hash.slice(1);
      goTo(id, true);
      setTimeout(function () { goTo(id, true); update(); }, 60);
      setTimeout(function () { goTo(id, true); update(); }, 500);
    }
    update();
    if (INTRO < 1) requestAnimationFrame(runIntro);
  }
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { update(); });
  if (doc.readyState === "complete") start(); else W.addEventListener("load", start);
  update();
})();
