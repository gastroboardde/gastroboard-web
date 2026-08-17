/* ==========================================================================
   GastroBoard — Bewegung

   Grundsatz: Die Seite bleibt ohne JavaScript und ohne Bibliotheken voll
   lesbar. Alles hier ist Zugabe, kein Fundament.
   ========================================================================== */

(function () {
  'use strict';

  var jahr = document.getElementById('yr');
  if (jahr) jahr.textContent = new Date().getFullYear();

  var sparsam = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hatGsap = typeof window.gsap !== 'undefined';

  /* --- Kopfzeile: Hintergrund erst nach dem Anscrollen ------------------ */
  var kopf = document.getElementById('top');
  if (kopf) {
    var pruefen = function () { kopf.classList.toggle('stuck', window.scrollY > 40); };
    pruefen();
    window.addEventListener('scroll', pruefen, { passive: true });
  }

  if (sparsam || !hatGsap) return;

  gsap.registerPlugin(ScrollTrigger);

  /* --- Weiches Scrollen ------------------------------------------------- */
  /* Lenis nimmt dem Rad die Härte. Ohne die Bibliothek scrollt die Seite
     ganz normal weiter – deshalb die Prüfung. */
  if (typeof window.Lenis !== 'undefined') {
    var lenis = new Lenis({
      duration: 1.05,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (zeit) { lenis.raf(zeit * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* --- Überschriften zeilenweise aufdecken ------------------------------ */
  /* SplitType zerlegt in Zeilen; jede Zeile bekommt eine Maske, aus der
     der Text hervorfährt. Das wirkt gesetzt statt eingeblendet. */
  var titel = gsap.utils.toArray('[data-split]');

  titel.forEach(function (el) {
    var teile = (typeof window.SplitType !== 'undefined')
      ? new SplitType(el, { types: 'lines', lineClass: 'ln' })
      : null;

    var zeilen = teile ? teile.lines : [el];

    // Jede Zeile in einen Innenläufer packen, damit die Maske greift
    zeilen.forEach(function (zeile) {
      if (zeile.querySelector('span')) return;
      zeile.innerHTML = '<span>' + zeile.innerHTML + '</span>';
    });

    var laeufer = el.querySelectorAll('.ln > span');

    gsap.set(laeufer, { yPercent: 108 });
    gsap.to(laeufer, {
      yPercent: 0,
      duration: 1.05,
      stagger: 0.07,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  /* --- Zeitleiste füllt sich mit dem Tag -------------------------------- */
  var schiene = document.querySelector('.rail i');
  var tag = document.querySelector('.day');
  if (schiene && tag) {
    gsap.to(schiene, {
      height: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: tag,
        start: 'top 55%',
        end: 'bottom 65%',
        scrub: 0.4
      }
    });
  }

  /* --- Der aktive Posten leuchtet auf ----------------------------------- */
  gsap.utils.toArray('.station').forEach(function (station) {
    ScrollTrigger.create({
      trigger: station,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: function (selbst) { station.classList.toggle('live', selbst.isActive); }
    });
  });

  /* --- Bons legen sich auf den Tisch ------------------------------------ */
  gsap.utils.toArray('.slips').forEach(function (gruppe) {
    gsap.from(gruppe.querySelectorAll('.slip'), {
      y: 26,
      opacity: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: gruppe, start: 'top 86%' }
    });
  });

  /* --- Die Rechnung: aus drei Rezepten wird eine Zahl -------------------- */
  /* Das ist der Moment, um den es auf dieser Seite geht. Die drei Rezepte
     melden sich nacheinander, dann zählt das Ergebnis hoch. */
  var rechnung = document.getElementById('merge');
  if (rechnung) {
    var quellen = rechnung.querySelectorAll('[data-src]');
    var zaehler = rechnung.querySelector('[data-count]');
    var stand = { wert: 0 };
    var werte = [4, 6, 11];

    var ablauf = gsap.timeline({
      scrollTrigger: { trigger: rechnung, start: 'top 72%' }
    });

    gsap.set(quellen, { opacity: 0, x: -18 });
    gsap.set(rechnung.querySelector('.result'), { opacity: 0, y: 18 });
    if (zaehler) zaehler.textContent = '0';

    ablauf.to(rechnung.querySelector('.result'), {
      opacity: 1, y: 0, duration: 0.7, ease: 'power3.out'
    });

    quellen.forEach(function (quelle, i) {
      ablauf.to(quelle, {
        opacity: 1, x: 0, duration: 0.5, ease: 'power3.out',
        onStart: function () {
          quelle.classList.add('on');
          if (!zaehler) return;
          gsap.to(stand, {
            wert: werte[i],
            duration: 0.55,
            ease: 'power2.out',
            onUpdate: function () { zaehler.textContent = Math.round(stand.wert); }
          });
        }
      }, i === 0 ? '-=0.3' : '+=0.12');
    });
  }

  /* --- Deklarations-Codes stempeln sich ein ----------------------------- */
  var schluessel = document.getElementById('keys');
  if (schluessel) {
    gsap.from(schluessel.querySelectorAll('.key'), {
      opacity: 0,
      duration: 0.5,
      stagger: { each: 0.03, from: 'start' },
      ease: 'power2.out',
      scrollTrigger: { trigger: schluessel, start: 'top 84%' }
    });
  }

  /* --- Sanftes Springen zu den Ankern ----------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var ziel = document.querySelector(link.getAttribute('href'));
      if (!ziel) return;
      e.preventDefault();
      if (typeof lenis !== 'undefined' && lenis) lenis.scrollTo(ziel, { offset: -70 });
      else ziel.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Nach dem Laden der Schriften stimmen die Zeilenumbrüche erst richtig
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }
})();
