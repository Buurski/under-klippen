/* Tweaks panel — Restaurant Kornmark */
(function () {
  'use strict';

  const TWEAKS = /*EDITMODE-BEGIN*/{
    "accent": "#c8a87a",
    "darkBg": "#1a1208",
    "creamBg": "#f0ede8",
    "displayFont": "Cormorant Garamond",
    "showScrollCue": true,
    "heroSplit": 40
  }/*EDITMODE-END*/;

  let active = false;
  let panel = null;

  function applyTweaks(t) {
    const r = document.documentElement.style;
    r.setProperty('--c-accent', t.accent);
    r.setProperty('--c-dark', t.darkBg);
    r.setProperty('--c-cream', t.creamBg);
    r.setProperty('--f-display', `"${t.displayFont}", Georgia, serif`);

    const cue = document.querySelector('.scroll-cue');
    if (cue) cue.style.display = t.showScrollCue ? '' : 'none';

    const hero = document.querySelector('.hero');
    if (hero && window.innerWidth > 880) hero.style.gridTemplateColumns = `${t.heroSplit}fr ${100 - t.heroSplit}fr`;
  }

  function buildPanel() {
    panel = document.createElement('div');
    panel.id = 'tweaks-panel';
    panel.innerHTML = `
      <div class="tw-head">
        <span>Tweaks</span>
        <button class="tw-close" aria-label="Luk">×</button>
      </div>
      <div class="tw-body">
        <label>Accent
          <input type="color" data-key="accent" value="${TWEAKS.accent}">
        </label>
        <label>Mørk baggrund
          <input type="color" data-key="darkBg" value="${TWEAKS.darkBg}">
        </label>
        <label>Lys baggrund
          <input type="color" data-key="creamBg" value="${TWEAKS.creamBg}">
        </label>
        <label>Display-font
          <select data-key="displayFont">
            <option>Cormorant Garamond</option>
            <option>Cormorant</option>
            <option>Playfair Display</option>
            <option>EB Garamond</option>
          </select>
        </label>
        <label class="tw-row">
          <span>Hero-split (% logo / foto)</span>
          <input type="range" min="30" max="60" step="5" data-key="heroSplit" value="${TWEAKS.heroSplit}">
          <em data-bind="heroSplit">${TWEAKS.heroSplit}</em>
        </label>
        <label class="tw-row tw-toggle">
          <span>Scroll-pil</span>
          <input type="checkbox" data-key="showScrollCue" ${TWEAKS.showScrollCue ? 'checked' : ''}>
        </label>
      </div>
    `;
    document.body.appendChild(panel);

    panel.querySelector('select[data-key="displayFont"]').value = TWEAKS.displayFont;

    panel.querySelector('.tw-close').addEventListener('click', () => {
      panel.classList.remove('is-open');
      window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
    });

    panel.querySelectorAll('input, select').forEach(input => {
      input.addEventListener('input', () => {
        const k = input.dataset.key;
        let v = input.type === 'checkbox' ? input.checked
              : input.type === 'range' ? parseInt(input.value, 10)
              : input.value;
        TWEAKS[k] = v;
        const bound = panel.querySelector(`[data-bind="${k}"]`);
        if (bound) bound.textContent = v;
        applyTweaks(TWEAKS);
        window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
      });
    });
  }

  // Listener FIRST, then announce
  window.addEventListener('message', (e) => {
    if (!e.data || !e.data.type) return;
    if (e.data.type === '__activate_edit_mode') {
      if (!panel) buildPanel();
      panel.classList.add('is-open');
      active = true;
    }
    if (e.data.type === '__deactivate_edit_mode') {
      if (panel) panel.classList.remove('is-open');
      active = false;
    }
  });

  applyTweaks(TWEAKS);
  window.parent.postMessage({ type: '__edit_mode_available' }, '*');

  // Styles
  const css = document.createElement('style');
  css.textContent = `
    #tweaks-panel {
      position: fixed;
      right: 20px;
      bottom: 20px;
      width: 300px;
      background: #1a1208;
      color: #f5f0ea;
      border: 1px solid rgba(200,168,122,0.3);
      font-family: "Outfit", sans-serif;
      font-size: 13px;
      z-index: 9999;
      transform: translateY(20px);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s, transform 0.3s;
    }
    #tweaks-panel.is-open { opacity: 1; transform: none; pointer-events: auto; }
    #tweaks-panel .tw-head {
      display: flex; justify-content: space-between; align-items: center;
      padding: 14px 18px;
      border-bottom: 1px solid rgba(200,168,122,0.2);
      letter-spacing: 0.18em; text-transform: uppercase; font-size: 11px; color: #c8a87a;
    }
    #tweaks-panel .tw-close {
      background: none; border: none; color: #c8a87a; font-size: 22px; cursor: pointer; line-height: 1;
    }
    #tweaks-panel .tw-body { padding: 18px; display: grid; gap: 14px; }
    #tweaks-panel label {
      display: grid; gap: 6px;
      font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(245,240,234,0.7);
    }
    #tweaks-panel input[type="color"] {
      width: 100%; height: 36px; background: transparent; border: 1px solid rgba(200,168,122,0.3); cursor: pointer;
    }
    #tweaks-panel select, #tweaks-panel input[type="range"] {
      width: 100%; background: transparent; color: #f5f0ea;
      border: 1px solid rgba(200,168,122,0.3); padding: 8px; font-family: inherit;
    }
    #tweaks-panel .tw-row { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 8px; }
    #tweaks-panel .tw-row em { color: #c8a87a; font-style: normal; font-size: 13px; }
    #tweaks-panel .tw-toggle input[type="checkbox"] { transform: scale(1.2); }
  `;
  document.head.appendChild(css);
})();
