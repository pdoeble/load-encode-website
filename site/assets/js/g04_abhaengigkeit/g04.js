(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var DAUER = 1000;      /* Übergang in ms */
  var HALTEN = 3000;     /* Haltezeit in ms */
  var FUSS = 'Simulierte Werte. Die Einzelverteilungen sind in allen Bildern identisch.';
  var BESCHREIBUNG =
    'Streudiagramm zweier simulierter Lastgrößen A und B, ein Punkt je Wertepaar. Am oberen und ' +
    'rechten Rand stehen die Einzelverteilungen von A und B als Histogramme. Gestrichelte Linien ' +
    'markieren jeweils die oberen 10 Prozent; das Feld oben rechts enthält die Punkte, bei denen ' +
    'beide Größen zugleich hoch sind. Die Bilder wechseln zwischen verschiedenen Arten des ' +
    'Zusammenhangs. Die Einzelverteilungen bleiben dabei gleich, die Zahl der Punkte im Feld ' +
    'ändert sich deutlich.';

  var STIL = [
    '.g04{--g04-struktur:var(--p-struktur,#2b6777);--g04-flaeche:var(--p-flaeche,#c8d8e4);',
    '--g04-akzent:var(--p-akzent,#52ab98);--g04-text:var(--p-text,#1f2a2e);--g04-grund:var(--p-weiss,#fff);',
    'font-family:var(--font-text,Arial,sans-serif);color:var(--g04-text);max-width:760px}',
    '.g04 figure{margin:0}',
    '.g04-wahl{margin:0 0 12px}',
    '.g04-unten{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 16px}',
    '.g04-abspielen{display:flex;gap:4px;flex:none}',
    '.g04-wahl{display:flex;flex-wrap:wrap;gap:4px}',
    '.g04 button{font-family:inherit;font-size:13px;font-weight:500;line-height:1;letter-spacing:0.005em;',
    'display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:32px;margin:0;',
    'padding:0 10px;border:1px solid var(--g04-flaeche);border-radius:4px;background:var(--g04-grund);',
    'color:var(--g04-struktur);cursor:pointer;position:relative;white-space:nowrap}',
    '.g04 button:hover{border-color:var(--g04-struktur)}',
    '.g04 button:focus{outline:none}',
    '.g04 button:focus-visible{outline:2px solid var(--g04-struktur);outline-offset:2px}',
    '.g04 button svg{display:block;flex:none}',
    '.g04-schritt{width:32px;padding:0}',
    '.g04-pause{min-width:84px;justify-content:flex-start}',
    '.g04-chip[aria-pressed="true"]{background:var(--g04-struktur);border-color:var(--g04-struktur);color:#fff}',
    '.g04-lauf{position:absolute;left:3px;right:3px;bottom:2px;height:2px;border-radius:1px;',
    'background:var(--g04-akzent);transform-origin:0 50%;transform:scaleX(0);opacity:0}',
    '.g04[data-g04-laeuft="1"] .g04-chip[aria-pressed="true"] .g04-lauf{opacity:1}',
    '.g04-buehne{position:relative;width:100%}',
    '.g04-buehne svg{display:block;width:100%;height:auto;overflow:visible}',
    '.g04 svg text{font-family:var(--font-text,Arial,sans-serif);fill:var(--g04-struktur)}',
    '.g04 svg .g04-achsentext{fill:var(--g04-text);font-weight:500}',
    '.g04 svg .g04-feldtext{font-weight:600}',
    '.g04-feld{fill:var(--g04-flaeche);fill-opacity:0.38}',
    '.g04-balken{fill:var(--g04-flaeche)}',
    '.g04-balken-oben{fill:var(--g04-struktur)}',
    '.g04-achse{stroke:var(--g04-struktur);stroke-width:1;fill:none;shape-rendering:crispEdges}',
    '.g04-grundlinie{stroke:var(--g04-flaeche);stroke-width:1;fill:none;shape-rendering:crispEdges}',
    '.g04-schwelle{stroke:var(--g04-struktur);stroke-width:1;stroke-dasharray:4 3;fill:none}',
    '.g04-pkt{fill:var(--g04-struktur);fill-opacity:0.5;stroke:none}',
    '.g04-pkt-hoch{fill:var(--g04-akzent);fill-opacity:1;stroke:var(--g04-text);stroke-width:1.25}',
    '.g04-text{margin:14px 0 8px;font-size:15px;line-height:1.5;min-height:3em;max-width:66ch;text-wrap:pretty}',
    '.g04-text strong{font-weight:600}',
    '.g04-fuss{margin:0;font-size:13px;line-height:1.45;color:var(--g04-struktur);flex:1 1 20em}',
    '@media (prefers-reduced-motion: reduce){.g04-lauf{display:none}}'
  ].join('');

  /* Symbole der Knöpfe, 12 × 12 */
  var SYMBOL = {
    pause: '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" focusable="false">' +
      '<rect x="2" y="1.5" width="2.6" height="9" rx="0.6" fill="currentColor"/>' +
      '<rect x="7.4" y="1.5" width="2.6" height="9" rx="0.6" fill="currentColor"/></svg>',
    weiter: '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" focusable="false">' +
      '<path d="M3 1.6 L10.4 6 L3 10.4 Z" fill="currentColor"/></svg>',
    zurueck: '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" focusable="false">' +
      '<path d="M7.8 2 L3.8 6 L7.8 10" fill="none" stroke="currentColor" stroke-width="1.6" ' +
      'stroke-linecap="round" stroke-linejoin="round"/></svg>',
    vor: '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" focusable="false">' +
      '<path d="M4.2 2 L8.2 6 L4.2 10" fill="none" stroke="currentColor" stroke-width="1.6" ' +
      'stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  function stilEinfuegen() {
    if (document.getElementById('g04-stil')) { return; }
    var s = document.createElement('style');
    s.id = 'g04-stil';
    s.textContent = STIL;
    (document.head || document.documentElement).appendChild(s);
  }

  function svgEl(name, attr, eltern) {
    var e = document.createElementNS(NS, name);
    for (var k in attr) { if (Object.prototype.hasOwnProperty.call(attr, k)) { e.setAttribute(k, attr[k]); } }
    if (eltern) { eltern.appendChild(e); }
    return e;
  }

  function htmlEl(name, attr, eltern) {
    var e = document.createElement(name);
    for (var k in attr) { if (Object.prototype.hasOwnProperty.call(attr, k)) { e.setAttribute(k, attr[k]); } }
    if (eltern) { eltern.appendChild(e); }
    return e;
  }

  function text(eltern, x, y, inhalt, klasse, anker, groesse) {
    var t = svgEl('text', { x: r1(x), y: r1(y), 'class': klasse || '', 'font-size': groesse }, eltern);
    if (anker) { t.setAttribute('text-anchor', anker); }
    t.textContent = inhalt;
    return t;
  }

  function r1(v) { return Math.round(v * 10) / 10; }

  function laenge(t) { return t.getComputedTextLength ? t.getComputedTextLength() : t.textContent.length * 6.5; }

  /* Breite eines Textes in der aktuellen Schrift (vorläufiges Element, danach entfernt) */
  function miss(svg, inhalt, groesse, klasse) {
    var t = svgEl('text', { x: 0, y: -100, 'font-size': groesse, 'class': klasse }, svg);
    t.textContent = inhalt;
    var b = laenge(t);
    svg.removeChild(t);
    return b;
  }

  /* Ease-in-out (kubisch) */
  function weich(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function bewegungReduziert() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function optionen(container, n, szenarien) {
    var q;
    try { q = new URLSearchParams(window.location.search); } catch (e) { q = { get: function () { return null; } }; }
    var sz = container.getAttribute('data-g04-szenario') || q.get('szenario') || '1';
    var stand = container.getAttribute('data-g04-standbild') || q.get('standbild');
    var index = 0;
    if (/^[a-z]$/i.test(sz)) {
      for (var i = 0; i < n; i++) { if (szenarien[i].id === sz.toLowerCase()) { index = i; } }
    } else {
      var z = parseInt(sz, 10);
      if (z >= 1 && z <= n) { index = z - 1; }
    }
    return { index: index, standbild: stand === '1' || stand === 'ja' };
  }

  /* Maße in Pixeln; die Zeichenfläche hat immer die echte Breite des Containers,
     damit die Schrift auf allen Breiten ihre Größe behält. */
  function masse(W) {
    var kompakt = W < 600;
    var L = {
      W: W,
      kompakt: kompakt,
      schrift: kompakt ? 11 : 12,
      achsenschrift: kompakt ? 12 : 13,
      oben: 4,
      bandOben: kompakt ? 62 : 80,
      bandRechts: kompakt ? 70 : 100,
      luecke: kompakt ? 6 : 8,
      rechts: kompakt ? 6 : 20,
      links: kompakt ? 26 : 30,
      rand: 7,              /* Abstand der Punkte zu den Achsen */
      streifen: kompakt ? 24 : 28,   /* freier Streifen oben im Diagramm für die Feldbeschriftung */
      rPunkt: kompakt ? 2.6 : 3.1,
      rHoch: kompakt ? 4.2 : 5
    };
    L.x0 = L.links;
    L.x1 = W - L.rechts - L.bandRechts - L.luecke;
    var b = L.x1 - L.x0;
    var h = Math.round(Math.min(330, Math.max(210, b * 0.6)));
    L.y0 = L.oben + L.bandOben + L.luecke;
    L.y1 = L.y0 + h;
    L.H = L.y1 + (kompakt ? 26 : 30);
    return L;
  }

  function vorbereiten(d) {
    var n = d.n, xs = d.xs, ys = d.ys;
    var qa = d.schwelle.a, qb = d.schwelle.b;
    var xmax = xs[n - 1], ymax = ys[n - 1];
    /* Klassenbreiten so, dass die Schwelle genau auf einer Klassengrenze liegt */
    var ma = Math.max(4, Math.round(qa / (xmax / 20)));
    var mb = Math.max(4, Math.round(qb / (ymax / 20)));
    function klassen(werte, breite) {
      var anz = Math.ceil(werte[werte.length - 1] / breite + 1e-9);
      var h = []; for (var i = 0; i < anz; i++) { h.push(0); }
      for (var j = 0; j < werte.length; j++) { h[Math.min(anz - 1, Math.floor(werte[j] / breite))] += 1; }
      return h;
    }
    var wa = qa / ma, wb = qb / mb;
    var ha = klassen(xs, wa), hb = klassen(ys, wb);
    var ziele = d.szenarien.map(function (s) {
      var y = new Float64Array(n);
      for (var k = 0; k < n; k++) { y[k] = ys[s.zuordnung[k]]; }
      return y;
    });
    return {
      n: n, xs: xs, ys: ys, qa: qa, qb: qb,
      xmax: Math.max(xmax, ha.length * wa) * 1.01,
      ymax: Math.max(ymax, hb.length * wb) * 1.01,
      wa: wa, wb: wb, ha: ha, hb: hb,
      hmaxA: Math.max.apply(null, ha), hmaxB: Math.max.apply(null, hb),
      ziele: ziele, szenarien: d.szenarien
    };
  }

  function zeichne(z) {
    var V = z.V;
    var W = Math.max(300, Math.round(z.buehne.clientWidth || 720));
    var L = masse(W);
    z.L = L;
    var svg = z.svg;
    while (svg.firstChild) { svg.removeChild(svg.firstChild); }
    svg.setAttribute('width', W);
    svg.setAttribute('height', L.H);
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + L.H);

    var s = L.schrift;
    function sx(v) { return L.x0 + L.rand + v / V.xmax * (L.x1 - L.x0 - 2 * L.rand); }
    var qx = sx(V.qa);

    /* Feldbeschriftung: passt sie nicht in eine Zeile, zweizeilig mit höherem freiem Streifen */
    var FELD = 'beide zugleich hoch';
    var zweizeilig = miss(svg, FELD, s, 'g04-feldtext') > L.x1 - qx - 14;
    var streifen = L.streifen + (zweizeilig ? s + 3 : 0);
    function sy(v) { return L.y1 - L.rand - v / V.ymax * (L.y1 - L.y0 - L.rand - streifen); }
    z.sx = sx; z.sy = sy;
    var qy = sy(V.qb);
    var bandX = L.x1 + L.luecke, bandX1 = bandX + L.bandRechts;
    var basisOben = L.oben + L.bandOben;

    /* Feld „beide zugleich hoch“ */
    svgEl('rect', { x: r1(qx), y: L.y0, width: r1(L.x1 - qx), height: r1(qy - L.y0), 'class': 'g04-feld' }, svg);

    /* Histogramm A (oben) */
    var gA = svgEl('g', {}, svg);
    var hoeheMax = L.bandOben - (L.kompakt ? 18 : 22);
    for (var i = 0; i < V.ha.length; i++) {
      if (!V.ha[i]) { continue; }
      var xa = sx(i * V.wa), xb = sx((i + 1) * V.wa);
      var hh = V.ha[i] / V.hmaxA * hoeheMax;
      svgEl('rect', {
        x: r1(xa + 0.5), y: r1(basisOben - hh), width: r1(Math.max(0.5, xb - xa - 1)), height: r1(hh),
        'class': (i + 0.5) * V.wa > V.qa ? 'g04-balken g04-balken-oben' : 'g04-balken'
      }, gA);
    }
    /* Histogramm B (rechts) */
    var gB = svgEl('g', {}, svg);
    var laengeMax = L.bandRechts * 0.9;
    for (var j = 0; j < V.hb.length; j++) {
      if (!V.hb[j]) { continue; }
      var ya = sy(j * V.wb), yb = sy((j + 1) * V.wb);
      var ll = V.hb[j] / V.hmaxB * laengeMax;
      svgEl('rect', {
        x: bandX, y: r1(yb + 0.5), width: r1(ll), height: r1(Math.max(0.5, ya - yb - 1)),
        'class': (j + 0.5) * V.wb > V.qb ? 'g04-balken g04-balken-oben' : 'g04-balken'
      }, gB);
    }

    /* Grundlinien der Histogramme */
    svgEl('path', { d: 'M' + L.x0 + ' ' + (basisOben + 0.5) + 'H' + L.x1, 'class': 'g04-grundlinie' }, svg);
    svgEl('path', { d: 'M' + (bandX - 0.5) + ' ' + (L.y0 + streifen) + 'V' + L.y1, 'class': 'g04-grundlinie' }, svg);

    /* Schwellen (90-%-Quantil je Größe) */
    svgEl('line', { x1: r1(qx), y1: L.oben, x2: r1(qx), y2: L.y1, 'class': 'g04-schwelle' }, svg);
    svgEl('line', { x1: L.x0, y1: r1(qy), x2: bandX1, y2: r1(qy), 'class': 'g04-schwelle' }, svg);

    /* Achsen */
    svgEl('path', { d: 'M' + (L.x0 + 0.5) + ' ' + L.y0 + 'V' + (L.y1 + 0.5) + 'H' + L.x1, 'class': 'g04-achse' }, svg);

    /* Punkte: normale Ebene, darüber die hervorgehobene Ebene */
    z.gNormal = svgEl('g', {}, svg);
    z.gHoch = svgEl('g', {}, svg);
    z.kreise = [];
    z.hoch = [];
    for (var k = 0; k < V.n; k++) {
      var c = svgEl('circle', { cx: r1(sx(V.xs[k])), cy: r1(sy(z.yJetzt[k])), r: L.rPunkt, 'class': 'g04-pkt' }, z.gNormal);
      z.kreise.push(c);
      z.hoch.push(false);
    }

    /* Beschriftungen */
    var zeileOben = L.oben + s;
    var zeileFeld = L.y0 + s + 6;
    text(svg, L.x0 + L.rand, zeileOben, 'Einzelverteilung A', '', 'start', s);
    var tObenA = text(svg, qx + 6, zeileOben, 'obere 10 %', '', 'start', s);
    text(svg, bandX1, qy - 6, 'obere 10 %', '', 'end', s);
    /* Histogramm B: breit oben im eigenen Band, schmal rechts in der Kopfzeile */
    var nameB = 'Einzelverteilung B';
    if (!L.kompakt) {
      if (miss(svg, nameB, s, '') > W - bandX - 4) { nameB = 'Verteilung B'; }
      text(svg, bandX + 3, zeileFeld, nameB, '', 'start', s);
    } else {
      var frei = bandX1 - (qx + 6 + laenge(tObenA) + 12);
      if (miss(svg, nameB, s, '') > frei) { nameB = 'Verteilung B'; }
      text(svg, bandX1, zeileOben, nameB, '', 'end', s);
    }
    var tFeld = text(svg, qx + 7, zeileFeld, zweizeilig ? '' : FELD, 'g04-feldtext', 'start', s);
    if (zweizeilig) {
      svgEl('tspan', { x: r1(qx + 7) }, tFeld).textContent = 'beide zugleich';
      svgEl('tspan', { x: r1(qx + 7), dy: s + 3 }, tFeld).textContent = 'hoch';
    }
    text(svg, L.x1, L.y1 + L.achsenschrift + 9, 'Lastgröße A →', 'g04-achsentext', 'end', L.achsenschrift);
    var tY = text(svg, 0, 0, 'Lastgröße B →', 'g04-achsentext', 'end', L.achsenschrift);
    tY.setAttribute('transform', 'translate(' + (L.x0 - 9) + ' ' + L.y0 + ') rotate(-90)');

    setzePunkte(z);
  }

  function setzePunkte(z) {
    var V = z.V, L = z.L;
    for (var k = 0; k < V.n; k++) {
      var c = z.kreise[k];
      c.setAttribute('cy', r1(z.sy(z.yJetzt[k])));
      var hoch = V.xs[k] > V.qa && z.yJetzt[k] > V.qb;
      if (hoch !== z.hoch[k]) {
        z.hoch[k] = hoch;
        c.setAttribute('r', hoch ? L.rHoch : L.rPunkt);
        c.setAttribute('class', hoch ? 'g04-pkt g04-pkt-hoch' : 'g04-pkt');
        (hoch ? z.gHoch : z.gNormal).appendChild(c);
      }
    }
  }

  function laeuft(z) { return z.spielt && z.sichtbar && !document.hidden; }

  function lauf(z) {
    var jetzt = laeuft(z);
    if (z.lief && !jetzt && z.halteStart !== null) {
      z.halteBisher += performance.now() - z.halteStart;
      z.halteStart = null;
    }
    if (!z.lief && jetzt) { z.halteStart = null; }
    z.lief = jetzt;
    z.container.setAttribute('data-g04-laeuft', jetzt ? '1' : '0');
    anstossen(z);
  }

  function anstossen(z) {
    if (z.raf) { return; }
    if (!z.uebergang && !laeuft(z)) { return; }
    z.raf = window.requestAnimationFrame(function (t) { schleife(z, t); });
  }

  function fortschritt(z, f) {
    var b = z.chips[z.index].querySelector('.g04-lauf');
    if (b) { b.style.transform = 'scaleX(' + Math.max(0, Math.min(1, f)).toFixed(3) + ')'; }
  }

  function schleife(z, t) {
    z.raf = 0;
    var weiter = false;
    if (z.uebergang) {
      var u = z.uebergang;
      var p = Math.max(0, Math.min(1, (t - u.start) / DAUER));
      var e = weich(p);
      for (var k = 0; k < z.V.n; k++) { z.yJetzt[k] = u.von[k] + (u.nach[k] - u.von[k]) * e; }
      setzePunkte(z);
      if (p >= 1) { z.uebergang = null; z.halteStart = null; z.halteBisher = 0; } else { weiter = true; }
    }
    if (!z.uebergang && laeuft(z)) {
      if (z.halteStart === null) { z.halteStart = t; }
      var f = (z.halteBisher + t - z.halteStart) / HALTEN;
      fortschritt(z, f);
      if (f >= 1) { geheZu(z, z.index + 1, false); }
      weiter = true;
    }
    if (weiter) { anstossen(z); }
  }

  function beschrifte(z) {
    var s = z.V.szenarien[z.index];
    for (var i = 0; i < z.chips.length; i++) {
      z.chips[i].setAttribute('aria-pressed', i === z.index ? 'true' : 'false');
      var b = z.chips[i].querySelector('.g04-lauf');
      if (b) { b.style.transform = 'scaleX(0)'; }
    }
    z.textName.textContent = s.name + '.';
    z.textSatz.textContent = ' ' + s.satz;
  }

  function geheZu(z, i, vonHand) {
    var n = z.V.szenarien.length;
    i = ((i % n) + n) % n;
    if (vonHand && z.spielt) { setzeSpielen(z, false); }
    z.index = i;
    var ziel = z.V.ziele[i];
    z.halteStart = null;
    z.halteBisher = 0;
    if (z.ohneBewegung) {
      z.uebergang = null;
      z.yJetzt.set(ziel);
      setzePunkte(z);
    } else {
      z.uebergang = { start: performance.now(), von: Float64Array.from(z.yJetzt), nach: ziel };
    }
    beschrifte(z);
    anstossen(z);
  }

  function setzeSpielen(z, an) {
    z.spielt = an;
    z.knopfPause.innerHTML = (an ? SYMBOL.pause : SYMBOL.weiter) + '<span>' + (an ? 'Pause' : 'Weiter') + '</span>';
    z.knopfPause.setAttribute('aria-label', an ? 'Automatischen Wechsel anhalten' : 'Automatischen Wechsel fortsetzen');
    /* Während des automatischen Wechsels keine Ansage bei jedem Bild (Muster „Karussell“) */
    z.text.setAttribute('aria-live', an ? 'off' : 'polite');
    lauf(z);
  }

  function init(container, daten) {
    if (!daten || container.getAttribute('data-g04-init')) { return; }
    container.setAttribute('data-g04-init', '1');
    stilEinfuegen();
    var V = vorbereiten(daten);
    var opt = optionen(container, V.szenarien.length, V.szenarien);
    var reduziert = bewegungReduziert();

    var z = {
      container: container, V: V, index: opt.index,
      standbild: opt.standbild,
      ohneBewegung: opt.standbild || reduziert,
      spielt: false, sichtbar: true, lief: false,
      halteStart: null, halteBisher: 0, uebergang: null, raf: 0,
      yJetzt: Float64Array.from(V.ziele[opt.index])
    };

    container.textContent = '';
    var fig = htmlEl('figure', {}, container);
    var wahl = htmlEl('div', { 'class': 'g04-wahl', role: 'group', 'aria-label': 'Art des Zusammenhangs wählen' }, fig);
    z.chips = V.szenarien.map(function (s, i) {
      var b = htmlEl('button', { type: 'button', 'class': 'g04-chip', 'aria-pressed': 'false' }, wahl);
      b.appendChild(document.createTextNode(s.name));
      htmlEl('span', { 'class': 'g04-lauf', 'aria-hidden': 'true' }, b);
      b.addEventListener('click', function () { geheZu(z, i, true); });
      return b;
    });

    z.buehne = htmlEl('div', { 'class': 'g04-buehne' }, fig);
    z.svg = svgEl('svg', { role: 'img', 'aria-label': BESCHREIBUNG, focusable: 'false' }, z.buehne);

    var cap = htmlEl('figcaption', {}, fig);
    z.text = htmlEl('p', { 'class': 'g04-text', 'aria-live': 'polite' }, cap);
    z.textName = htmlEl('strong', {}, z.text);
    z.textSatz = document.createTextNode('');
    z.text.appendChild(z.textSatz);
    var unten = htmlEl('div', { 'class': 'g04-unten' }, cap);
    htmlEl('p', { 'class': 'g04-fuss' }, unten).textContent = FUSS;
    var abspielen = htmlEl('div', { 'class': 'g04-abspielen', role: 'group', 'aria-label': 'Wiedergabe' }, unten);
    z.knopfPause = htmlEl('button', { type: 'button', 'class': 'g04-pause' }, abspielen);
    var zurueck = htmlEl('button', { type: 'button', 'class': 'g04-schritt', 'aria-label': 'Vorheriges Bild', title: 'Vorheriges Bild' }, abspielen);
    zurueck.innerHTML = SYMBOL.zurueck;
    var vor = htmlEl('button', { type: 'button', 'class': 'g04-schritt', 'aria-label': 'Nächstes Bild', title: 'Nächstes Bild' }, abspielen);
    vor.innerHTML = SYMBOL.vor;

    z.knopfPause.addEventListener('click', function () { setzeSpielen(z, !z.spielt); });
    zurueck.addEventListener('click', function () { geheZu(z, z.index - 1, true); });
    vor.addEventListener('click', function () { geheZu(z, z.index + 1, true); });

    /* Pfeiltasten auf den Bedienelementen: Bild zurück / vor */
    var tasten = function (ev) {
      if (ev.key !== 'ArrowLeft' && ev.key !== 'ArrowRight') { return; }
      ev.preventDefault();
      geheZu(z, z.index + (ev.key === 'ArrowLeft' ? -1 : 1), true);
      if (ev.target && ev.target.classList && ev.target.classList.contains('g04-chip')) { z.chips[z.index].focus(); }
    };
    wahl.addEventListener('keydown', tasten);
    abspielen.addEventListener('keydown', tasten);

    beschrifte(z);
    zeichne(z);
    setzeSpielen(z, !z.ohneBewegung);

    /* nur abspielen, solange sichtbar */
    if ('IntersectionObserver' in window && !z.standbild) {
      new IntersectionObserver(function (eintraege) {
        z.sichtbar = eintraege[eintraege.length - 1].isIntersecting;
        lauf(z);
      }, { threshold: 0.25 }).observe(container);
    }
    document.addEventListener('visibilitychange', function () { lauf(z); });
    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      var wechsel = function () {
        z.ohneBewegung = z.standbild || mq.matches;
        if (mq.matches && z.spielt) { setzeSpielen(z, false); }
      };
      if (mq.addEventListener) { mq.addEventListener('change', wechsel); } else if (mq.addListener) { mq.addListener(wechsel); }
    }

    /* Neuzeichnen bei geänderter Breite */
    var breite = z.buehne.clientWidth;
    if ('ResizeObserver' in window) {
      new ResizeObserver(function () {
        var b = z.buehne.clientWidth;
        if (b && Math.abs(b - breite) >= 1) { breite = b; zeichne(z); }
      }).observe(z.buehne);
    }

    /* nach dem Laden der Schriften neu messen und zeichnen */
    var fertig = function () { zeichne(z); container.setAttribute('data-g04-bereit', '1'); };
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(fertig, fertig); } else { fertig(); }
  }

  function alle() {
    var daten = window.G04_DATEN;
    var ziele = document.querySelectorAll('[data-g04]');
    for (var i = 0; i < ziele.length; i++) { init(ziele[i], daten); }
  }

  window.G04 = { init: init };
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', alle); } else { alle(); }
})();
