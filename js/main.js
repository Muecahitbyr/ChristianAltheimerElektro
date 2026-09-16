(() => {
  'use strict';

  /* ---------------- Nav: scrolled state + mobile menu ---------------- */
  const nav = document.getElementById('nav');
  const navLinks = document.getElementById('navLinks');
  const navBurger = document.getElementById('navBurger');

  const onScrollNav = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 20);
  };
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  navBurger.addEventListener('click', () => {
    navLinks.classList.toggle('is-open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('is-open'));
  });

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------- Hours list: staggered reveal ---------------- */
  const hoursItems = document.querySelectorAll('#hoursList li');
  const hoursObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        hoursItems.forEach((li, i) => {
          setTimeout(() => li.classList.add('is-visible'), i * 90);
        });
        hoursObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });
  const hoursPanel = document.querySelector('.hours__panel');
  if (hoursPanel) hoursObserver.observe(hoursPanel);

  /* ---------------- Parallax: feature background ---------------- */
  const featureParallax = document.getElementById('featureParallax');
  const feature = document.querySelector('.feature');

  let ticking = false;
  const updateParallax = () => {
    if (feature && featureParallax) {
      const rect = feature.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top < vh && rect.bottom > 0) {
        const progress = (vh - rect.top) / (vh + rect.height);
        const shift = (progress - 0.5) * 120;
        featureParallax.style.transform = `translate3d(0, ${shift}px, 0)`;
      }
    }

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
  updateParallax();

  /* ---------------- Opening hours: live open/closed status ---------------- */
  const HOURS = {
    1: [['07:30', '17:00']],
    2: [['07:30', '17:00']],
    3: [['07:30', '17:00']],
    4: [['07:30', '17:00']],
    5: [['07:30', '15:00']],
    6: null,   // nach Vereinbarung
    0: null,   // geschlossen
  };

  const dot = document.getElementById('hoursDot');
  const statusText = document.getElementById('hoursStatusText');
  const list = document.getElementById('hoursList');

  const setLiveStatus = () => {
    const now = new Date();
    const day = now.getDay();
    const minutesNow = now.getHours() * 60 + now.getMinutes();
    const ranges = HOURS[day];

    let isOpen = false;
    if (ranges) {
      isOpen = ranges.some(([start, end]) => {
        const [sh, sm] = start.split(':').map(Number);
        const [eh, em] = end.split(':').map(Number);
        return minutesNow >= sh * 60 + sm && minutesNow <= eh * 60 + em;
      });
    }

    if (dot) dot.className = 'hours__dot ' + (isOpen ? 'open' : 'closed');
    if (statusText) {
      statusText.textContent = isOpen
        ? 'Jetzt geöffnet'
        : (day === 6 ? 'Heute nach Vereinbarung' : (day === 0 ? 'Heute geschlossen' : 'Aktuell geschlossen'));
    }

    if (list) {
      list.querySelectorAll('li').forEach(li => {
        li.classList.toggle('today', Number(li.dataset.day) === day);
      });
    }
  };
  setLiveStatus();
  setInterval(setLiveStatus, 60 * 1000);

  /* ---------------- Reviews marquee (real reviews, duplicated for a seamless loop) ---------------- */
  const REVIEWS = [
    {
      name: 'Sven Eckart',
      meta: '1 Rezension · vor 8 Jahren',
      text: 'Wo die feinen Herrschaften keine Lust hatten, einen Backofen anzuschließen (Problem mit dem Starkstromanschluss), war Herr Altheimer sofort zur Stelle und konnte umgehend helfen. Nur zu empfehlen!',
      stars: 5,
    },
    {
      name: 'Dom Era',
      meta: 'Local Guide · 28 Rezensionen · vor 3 Jahren',
      text: 'Schnelle und unkomplizierte Abwicklung. Hält Termine ein und ruft auch bei Bedarf zurück. Sehr professionell. Nur zu empfehlen.',
      stars: 5,
    },
    {
      name: 'Ralf Wachter',
      meta: 'Local Guide · 190 Rezensionen · vor 6 Jahren',
      text: 'Extrem zuverlässig, schnell und kompetent! Ansprechbarkeit, Pünktlichkeit, Qualität, Wert — alles top.',
      stars: 5,
    },
    {
      name: 'Martin Werner',
      meta: '6 Rezensionen · vor 8 Jahren',
      text: 'Schnelle und saubere Arbeit. Nimmt sich auch kleineren Arbeiten an. Gerne wieder!',
      stars: 5,
    },
    {
      name: 'Florian Effenberger',
      meta: 'Local Guide · vor einem Monat',
      text: 'Hervorragender Preis. Sehr schneller Termin, sehr freundlich, kam auch für eine vergleichsweise kleine Sache sofort. Problem sofort gefunden und direkt behoben — bei einem mehr als fairen Preis.',
      stars: 5,
    },
    {
      name: 'Iris Schwarz',
      meta: '1 Rezension · vor 5 Jahren',
      text: 'Sehr zuvorkommend und fachlich top beraten — jederzeit wieder.',
      stars: 5,
    },
  ];

  const AVATAR_COLORS = ['#ffb100', '#3b82f6', '#ff5f6d', '#30d158', '#a855f7', '#ff9f0a'];

  const buildCard = (review, idx) => {
    const card = document.createElement('article');
    card.className = 'review-card';
    const initial = review.name.trim().charAt(0).toUpperCase();
    const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
    card.innerHTML = `
      <div class="review-card__head">
        <div class="review-card__avatar" style="background:${color}">${initial}</div>
        <div>
          <div class="review-card__name">${review.name}</div>
          <div class="review-card__meta">${review.meta}</div>
        </div>
      </div>
      <div class="review-card__stars" aria-hidden="true">${'★'.repeat(review.stars)}${'☆'.repeat(5 - review.stars)}</div>
      <p class="review-card__text">${review.text}</p>
    `;
    return card;
  };

  const fillTrack = (trackEl, reviews) => {
    if (!trackEl) return;
    // duplicate the set twice back-to-back so translateX(-50%) loops seamlessly forever
    [...reviews, ...reviews].forEach((review, i) => {
      trackEl.appendChild(buildCard(review, i));
    });
  };

  fillTrack(document.getElementById('marqueeLeft'), REVIEWS);
  fillTrack(document.getElementById('marqueeRight'), [...REVIEWS].reverse());

  /* ---------------- Footer year ---------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
