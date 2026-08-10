/**
 * H5 → 小程序「采购工具」交接（H5 不设采购价页）
 *
 * 路径约定：
 *   /pages/me/me?open=compare&ids={catalogId,...}&slug={可选}&channel={可选}&pid={项目id}
 *
 * 微信后台配置「普通链接二维码 / URL Link」后可一键打开；
 * 未配置时由本脚本弹出路径供复制，或开发期用开发者工具编译模式带参。
 */
(function (global) {
  var MP_APPID = 'wxd4f3f8302726cbd9';
  var STORAGE_HANDOFF = 'dd_compare_handoff';

  function uniq(list) {
    var out = [];
    (list || []).forEach(function (x) {
      var s = String(x || '').trim();
      if (s && out.indexOf(s) < 0) out.push(s);
    });
    return out;
  }

  /** 从小程序路径 query 拼装 */
  function buildCompareMpPath(opts) {
    opts = opts || {};
    var ids = uniq(opts.ids || []);
    var q = ['open=compare'];
    if (ids.length) q.push('ids=' + encodeURIComponent(ids.join(',')));
    if (opts.slug) q.push('slug=' + encodeURIComponent(opts.slug));
    if (opts.channel) q.push('channel=' + encodeURIComponent(opts.channel));
    if (opts.pid) q.push('pid=' + encodeURIComponent(opts.pid));
    return '/pages/me/me?' + q.join('&');
  }

  function isWeChat() {
    return /MicroMessenger/i.test(navigator.userAgent || '');
  }

  function saveHandoffLocal(payload) {
    try {
      localStorage.setItem(
        STORAGE_HANDOFF,
        JSON.stringify(
          Object.assign({}, payload, { at: Date.now(), source: 'h5' })
        )
      );
    } catch (e) { /* ignore */ }
  }

  /**
   * 引导打开小程序采购工具（不在 H5 展示价格）
   * @param {{ ids: string[], slug?: string, channel?: string, pid?: string, projectName?: string }} payload
   * @param {{ onCopy?: function, onToast?: function }} hooks
   */
  function openCompareInMiniProgram(payload, hooks) {
    hooks = hooks || {};
    var ids = uniq(payload && payload.ids);
    if (!ids.length) {
      if (hooks.onToast) hooks.onToast('清单里还没有可交接的产品');
      else alert('清单里还没有可交接的产品');
      return;
    }
    var path = buildCompareMpPath({
      ids: ids,
      slug: payload.slug,
      channel: payload.channel,
      pid: payload.pid
    });
    saveHandoffLocal({
      ids: ids,
      slug: payload.slug || '',
      channel: payload.channel || '',
      pid: payload.pid || '',
      projectName: payload.projectName || ''
    });

    var title = payload.projectName ? '「' + payload.projectName + '」' : '当前清单';
    var msg =
      title +
      ' 已选 ' +
      ids.length +
      ' 项。\n\n' +
      '采购工具仅在小程序内（需登录并经批准）。\n\n' +
      '小程序路径：\n' +
      path +
      '\n\n' +
      (isWeChat()
        ? '请用「打开小程序」或扫运营配置的小程序码进入；进入后自动带上已选产品。'
        : '请用微信扫小程序码，或在开发者工具用上述路径编译打开。');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(path).then(
        function () {
          if (hooks.onCopy) hooks.onCopy(path);
          if (hooks.onToast) hooks.onToast('路径已复制 · 去小程序粘贴/配置打开');
          else alert(msg + '\n\n（路径已复制）');
        },
        function () {
          prompt('复制小程序路径（采购交接）', path);
        }
      );
    } else {
      prompt('复制小程序路径（采购交接）', path);
    }

    return { appId: MP_APPID, path: path, ids: ids };
  }

  global.DDCompareBridge = {
    MP_APPID: MP_APPID,
    STORAGE_HANDOFF: STORAGE_HANDOFF,
    buildCompareMpPath: buildCompareMpPath,
    openCompareInMiniProgram: openCompareInMiniProgram,
    isWeChat: isWeChat
  };
})(typeof window !== 'undefined' ? window : globalThis);
