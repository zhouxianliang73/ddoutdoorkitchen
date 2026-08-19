(function () {
  var DATA = null;
  var state = {
    lang: "fr",
    door: "all",
    size: "all",
    submitting: false
  };
  var LANG_KEY = "dd_outdoor_kitchen_lang_v2";
  var LEAD_KEY = "dd_outdoor_kitchen_leads_v1";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function t(key) {
    var pack = DATA.ui[state.lang] || DATA.ui.en;
    return pack[key] || DATA.ui.en[key] || key;
  }

  function term(key) {
    var item = DATA.terms[key];
    if (!item) return key;
    return item[state.lang] || item.en || key;
  }

  function doorLabel(id) {
    var d = DATA.doors[id];
    if (!d) return id;
    return (d.door && (d.door[state.lang] || d.door.en)) || id;
  }

  function isLight(hex) {
    var h = String(hex || "").replace("#", "");
    if (h.length !== 6) return false;
    var r = parseInt(h.slice(0, 2), 16);
    var g = parseInt(h.slice(2, 4), 16);
    var b = parseInt(h.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 160;
  }

  function chipClass(code, hex) {
    var cls = "swatch-chip";
    if (/^CM/i.test(code)) cls += " wood";
    if (/^GY/i.test(code)) cls += " stone";
    if (isLight(hex)) cls += " light";
    return cls;
  }

  function filteredModels() {
    return DATA.models.filter(function (m) {
      if (state.door !== "all" && m.series !== state.door) return false;
      if (state.size !== "all" && String(m.size) !== String(state.size)) return false;
      return true;
    });
  }

  function interestText() {
    var parts = [];
    if (state.door !== "all") {
      var d = DATA.doors[state.door];
      parts.push((d && d.name) || state.door);
    }
    if (state.size !== "all") parts.push(state.size + " mm");
    return parts.join(" · ");
  }

  function shareUrl() {
    // 站内转发统一短链；域名在 GitHub Pages，WhatsApp/Meta 可抓 OG 封面
    var base = "https://ddoutdoorkitchen.com/kitchen/";
    var parts = [];
    if (state.door && state.door !== "all") parts.push("door=" + encodeURIComponent(state.door));
    if (state.size && state.size !== "all") parts.push("size=" + encodeURIComponent(String(state.size)));
    if (state.lang) parts.push("lang=" + encodeURIComponent(state.lang));
    return parts.length ? base + "?" + parts.join("&") : base;
  }

  function shareMessage() {
    // 文案简短，卡片由 OG 出图；避免再贴一长串路径
    var line = t("shareText");
    var interest = interestText();
    if (interest) line += " — " + interest;
    return line + "\n" + shareUrl();
  }

  function whatsAppHref() {
    return (
      "https://api.whatsapp.com/send?text=" + encodeURIComponent(shareMessage())
    );
  }

  function onShare(e) {
    // 手机：必须同页跳转，才能触发 WhatsApp Universal Link；_blank 会落到下载页
    var ua = navigator.userAgent || "";
    var mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
    if (e && e.preventDefault) e.preventDefault();
    if (mobile) {
      location.href = whatsAppHref();
      return;
    }
    // 桌面：新开页进 WhatsApp Web
    window.open(whatsAppHref(), "_blank", "noopener,noreferrer");
  }

  function renderSwatch(roleKey, code) {
    var hex = DATA.swatches[code] || "#888";
    return (
      '<div class="' +
      chipClass(code, hex) +
      '" style="background-color:' +
      hex +
      '">' +
      '<span class="role">' +
      esc(t(roleKey)) +
      "</span>" +
      '<span class="code">' +
      esc(code) +
      "</span>" +
      "</div>"
    );
  }

  function hlText(pack) {
    if (!pack) return "";
    return pack[state.lang] || pack.en || "";
  }

  function renderHighlights(m) {
    var map = DATA.highlights || {};
    var keys = (m.base || []).filter(function (k) {
      return !!map[k];
    });
    if (!keys.length) return "";
    var items = keys
      .map(function (k) {
        var h = map[k];
        return (
          '<div class="hl-item">' +
          '<div class="hl-title">' +
          esc(hlText(h.title)) +
          "</div>" +
          '<p class="hl-body">' +
          esc(hlText(h.body)) +
          "</p></div>"
        );
      })
      .join("");
    return (
      '<div class="hl-box">' +
      '<p class="section-label">' +
      esc(t("highlight")) +
      "</p>" +
      items +
      "</div>"
    );
  }

  function imageUrl(src) {
    var s = String(src || "");
    if (!s) return "";
    if (/^https?:\/\//i.test(s) || s.charAt(0) === "/") return s;
    return "/cases/outdoor-kitchen/" + s.replace(/^\.\//, "");
  }

  function renderModel(m) {
    var base = m.base
      .map(function (k) {
        return "<li>" + esc(term(k)) + "</li>";
      })
      .join("");
    var opts = m.options
      .map(function (k) {
        return '<span class="opt">' + esc(term(k)) + "</span>";
      })
      .join("");
    return (
      '<article class="model" id="' +
      esc(m.id) +
      '">' +
      '<div class="model-media"><img src="' +
      esc(imageUrl(m.image)) +
      '" alt="' +
      esc(m.code + " " + m.name) +
      '" loading="lazy" /></div>' +
      '<div class="model-body">' +
      '<div class="model-hd"><h2>' +
      esc(m.code + " " + m.name) +
      '</h2><span class="size">' +
      esc(m.size) +
      " mm</span></div>" +
      '<p class="door-line">' +
      esc(DATA.doors[m.series].name) +
      " · " +
      esc(doorLabel(m.series)) +
      "</p>" +
      '<div class="swatches">' +
      renderSwatch("coque", m.coque) +
      renderSwatch("meubles", m.meubles) +
      renderSwatch("countertop", m.countertop) +
      "</div>" +
      renderHighlights(m) +
      '<p class="section-label">' +
      esc(t("base")) +
      "</p>" +
      '<ul class="feat-list">' +
      base +
      "</ul>" +
      '<p class="section-label">' +
      esc(t("options")) +
      "</p>" +
      '<div class="opts">' +
      opts +
      "</div>" +
      "</div></article>"
    );
  }

  function seriesCount(id) {
    return DATA.models.filter(function (m) {
      return m.series === id;
    }).length;
  }

  function blurbOf(id) {
    var d = DATA.doors[id];
    if (!d || !d.blurb) return "";
    return d.blurb[state.lang] || d.blurb.en || "";
  }

  function renderFilters() {
    var doorOpts =
      '<option value="all"' +
      (state.door === "all" ? " selected" : "") +
      ">" +
      esc(t("all")) +
      "</option>" +
      ["mini", "pro", "ultra"]
        .map(function (id) {
          var d = DATA.doors[id];
          var selected = state.door === id ? " selected" : "";
          return (
            '<option value="' +
            id +
            '"' +
            selected +
            ">" +
            esc(d.name + " · " + doorLabel(id)) +
            "</option>"
          );
        })
        .join("");

    var sizeOpts =
      '<option value="all"' +
      (state.size === "all" ? " selected" : "") +
      ">" +
      esc(t("all")) +
      "</option>" +
      DATA.sizes
        .map(function (sz) {
          var selected = String(state.size) === String(sz) ? " selected" : "";
          return (
            '<option value="' +
            sz +
            '"' +
            selected +
            ">" +
            sz +
            " mm</option>"
          );
        })
        .join("");

    return (
      '<div class="filters-row">' +
      '<div class="filter-field">' +
      '<label for="door-select">' +
      esc(t("door")) +
      "</label>" +
      '<select class="filter-select" id="door-select">' +
      doorOpts +
      "</select></div>" +
      '<div class="filter-field">' +
      '<label for="size-select">' +
      esc(t("size")) +
      "</label>" +
      '<select class="filter-select" id="size-select">' +
      sizeOpts +
      "</select></div></div>"
    );
  }

  function renderIntros() {
    var ids =
      state.door === "all" ? ["mini", "pro", "ultra"] : [state.door];
    var cards = ids
      .map(function (id) {
        var d = DATA.doors[id];
        if (!d) return "";
        var featured = state.door !== "all";
        var titleTag = featured ? "h1" : "h2";
        return (
          '<section class="intro' +
          (featured ? " featured" : "") +
          '">' +
          '<div class="intro-badge">' +
          esc(doorLabel(id)) +
          " · " +
          seriesCount(id) +
          " " +
          esc(t("units")) +
          "</div>" +
          "<" +
          titleTag +
          ">" +
          esc(d.name) +
          "</" +
          titleTag +
          ">" +
          '<p class="sub">' +
          esc(blurbOf(id)) +
          "</p></section>"
        );
      })
      .join("");

    var lead =
      state.door === "all"
        ? '<p class="page-lead">' + esc(t("pageIntro")) + "</p>"
        : "";
    return lead + '<div class="intros">' + cards + "</div>";
  }

  function renderContact() {
    var interest = interestText();
    return (
      '<section class="contact-card" id="contact">' +
      "<h3>" +
      esc(t("contactTitle")) +
      "</h3>" +
      '<p class="note">' +
      esc(t("contactNote")) +
      "</p>" +
      (interest
        ? '<p class="interest-line">' + esc(t("interest")) + ": " + esc(interest) + "</p>"
        : "") +
      '<form id="lead-form" autocomplete="on">' +
      '<div class="lead-row">' +
      '<input class="lead-input" name="phone" type="tel" maxlength="20" placeholder="' +
      esc(t("phone")) +
      '" />' +
      '<input class="lead-input" name="social" type="text" maxlength="40" placeholder="' +
      esc(t("social")) +
      '" />' +
      "</div>" +
      '<div class="lead-row">' +
      '<input class="lead-input" name="email" type="email" maxlength="80" placeholder="' +
      esc(t("email")) +
      '" />' +
      '<input class="lead-input" name="name" type="text" maxlength="20" placeholder="' +
      esc(t("name")) +
      '" />' +
      "</div>" +
      '<button class="contact-btn" type="submit"' +
      (state.submitting ? " disabled" : "") +
      ">" +
      esc(state.submitting ? t("submitting") : t("submit")) +
      "</button>" +
      '<p class="lead-msg" id="lead-msg"></p>' +
      "</form></section>"
    );
  }

  function render() {
    var root = document.getElementById("app");
    if (!root) return;
    var list = filteredModels();
    var modelsHtml = list.length
      ? list.map(renderModel).join("")
      : '<p class="empty">' + esc(t("empty")) + "</p>";

    document.title = "Outdoor Kitchen · DD design";
    document.documentElement.lang =
      state.lang === "zh" ? "zh-CN" : state.lang === "fr" ? "fr" : "en";

    root.innerHTML =
      '<div class="page">' +
      '<header class="topbar">' +
      '<div class="topbar-row">' +
      '<div class="topbar-left">' +
      '<a class="home-btn" id="home-btn" href="../../shop.html">' +
      "← " +
      esc(t("home")) +
      "</a>" +
      '<div class="brand">DD design</div>' +
      "</div>" +
      '<div class="topbar-actions">' +
      '<a class="share-btn" id="share-btn" href="' +
      esc(whatsAppHref()) +
      '" rel="noopener noreferrer" aria-label="' +
      esc(t("shareWhatsApp")) +
      '">' +
      esc(t("shareWhatsApp")) +
      "</a>" +
      '<button type="button" class="lang-btn" id="lang-btn" aria-label="Language">' +
      esc(DATA.langLabels[state.lang] || "EN") +
      "</button>" +
      "</div></div>" +
      renderFilters() +
      "</header>" +
      renderIntros() +
      '<p class="meta-line">' +
      list.length +
      " " +
      esc(t("models")) +
      "</p>" +
      '<div class="list">' +
      modelsHtml +
      "</div>" +
      renderContact() +
      "</div>";

    bind();
  }

  function bind() {
    var shareBtn = document.getElementById("share-btn");
    if (shareBtn) {
      shareBtn.addEventListener("click", onShare);
    }

    var langBtn = document.getElementById("lang-btn");
    if (langBtn) {
      langBtn.addEventListener("click", function () {
        var langs = DATA.langs;
        var i = langs.indexOf(state.lang);
        state.lang = langs[(i + 1) % langs.length];
        try {
          localStorage.setItem(LANG_KEY, state.lang);
        } catch (e) {}
        render();
      });
    }

    var doorSel = document.getElementById("door-select");
    if (doorSel) {
      doorSel.addEventListener("change", function () {
        state.door = doorSel.value || "all";
        render();
      });
    }

    var sizeSel = document.getElementById("size-select");
    if (sizeSel) {
      sizeSel.addEventListener("change", function () {
        state.size = sizeSel.value || "all";
        render();
      });
    }

    var form = document.getElementById("lead-form");
    if (form) {
      form.addEventListener("submit", onSubmitLead);
    }
  }

  function setLeadMsg(text, type) {
    var el = document.getElementById("lead-msg");
    if (!el) return;
    el.textContent = text || "";
    el.className = "lead-msg" + (type ? " " + type : "");
  }

  function onSubmitLead(e) {
    e.preventDefault();
    if (state.submitting) return;
    var form = e.target;
    var phone = String(form.phone.value || "").replace(/\s+/g, "").trim();
    var social = String(form.social.value || "").trim();
    var email = String(form.email.value || "").trim();
    var name = String(form.name.value || "").trim();
    if (!phone && !social && !email) {
      setLeadMsg(t("submitNeed"), "err");
      return;
    }

    var btn = form.querySelector(".contact-btn");
    state.submitting = true;
    if (btn) {
      btn.disabled = true;
      btn.textContent = t("submitting");
    }

    var lead = {
      id: "L" + Date.now().toString(36),
      phone: phone,
      social: social,
      email: email,
      name: name,
      door: state.door,
      size: state.size,
      interest: interestText(),
      lang: state.lang,
      source: "cases-outdoor-kitchen",
      createdAt: Date.now()
    };
    try {
      var list = [];
      try {
        list = JSON.parse(localStorage.getItem(LEAD_KEY) || "[]");
      } catch (err) {
        list = [];
      }
      if (!Array.isArray(list)) list = [];
      list.unshift(lead);
      localStorage.setItem(LEAD_KEY, JSON.stringify(list.slice(0, 50)));
    } catch (err2) {}

    state.submitting = false;
    form.reset();
    if (btn) {
      btn.disabled = false;
      btn.textContent = t("submit");
    }
    setLeadMsg(t("submitOk"), "ok");
  }

  function readQuery() {
    var q = {};
    try {
      var sp = new URLSearchParams(location.search || "");
      sp.forEach(function (v, k) {
        q[k] = v;
      });
    } catch (e) {}
    return q;
  }

  function useShortPath() {
    try {
      if (location.pathname.indexOf("/cases/") !== 0) return;
      var params = new URLSearchParams(location.search || "");
      if (state.door && state.door !== "all" && !params.get("door")) params.set("door", state.door);
      if (state.size && state.size !== "all" && !params.get("size")) params.set("size", String(state.size));
      if (state.lang && !params.get("lang")) params.set("lang", state.lang);
      var qs = params.toString();
      history.replaceState(null, "", "/kitchen/" + (qs ? "?" + qs : ""));
    } catch (e) {}
  }

  window.initOutdoorKitchenPage = function (opts) {
    DATA = window.OUTDOOR_KITCHEN;
    opts = opts || {};
    state.lang = DATA.defaultLang || "fr";
    state.door = "all";
    state.size = "all";
    try {
      var saved = localStorage.getItem(LANG_KEY);
      if (saved && DATA.langs.indexOf(saved) >= 0) state.lang = saved;
    } catch (e) {}

    var q = readQuery();
    if (opts.door) state.door = opts.door;
    if (opts.size) state.size = String(opts.size);
    if (q.door && (q.door === "all" || DATA.doors[q.door])) state.door = q.door;
    if (q.size && (q.size === "all" || DATA.sizes.indexOf(Number(q.size)) >= 0)) {
      state.size = q.size === "all" ? "all" : String(q.size);
    }
    if (q.lang && DATA.langs.indexOf(q.lang) >= 0) state.lang = q.lang;

    useShortPath();
    render();
  };
})();
