import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ---------------- Nav: scrolled state + mobile menu ---------------- */
const nav = document.getElementById('nav');
const navLinks = document.getElementById('navLinks');
const navBurger = document.getElementById('navBurger');

ScrollTrigger.create({
  start: 'top -20',
  toggleClass: { targets: nav, className: 'is-scrolled' },
});

navBurger.addEventListener('click', () => {
  navLinks.classList.toggle('is-open');
});
navLinks.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => navLinks.classList.remove('is-open'));
});

/* ---------------- Smooth anchor scrolling ----------------
   Handled by GSAP's ScrollToPlugin instead of CSS scroll-behavior:smooth —
   the CSS version fights with ScrollTrigger's own scroll sampling (a
   documented conflict) and makes the pinned hero feel janky. */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  const targetId = link.getAttribute('href');
  if (!targetId || targetId.length < 2) return;

  link.addEventListener('click', (event) => {
    const target = document.querySelector(targetId);
    if (!target) return;
    event.preventDefault();
    navLinks.classList.remove('is-open');
    gsap.to(window, {
      duration: 1.1,
      ease: 'power2.inOut',
      scrollTo: { y: target, offsetY: 84 },
    });
  });
});

/* ---------------- Generic scroll reveal ----------------
   Every [data-reveal] element gets its hidden state set here (not in CSS)
   and animates in once via ScrollTrigger, reversing if scrolled back up
   past it. */
const REVEAL_FROM = {
  up: { y: 56, opacity: 0 },
  left: { x: -56, opacity: 0 },
  right: { x: 56, opacity: 0 },
  fade: { opacity: 0 },
};

document.querySelectorAll('[data-reveal]').forEach((el) => {
  const dir = el.dataset.reveal;
  const from = REVEAL_FROM[dir] || REVEAL_FROM.up;

  gsap.fromTo(el, from, {
    x: 0,
    y: 0,
    opacity: 1,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 88%',
      toggleActions: 'play none none reverse',
    },
  });
});

/* ---------------- Service cards: staggered cascade + icon parallax ---------------- */
const serviceCards = gsap.utils.toArray('.service-card');
if (serviceCards.length) {
  gsap.set(serviceCards, { opacity: 0, y: 46, scale: 0.94 });

  ScrollTrigger.batch(serviceCards, {
    start: 'top 88%',
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
        overwrite: true,
      }),
    onLeaveBack: (batch) =>
      gsap.to(batch, { opacity: 0, y: 46, scale: 0.94, duration: 0.4, ease: 'power1.in', overwrite: true }),
  });

  gsap.utils.toArray('.service-card__icon').forEach((icon) => {
    gsap.to(icon, {
      yPercent: -22,
      ease: 'none',
      scrollTrigger: {
        trigger: icon,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });

  // hover lift, done in JS since GSAP already owns this element's transform
  serviceCards.forEach((card) => {
    card.addEventListener('mouseenter', () =>
      gsap.to(card, { y: -8, duration: 0.4, ease: 'power2.out', overwrite: 'auto' })
    );
    card.addEventListener('mouseleave', () =>
      gsap.to(card, { y: 0, duration: 0.4, ease: 'power2.out', overwrite: 'auto' })
    );
  });
}

/* ---------------- Trust strip: staggered items + subtle drift ---------------- */
const trustItems = gsap.utils.toArray('.trust__item');
if (trustItems.length) {
  gsap.set(trustItems, { opacity: 0, y: 24 });
  gsap.to(trustItems, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.1,
    scrollTrigger: {
      trigger: '.trust',
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
  });

  trustItems.forEach((item, i) => {
    gsap.to(item, {
      yPercent: i % 2 === 0 ? -12 : 12,
      ease: 'none',
      scrollTrigger: {
        trigger: '.trust',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
}

/* ---------------- Feature ("Über uns") background parallax ---------------- */
const featureParallax = document.getElementById('featureParallax');
if (featureParallax) {
  gsap.to(featureParallax, {
    yPercent: 16,
    ease: 'none',
    scrollTrigger: {
      trigger: '.feature',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
}

/* ---------------- Hours list: staggered reveal ---------------- */
const hoursItems = gsap.utils.toArray('#hoursList li');
if (hoursItems.length) {
  gsap.set(hoursItems, { opacity: 0, x: -24 });
  gsap.to(hoursItems, {
    opacity: 1,
    x: 0,
    duration: 0.6,
    ease: 'power3.out',
    stagger: 0.09,
    scrollTrigger: {
      trigger: '.hours__panel',
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  });
}

/* ---------------- Contact: map/info depth parallax ---------------- */
const contactMap = document.querySelector('.contact__map');
if (contactMap) {
  gsap.to(contactMap, {
    yPercent: -7,
    ease: 'none',
    scrollTrigger: {
      trigger: '.contact__inner',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
}

/* ---------------- Opening hours: live open/closed status ---------------- */
const HOURS = {
  1: [['07:30', '17:00']],
  2: [['07:30', '17:00']],
  3: [['07:30', '17:00']],
  4: [['07:30', '17:00']],
  5: [['07:30', '15:00']],
  6: null, // nach Vereinbarung
  0: null, // geschlossen
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
      : day === 6
        ? 'Heute nach Vereinbarung'
        : day === 0
          ? 'Heute geschlossen'
          : 'Aktuell geschlossen';
  }

  if (list) {
    list.querySelectorAll('li').forEach((li) => {
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
