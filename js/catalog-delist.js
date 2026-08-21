/**
 * H5 资源下架规则（与小程序 sc_catalogDelist 对齐）
 * 数据源：Supabase public.catalog_delist（anon 只读）
 * 不经过 Netlify。
 */
(function (global) {
  var CACHE_KEY = 'dd_h5_catalog_delist_v1';
  var CACHE_AT_KEY = 'dd_h5_catalog_delist_at';
  var state = { spaces: [], subs: [], ids: [], loaded: false };

  function emptyState() {
    return { spaces: [], subs: [], ids: [] };
  }

  function stateFromRules(rules) {
    var spaces = [];
    var subs = [];
    var ids = [];
    (rules || []).forEach(function (r) {
      if (!r || !r.value) return;
      var kind = String(r.kind || '');
      var value = String(r.value || '');
      if (kind === 'space' && spaces.indexOf(value) < 0) spaces.push(value);
      if (kind === 'sub' && subs.indexOf(value) < 0) subs.push(value);
      if (kind === 'id' && ids.indexOf(value) < 0) ids.push(value);
    });
    return { spaces: spaces, subs: subs, ids: ids };
  }

  function readCache() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return emptyState();
      var parsed = JSON.parse(raw);
      return {
        spaces: Array.isArray(parsed.spaces) ? parsed.spaces : [],
        subs: Array.isArray(parsed.subs) ? parsed.subs : [],
        ids: Array.isArray(parsed.ids) ? parsed.ids : []
      };
    } catch (e) {
      return emptyState();
    }
  }

  function writeCache(next) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(next || emptyState()));
      localStorage.setItem(CACHE_AT_KEY, String(Date.now()));
    } catch (e) {}
  }

  function getConfig() {
    try {
      if (global.DDConfig && typeof global.DDConfig.getConfigSync === 'function') {
        return global.DDConfig.getConfigSync() || {};
      }
    } catch (e) {}
    return {};
  }

  function isDelisted(product) {
    if (!product) return true;
    var st = state.loaded ? state : readCache();
    if (product.id && st.ids.indexOf(String(product.id)) >= 0) return true;
    if (product.space && st.spaces.indexOf(String(product.space)) >= 0) return true;
    if (product.sub && st.subs.indexOf(String(product.sub)) >= 0) return true;
    return false;
  }

  function filterProducts(list) {
    return (list || []).filter(function (p) {
      return !isDelisted(p);
    });
  }

  async function fetchFromSupabase() {
    var cfg = getConfig();
    var sb = (cfg && cfg.supabase) || {};
    if (!sb.url || !sb.anonKey) throw new Error('supabase_not_configured');
    var url =
      String(sb.url).replace(/\/$/, '') +
      '/rest/v1/catalog_delist?select=id,kind,value,created_at&order=created_at.desc';
    var res = await fetch(url, {
      headers: {
        apikey: sb.anonKey,
        Authorization: 'Bearer ' + sb.anonKey
      },
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('delist_http_' + res.status);
    var rows = await res.json();
    return stateFromRules(rows || []);
  }

  async function fetchFromStatic() {
    var res = await fetch('catalog-delist.json?v=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) throw new Error('static_missing');
    var data = await res.json();
    if (Array.isArray(data)) return stateFromRules(data);
    if (data && Array.isArray(data.rules)) return stateFromRules(data.rules);
    return {
      spaces: Array.isArray(data.spaces) ? data.spaces : [],
      subs: Array.isArray(data.subs) ? data.subs : [],
      ids: Array.isArray(data.ids) ? data.ids : []
    };
  }

  async function load(force) {
    if (!force) {
      try {
        var at = Number(localStorage.getItem(CACHE_AT_KEY) || 0);
        if (at && Date.now() - at < 60 * 1000) {
          state = Object.assign({ loaded: true }, readCache());
          return state;
        }
      } catch (e) {}
    }
    try {
      var next = await fetchFromSupabase();
      state = Object.assign({ loaded: true }, next);
      writeCache(next);
      return state;
    } catch (e1) {
      try {
        var fallback = await fetchFromStatic();
        state = Object.assign({ loaded: true }, fallback);
        writeCache(fallback);
        return state;
      } catch (e2) {
        state = Object.assign({ loaded: true }, readCache());
        return state;
      }
    }
  }

  global.DDCatalogDelist = {
    load: load,
    isDelisted: isDelisted,
    filterProducts: filterProducts,
    getState: function () {
      return state.loaded ? state : readCache();
    }
  };
})(window);
