/**
 * Supabase 实现 · 实现 DDApiContract 定义的能力
 * 迁移到腾讯云后本文件可退役，页面不改。
 */
(function (global) {
  var C = global.DDApiContract;

  function supabaseHeaders(anonKey, extra) {
    return Object.assign({
      apikey: anonKey,
      Authorization: 'Bearer ' + anonKey,
      'Content-Type': 'application/json',
    }, extra || {});
  }

  function isConfigured(config) {
    var sb = (config && config.supabase) || {};
    return !!(sb.url && sb.anonKey && sb.url.indexOf('YOUR_PROJECT') < 0);
  }

  async function rpc(config, fnName, body, accessToken) {
    var sb = config.supabase;
    var headers = supabaseHeaders(sb.anonKey);
    if (accessToken) {
      headers.Authorization = 'Bearer ' + accessToken;
    }
    var res = await fetch(sb.url + '/rest/v1/rpc/' + fnName, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body || {}),
    });
    var text = await res.text();
    var data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      data = text;
    }
    if (!res.ok) {
      var msg = (data && (data.message || data.error)) || res.statusText;
      throw new Error(msg || C.ERROR.REQUEST_FAILED);
    }
    return data;
  }

  async function loginWithPassword(config, email, password) {
    if (!isConfigured(config)) throw new Error(C.ERROR.SUPABASE_NOT_CONFIGURED);
    var sb = config.supabase;
    var res = await fetch(sb.url + '/auth/v1/token?grant_type=password', {
      method: 'POST',
      headers: supabaseHeaders(sb.anonKey),
      body: JSON.stringify({ email: email, password: password }),
    });
    var data = await res.json();
    if (!res.ok) {
      throw new Error((data.error_description || data.msg) || C.ERROR.LOGIN_FAILED);
    }
    return C.normalizeSession(data, 'supabase');
  }

  async function loginWithWechatQr() {
    throw new Error(C.ERROR.WECHAT_LOGIN_NOT_READY);
  }

  async function fetchCurrentMember(config, session) {
    if (!isConfigured(config)) throw new Error(C.ERROR.SUPABASE_NOT_CONFIGURED);
    var sb = config.supabase;
    var userId = session && session.user && session.user.id;
    if (!userId) throw new Error(C.ERROR.NOT_TEAM_MEMBER);

    var data;
    try {
      data = await rpc(config, 'get_my_team_member', {}, session.accessToken);
    } catch (rpcErr) {
      var res = await fetch(
        sb.url + '/rest/v1/team_members?id=eq.' + encodeURIComponent(userId)
          + '&select=id,name,role,wechat_unionid,wechat_openid,auth_provider',
        {
          headers: supabaseHeaders(sb.anonKey, {
            Authorization: 'Bearer ' + session.accessToken,
          }),
        }
      );
      var rows = await res.json();
      if (!res.ok) throw new Error((rows.message) || C.ERROR.REQUEST_FAILED);
      data = rows[0];
    }

    var member = C.normalizeTeamMember(data);
    if (!member) throw new Error(C.ERROR.NOT_TEAM_MEMBER);

    session.user.role = member.role;
    session.user.name = member.name;
    session.user.wechatUnionId = member.wechatUnionId;
    return member;
  }

  async function fetchTeamProjects(config, session) {
    if (!isConfigured(config)) throw new Error(C.ERROR.SUPABASE_NOT_CONFIGURED);
    var sb = config.supabase;
    var res = await fetch(
      sb.url + '/rest/v1/projects?select=id,project_no,client_name,channel,status,access_token,invite_label,updated_at'
        + '&archived=eq.false&order=updated_at.desc',
      {
        headers: supabaseHeaders(sb.anonKey, {
          Authorization: 'Bearer ' + session.accessToken,
        }),
      }
    );
    var data = await res.json();
    if (!res.ok) throw new Error((data.message) || C.ERROR.REQUEST_FAILED);
    return data.map(C.normalizeProjectRow);
  }

  async function createProject(config, session, payload) {
    if (!isConfigured(config)) throw new Error(C.ERROR.SUPABASE_NOT_CONFIGURED);
    var raw = await rpc(config, 'create_live_project', {
      p_client_name: payload.clientName || '',
      p_channel: payload.channel || 'custom',
      p_invite_label: payload.inviteLabel || '',
    }, session.accessToken);
    return C.normalizeCreatedProject(raw);
  }

  async function fetchClientProjectBundle(config, token) {
    if (!isConfigured(config)) throw new Error(C.ERROR.SUPABASE_NOT_CONFIGURED);
    return rpc(config, 'get_client_project_bundle', { p_token: token });
  }

  async function restFetch(config, path, options, accessToken) {
    var sb = config.supabase;
    var headers = supabaseHeaders(sb.anonKey);
    if (accessToken) headers.Authorization = 'Bearer ' + accessToken;
    if (options && options.headers) Object.assign(headers, options.headers);
    var res = await fetch(sb.url + '/rest/v1/' + path, Object.assign({}, options || {}, { headers: headers }));
    var text = await res.text();
    var data;
    try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
    if (!res.ok) throw new Error((data && data.message) || C.ERROR.REQUEST_FAILED);
    return data;
  }

  async function fetchPartnerShopConfig(config, partnerId) {
    if (!isConfigured(config)) throw new Error(C.ERROR.SUPABASE_NOT_CONFIGURED);
    var raw = await rpc(config, 'get_partner_shop_config', { p_partner_id: partnerId });
    return C.normalizePartnerProfile(raw);
  }

  async function submitPartnerApplication(config, payload) {
    if (!isConfigured(config)) throw new Error(C.ERROR.SUPABASE_NOT_CONFIGURED);
    await restFetch(config, 'partner_applications', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({
        email: payload.email || '',
        company_name: payload.companyName || '',
        contact_name: payload.contactName || '',
        partner_type: payload.partnerType || 'dealer',
        default_channel: payload.defaultChannel || 'custom',
        note: payload.note || '',
        status: 'pending',
      }),
    });
  }

  async function fetchPartnerApplications(config, session, status) {
    if (!isConfigured(config)) throw new Error(C.ERROR.SUPABASE_NOT_CONFIGURED);
    var q = 'partner_applications?select=*&order=created_at.desc';
    if (status) q += '&status=eq.' + encodeURIComponent(status);
    var rows = await restFetch(config, q, { method: 'GET' }, session.accessToken);
    return (rows || []).map(C.normalizePartnerApplication);
  }

  async function approvePartnerApplication(config, session, payload) {
    if (!isConfigured(config)) throw new Error(C.ERROR.SUPABASE_NOT_CONFIGURED);
    return rpc(config, 'approve_partner_application', {
      p_application_id: payload.applicationId,
      p_partner_id: payload.partnerId,
      p_auth_user_id: payload.authUserId,
    }, session.accessToken);
  }

  async function fetchMyPartnerProfile(config, session) {
    if (!isConfigured(config)) throw new Error(C.ERROR.SUPABASE_NOT_CONFIGURED);
    var raw = await rpc(config, 'get_my_partner_profile', {}, session.accessToken);
    return C.normalizePartnerProfile(raw);
  }

  async function fetchCurrentPartner(config, session) {
    var profile = await fetchMyPartnerProfile(config, session);
    if (!profile) throw new Error(C.ERROR.NOT_PARTNER);
    session.user.partnerId = profile.id;
    session.user.partnerType = profile.partnerType;
    session.user.name = profile.name || session.user.name;
    return profile;
  }

  async function setPartnerExportItems(config, session, partnerId, catalogIds) {
    if (!isConfigured(config)) throw new Error(C.ERROR.SUPABASE_NOT_CONFIGURED);
    var pid = encodeURIComponent(partnerId);
    await restFetch(config, 'partner_export_items?partner_id=eq.' + pid, {
      method: 'DELETE',
      headers: { Prefer: 'return=minimal' },
    }, session.accessToken);
    var ids = catalogIds || [];
    if (!ids.length) return [];
    await restFetch(config, 'partner_export_items', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify(ids.map(function (cid) {
        return { partner_id: partnerId, catalog_id: cid };
      })),
    }, session.accessToken);
    return ids;
  }

  async function fetchPartnersList(config, session) {
    if (!isConfigured(config)) throw new Error(C.ERROR.SUPABASE_NOT_CONFIGURED);
    var rows = await restFetch(config,
      'partners?select=id,partner_type,name,company_name,default_channel,status,export_supplier_id,export_spaces&status=eq.active&order=name.asc',
      { method: 'GET' },
      session.accessToken);
    return (rows || []).map(function (row) {
      return C.normalizePartnerProfile(Object.assign({}, row, {
        partnerType: row.partner_type,
        companyName: row.company_name,
        defaultChannel: row.default_channel,
        exportSupplierId: row.export_supplier_id,
        exportSpaces: row.export_spaces || [],
      }));
    });
  }

  global.DDApiSupabase = {
    id: 'supabase',
    isConfigured: isConfigured,
    loginWithPassword: loginWithPassword,
    loginWithWechatQr: loginWithWechatQr,
    fetchCurrentMember: fetchCurrentMember,
    fetchTeamProjects: fetchTeamProjects,
    createProject: createProject,
    fetchClientProjectBundle: fetchClientProjectBundle,
    fetchPartnerShopConfig: fetchPartnerShopConfig,
    submitPartnerApplication: submitPartnerApplication,
    fetchPartnerApplications: fetchPartnerApplications,
    approvePartnerApplication: approvePartnerApplication,
    fetchMyPartnerProfile: fetchMyPartnerProfile,
    fetchCurrentPartner: fetchCurrentPartner,
    setPartnerExportItems: setPartnerExportItems,
    fetchPartnersList: fetchPartnersList,
  };
})(window);
