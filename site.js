// Wires the page to config.js: downloads from the latest GitHub release, the store, GitHub and
// Telegram links, and cookieless visit counting (GoatCounter). Anything not configured is hidden
// or says "Coming soon", so the page is always correct to publish.
(function () {
  var C = window.HUMINT || window.SURVEY_HELPER || {};
  var repo = (C.github || '').replace(/^https?:\/\/github\.com\//, '').replace(/\/+$/, '');
  var gh = repo ? 'https://github.com/' + repo : '';
  var links = {
    github: gh,
    releases: gh && gh + '/releases',
    issues: gh && gh + '/issues',
    telegram: C.telegram || '',
    store: C.storeUrl || '',
    msstore: C.msStoreUrl || '',
  };
  var signedBy = String(C.signedBy || '').trim();
  var have = { github: !!gh, telegram: !!links.telegram, store: !!links.store, msstore: !!links.msstore, signed: !!signedBy, goatcounter: !!C.goatcounter };

  function all(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function named(file, v) { return String(file || '').replace('{v}', v); }
  function external(a, href) { a.href = href; a.target = '_blank'; a.rel = 'noopener'; }
  function soon(a, words) {
    a.removeAttribute('href'); a.classList.add('soon'); a.setAttribute('aria-disabled', 'true');
    var label = a.querySelector('[data-label]') || a;
    label.textContent = words;
  }
  function mb(bytes) { return Math.round(bytes / 1048576) + ' MB'; }

  // Sections and links that need a setting stay hidden until it's filled in (data-needs: all of them);
  // data-unless hides what's no longer true once any of its settings is filled in.
  all('[data-needs]').forEach(function (el) {
    var ok = el.getAttribute('data-needs').split(' ').every(function (k) { return have[k]; });
    if (!ok) el.hidden = true;
  });
  all('[data-unless]').forEach(function (el) {
    if (el.getAttribute('data-unless').split(' ').some(function (k) { return have[k]; })) el.hidden = true;
  });
  all('[data-signed-by]').forEach(function (el) { el.textContent = signedBy; });
  all('[data-link]').forEach(function (a) {
    var href = links[a.getAttribute('data-link')];
    if (href) external(a, href); else a.hidden = true;
  });

  // The store button.
  all('[data-install]').forEach(function (a) {
    if (have.store) external(a, links.store);
    else soon(a, a.classList.contains('sm') ? 'Coming soon' : 'Coming soon to the Chrome Web Store');
  });

  // Downloads: guessed from config.js first, then corrected from the latest release on GitHub.
  function setRelease(r) {
    all('[data-v]').forEach(function (el) { el.textContent = r.version; });
    all('[data-size="app"]').forEach(function (el) { if (r.appSize) el.textContent = r.appSize; });
    all('[data-dl]').forEach(function (a) {
      var url = r[a.getAttribute('data-dl')];
      if (url) { a.href = url; a.classList.remove('soon'); a.removeAttribute('aria-disabled'); }
    });
  }
  if (gh) {
    var v = C.version || '';
    setRelease({
      version: v,
      appSize: C.appSize,
      app: gh + '/releases/download/v' + v + '/' + named(C.appFile, v),
      ext: gh + '/releases/download/v' + v + '/' + named(C.extFile, v),
    });
    latest(function (rel) {
      var r = { version: String(rel.tag_name || v).replace(/^v/, '') };
      (rel.assets || []).forEach(function (f) {
        if (/portable\.exe$/i.test(f.name) || (!r.app && /\.exe$/i.test(f.name))) { r.app = f.browser_download_url; r.appSize = mb(f.size); }
        else if (/\.zip$/i.test(f.name)) r.ext = f.browser_download_url; // the store package: the extension without the docs
      });
      if (!r.app && !r.ext) return; // a release without files: keep the guess
      setRelease(r);
    });
  } else {
    all('[data-dl]').forEach(function (a) { soon(a, 'Download coming soon'); });
  }

  function latest(done) {
    var key = 'humint-release:' + repo, cached = null;
    try { cached = JSON.parse(sessionStorage.getItem(key) || 'null'); } catch (e) { /* storage blocked */ }
    if (cached && Date.now() - cached.at < 10 * 60 * 1000) return done(cached.rel);
    if (!window.fetch) return;
    fetch('https://api.github.com/repos/' + repo + '/releases/latest', { headers: { Accept: 'application/vnd.github+json' } })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (rel) {
        if (!rel) return;
        var slim = { tag_name: rel.tag_name, assets: (rel.assets || []).map(function (f) { return { name: f.name, size: f.size, browser_download_url: f.browser_download_url }; }) };
        try { sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), rel: slim })); } catch (e) { /* fine */ }
        done(slim);
      })
      .catch(function () { /* offline or rate-limited: the guessed links stay */ });
  }

  // Cookieless analytics: page views, plus a named event for each download and community click.
  if (have.goatcounter) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://gc.zgo.at/count.js';
    s.setAttribute('data-goatcounter', 'https://' + C.goatcounter + '.goatcounter.com/count');
    document.head.appendChild(s);
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('[data-track]');
      if (!a || a.classList.contains('soon') || !window.goatcounter || !window.goatcounter.count) return;
      window.goatcounter.count({ path: a.getAttribute('data-track'), title: a.textContent.trim().slice(0, 80), event: true });
    });
  }

  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
})();
