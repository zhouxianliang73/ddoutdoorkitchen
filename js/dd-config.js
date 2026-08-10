/**
 * DD design · public runtime config
 * Copy config.public.example.json → config.public.json and fill Supabase keys.
 */
(function (global) {
    const DEFAULTS = {
        brand: 'DD design',
        siteUrl: 'https://cloud1-d9gq2eo4oa43266fd-1301307199.tcloudbaseapp.com',
        legacyApp: 'shop.html',
        /** supabase | tencent — 迁移腾讯云时只改此项与 tencent.apiBase */
        apiProvider: 'supabase',
        supabase: { url: '', anonKey: '' },
        tencent: { apiBase: '' },
        imageCdnBase: 'https://scheme-center-images-1301307199.cos.ap-guangzhou.myqcloud.com',
        magicLinkPath: 'p.html',
        adminPath: 'admin.html',
    };

    let cached = null;

    async function loadConfig() {
        if (cached) return cached;
        try {
            const res = await fetch('config.public.json', { cache: 'no-store' });
            if (res.ok) {
                cached = { ...DEFAULTS, ...(await res.json()) };
                return cached;
            }
        } catch (_) { /* local dev without config */ }
        cached = { ...DEFAULTS };
        return cached;
    }

    function getConfigSync() {
        return cached || { ...DEFAULTS };
    }

    global.DDConfig = { loadConfig, getConfigSync, DEFAULTS };
})(window);
