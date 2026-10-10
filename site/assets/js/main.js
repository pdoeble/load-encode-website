/*
  LOAD-ENCODE – minimale Interaktionen.

  Grundsätze: keine Bibliotheken, keine Netzwerkanfragen, keine Speicherung
  von Nutzerdaten. Die Seite bleibt ohne JavaScript bedienbar.
*/
(() => {
  'use strict';

  const root = document.documentElement;
  root.classList.add('js');

  // Bewegungspräferenz des Systems als Datenattribut für spätere Animationen.
  // Ein ausdrücklich gesetztes data-motion="off" bleibt unberührt.
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const applyMotionPreference = () => {
    if (root.dataset.motion === 'off') return;
    root.dataset.motion = motionQuery.matches ? 'reduced' : 'full';
  };
  applyMotionPreference();
  motionQuery.addEventListener('change', applyMotionPreference);

  // Mobile Navigation: Ohne JavaScript bleibt die Liste sichtbar.
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('hauptnavigation');
  if (toggle && nav) {
    const label = toggle.querySelector('.visually-hidden');
    toggle.hidden = false;
    nav.classList.add('site-nav--collapsible');

    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      if (label) label.textContent = open ? 'Navigation schließen' : 'Navigation öffnen';
    };

    toggle.addEventListener('click', () => {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
  }
})();
