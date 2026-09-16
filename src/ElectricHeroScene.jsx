import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import './ElectricHeroScene.css';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// Anchor points live in the same 0–100 percentage space as the hidden
// <svg viewBox="0 0 100 100"> paths below, so the whole scene (positions,
// path curvature, everything) scales responsively with the stage — no
// per-breakpoint coordinate tables needed.
const POS = {
  box: { left: 50, top: 42 },
  socket: { left: 22, top: 78 },
  switchEl: { left: 78, top: 78 },
  bulb: { left: 50, top: 15 },
};

export default function ElectricHeroScene() {
  const stageRef = useRef(null);
  const blobARef = useRef(null);
  const blobBRef = useRef(null);
  const flashRef = useRef(null);

  const boxRef = useRef(null);
  const boxGlowRef = useRef(null);
  const cable1Ref = useRef(null);
  const cable2Ref = useRef(null);
  const cable3Ref = useRef(null);

  const pulseRef = useRef(null);

  const socketRef = useRef(null);
  const socketGlowRef = useRef(null);
  const switchRef = useRef(null);
  const switchGlowRef = useRef(null);
  const bulbRef = useRef(null);
  const bulbGlowRef = useRef(null);

  const sceneGroupRef = useRef(null);
  const heroTextRef = useRef(null);
  const scrollcueRef = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      { isDesktop: '(min-width: 900px)', isMobile: '(max-width: 899px)' },
      (context) => {
        const { isDesktop } = context.conditions;

        const box = boxRef.current;
        const boxGlow = boxGlowRef.current;
        const cables = [cable1Ref.current, cable2Ref.current, cable3Ref.current];
        const pulse = pulseRef.current;
        const socket = socketRef.current;
        const socketGlow = socketGlowRef.current;
        const switchEl = switchRef.current;
        const switchGlow = switchGlowRef.current;
        const bulb = bulbRef.current;
        const bulbGlow = bulbGlowRef.current;
        const blobA = blobARef.current;
        const blobB = blobBRef.current;
        const flash = flashRef.current;
        const heroItems = heroTextRef.current.querySelectorAll('.reveal-item');

        const cableBlur = isDesktop ? 10 : 6;

        /* ---------------- initial (t=0) state ---------------- */
        gsap.set(box, {
          left: `${POS.box.left}%`,
          top: `${POS.box.top}%`,
          xPercent: -50,
          yPercent: -50,
          scale: 1,
          opacity: 1,
          filter: 'brightness(1)',
        });

        gsap.set(cables, {
          top: 0,
          left: 0,
          xPercent: -50,
          yPercent: -50,
          opacity: 0,
          filter: `blur(${cableBlur}px)`,
        });
        gsap.set(cable1Ref.current, { scale: 0.55, rotation: -32 });
        gsap.set(cable2Ref.current, { scale: 0.5, rotation: 26 });
        gsap.set(cable3Ref.current, { scale: 0.5, rotation: 14 });

        gsap.set([boxGlow, socketGlow, switchGlow, bulbGlow], { opacity: 0, scale: 0.6 });
        gsap.set(boxGlow, { left: `${POS.box.left}%`, top: `${POS.box.top}%`, xPercent: -50, yPercent: -50 });
        gsap.set(socketGlow, { left: `${POS.socket.left}%`, top: `${POS.socket.top}%`, xPercent: -50, yPercent: -50 });
        gsap.set(switchGlow, { left: `${POS.switchEl.left}%`, top: `${POS.switchEl.top}%`, xPercent: -50, yPercent: -50 });
        gsap.set(bulbGlow, { left: `${POS.bulb.left}%`, top: `${POS.bulb.top}%`, xPercent: -50, yPercent: -50, scale: 0.3 });

        gsap.set(pulse, {
          left: `${POS.box.left}%`,
          top: `${POS.box.top}%`,
          xPercent: -50,
          yPercent: -50,
          opacity: 0,
          scale: 0.3,
        });

        gsap.set(socket, { left: `${POS.socket.left}%`, top: `${POS.socket.top}%`, xPercent: -50, yPercent: -50, opacity: 0, scale: 0.7, filter: 'blur(6px)' });
        gsap.set(switchEl, { left: `${POS.switchEl.left}%`, top: `${POS.switchEl.top}%`, xPercent: -50, yPercent: -50, opacity: 0, scale: 0.7, filter: 'blur(6px)' });
        gsap.set(bulb, { left: `${POS.bulb.left}%`, top: `${POS.bulb.top}%`, xPercent: -50, yPercent: -50, opacity: 0, scale: 0.7, filter: 'blur(6px) brightness(.5)' });

        gsap.set(heroItems, { opacity: 0, y: 40 });
        gsap.set(flash, { opacity: 0 });

        /* ---------------- master timeline ---------------- */
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: {
            trigger: stageRef.current,
            start: 'top top',
            end: () => '+=' + Math.round(window.innerHeight * (isDesktop ? 4.6 : 3.6)),
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // fade the "scroll" cue as soon as the sequence starts
        tl.to(scrollcueRef.current, { opacity: 0, duration: 0.25, ease: 'power1.out' }, 0);

        /* 1) cables fly in from different directions and connect */
        tl.addLabel('cables', 0)
          .to(cable1Ref.current, {
            motionPath: { path: '#cablePathTL', align: '#cablePathTL', alignOrigin: [0.5, 0.5], autoRotate: false },
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.15,
          }, 'cables')
          .to(cable1Ref.current, { rotation: -6, duration: 1.15, ease: 'power3.out' }, 'cables')

          .to(cable2Ref.current, {
            motionPath: { path: '#cablePathTR', align: '#cablePathTR', alignOrigin: [0.5, 0.5], autoRotate: false },
            opacity: 1,
            scale: 0.95,
            filter: 'blur(0px)',
            duration: 1.05,
          }, 'cables+=0.14')
          .to(cable2Ref.current, { rotation: 5, duration: 1.05, ease: 'power3.out' }, 'cables+=0.14')

          .to(cable3Ref.current, {
            motionPath: { path: '#cablePathB', align: '#cablePathB', alignOrigin: [0.5, 0.5], autoRotate: false },
            opacity: 1,
            scale: 1.02,
            filter: 'blur(0px)',
            duration: 1.3,
          }, 'cables+=0.26')
          .to(cable3Ref.current, { rotation: 3, duration: 1.3, ease: 'power3.out' }, 'cables+=0.26');

        /* 2) the fuse box reacts — a small physical "power on" jolt */
        tl.addLabel('powerOn', 'cables+=1.55')
          .to(box, { scale: 1.045, duration: 0.12, ease: 'power1.inOut' }, 'powerOn')
          .to(box, { y: '-=3', duration: 0.08, ease: 'power1.inOut' }, 'powerOn')
          .to(box, { y: '+=3', scale: 1, duration: 0.18, ease: 'power1.inOut' }, 'powerOn+=0.12')
          .to(box, { filter: 'brightness(1.55)', duration: 0.1, ease: 'power1.inOut' }, 'powerOn')
          .to(box, { filter: 'brightness(1)', duration: 0.32, ease: 'power1.inOut' }, 'powerOn+=0.15')
          .to(boxGlow, { opacity: 0.75, scale: 1.3, duration: 0.3, ease: 'power2.out' }, 'powerOn')
          .to(boxGlow, { opacity: 0.22, scale: 1, duration: 0.5, ease: 'power2.inOut' }, 'powerOn+=0.35');

        /* 3) a white-bluish electric pulse is born at the fuse box */
        tl.addLabel('pulseBirth', 'powerOn+=0.55')
          .to(pulse, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }, 'pulseBirth')
          .to(boxGlow, { opacity: 0.9, scale: 1.15, duration: 0.2, ease: 'power2.out' }, 'pulseBirth')
          .to(boxGlow, { opacity: 0.15, scale: 0.95, duration: 0.4, ease: 'power2.inOut' }, 'pulseBirth+=0.25');

        /* 4) pulse travels to the socket, which appears and lights up */
        tl.addLabel('toSocket', 'pulseBirth+=0.35')
          .to(pulse, {
            motionPath: { path: '#pulsePathSocket', align: '#pulsePathSocket', alignOrigin: [0.5, 0.5], autoRotate: false },
            duration: 1.05,
            ease: 'power1.inOut',
          }, 'toSocket')
          .to(pulse, { scale: 1.22, duration: 0.45, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 'toSocket')
          .to(socket, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out' }, 'toSocket+=0.45');

        tl.addLabel('socketOn', 'toSocket+=1.05')
          .to(socketGlow, { opacity: 1, scale: 1.4, duration: 0.22, ease: 'power2.out' }, 'socketOn')
          .to(socket, { filter: 'brightness(1.6)', duration: 0.14, ease: 'power1.inOut' }, 'socketOn')
          .to(socket, { filter: 'brightness(1.05)', duration: 0.32, ease: 'power1.inOut' }, 'socketOn+=0.14')
          .to(socketGlow, { opacity: 0.4, scale: 1.05, duration: 0.5, ease: 'power2.inOut' }, 'socketOn+=0.22');

        /* 5) pulse moves on to the light switch, which gets pressed */
        tl.addLabel('toSwitch', 'socketOn+=0.5')
          .to(pulse, {
            motionPath: { path: '#pulsePathSwitch', align: '#pulsePathSwitch', alignOrigin: [0.5, 0.5], autoRotate: false },
            duration: 1.0,
            ease: 'power1.inOut',
          }, 'toSwitch')
          .to(pulse, { scale: 1.2, duration: 0.4, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 'toSwitch')
          .to(switchEl, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out' }, 'toSwitch+=0.4');

        tl.addLabel('switchPress', 'toSwitch+=1.0')
          .to(switchEl, { scale: 0.88, rotation: -4, duration: 0.15, ease: 'power2.in' }, 'switchPress')
          .to(switchEl, { scale: 1.05, rotation: 3, duration: 0.18, ease: 'power2.out' }, 'switchPress+=0.15')
          .to(switchEl, { scale: 1, rotation: 0, duration: 0.22, ease: 'back.out(1.7)' }, 'switchPress+=0.33')
          .to(switchGlow, { opacity: 1, scale: 1.3, duration: 0.18, ease: 'power2.out' }, 'switchPress')
          .to(switchGlow, { opacity: 0.35, scale: 1, duration: 0.4, ease: 'power2.inOut' }, 'switchPress+=0.3');

        /* 6) pulse continues up to the LED lamp, which glows softly on */
        tl.addLabel('toBulb', 'switchPress+=0.55')
          .to(pulse, {
            motionPath: { path: '#pulsePathBulb', align: '#pulsePathBulb', alignOrigin: [0.5, 0.5], autoRotate: false },
            duration: 1.15,
            ease: 'power1.inOut',
          }, 'toBulb')
          .to(bulb, { opacity: 1, scale: 1, filter: 'blur(0px) brightness(.6)', duration: 0.6, ease: 'power3.out' }, 'toBulb+=0.45');

        tl.addLabel('bulbOn', 'toBulb+=1.15')
          .to(pulse, { opacity: 0, scale: 0.3, duration: 0.3, ease: 'power2.in' }, 'bulbOn')
          .to(bulbGlow, { opacity: 1, scale: 1.6, duration: 0.9, ease: 'power2.out' }, 'bulbOn')
          .to(bulb, { filter: 'brightness(1.25) saturate(1.15)', duration: 0.9, ease: 'power2.out' }, 'bulbOn')
          .to(flash, { opacity: 0.07, duration: 0.35, ease: 'power2.out' }, 'bulbOn')
          .to(flash, { opacity: 0, duration: 0.55, ease: 'power2.inOut' }, 'bulbOn+=0.35');

        /* 7) the scene settles into a soft backdrop and the hero text arrives */
        tl.addLabel('reveal', 'bulbOn+=0.8')
          .to(sceneGroupRef.current, { scale: 0.92, opacity: 0.55, filter: 'blur(2px)', duration: 1.2, ease: 'power2.inOut' }, 'reveal')
          .to(heroItems, { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power3.out' }, 'reveal+=0.3');

        /* ambient depth parallax across the whole sequence */
        const total = tl.duration();
        tl.to(blobA, { x: '+=40', y: '-=25', duration: total, ease: 'none' }, 0);
        tl.to(blobB, { x: '-=35', y: '+=20', duration: total, ease: 'none' }, 0);

        return () => {};
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section className="hero hero-scene" id="top" ref={stageRef}>
      <div className="hero-scene__ambient">
        <div className="hero__glow hero__glow--1" ref={blobARef}></div>
        <div className="hero__glow hero__glow--2" ref={blobBRef}></div>
      </div>

      <svg className="hero-scene__paths" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path id="cablePathTL" d="M -10 -12 Q 8 18 37 39" />
        <path id="cablePathTR" d="M 112 -10 Q 86 20 63 39" />
        <path id="cablePathB" d="M 47 118 Q 49 84 50 53" />
        <path id="pulsePathSocket" d="M 50 42 Q 30 60 22 78" />
        <path id="pulsePathSwitch" d="M 22 78 Q 50 90 78 78" />
        <path id="pulsePathBulb" d="M 78 78 Q 68 44 50 15" />
      </svg>

      <div className="hero-scene__visuals" ref={sceneGroupRef}>
        <img className="hs-cable" src="/Stromkabel.png" alt="" ref={cable1Ref} />
        <img className="hs-cable" src="/Stromkabel.png" alt="" ref={cable2Ref} />
        <img className="hs-cable" src="/Stromkabel.png" alt="" ref={cable3Ref} />

        <div className="hs-glow hs-glow--box" ref={boxGlowRef}></div>
        <img className="hs-box" src="/Sicherungskasten.png" alt="Sicherungskasten" ref={boxRef} />

        <div className="hs-glow hs-glow--socket" ref={socketGlowRef}></div>
        <img className="hs-socket" src="/Steckdose.png" alt="Steckdose" ref={socketRef} />

        <div className="hs-glow hs-glow--switch" ref={switchGlowRef}></div>
        <img className="hs-switch" src="/Lichtschalter.png" alt="Lichtschalter" ref={switchRef} />

        <div className="hs-glow hs-glow--bulb" ref={bulbGlowRef}></div>
        <img className="hs-bulb" src="/Gluehbirne.png" alt="LED-Lampe" ref={bulbRef} />

        <img className="hs-pulse" src="/Stromimpuls.png" alt="" ref={pulseRef} />
      </div>

      <div className="hero-scene__flash" ref={flashRef}></div>

      <div className="hero__content hero-scene__text" ref={heroTextRef}>
        <p className="eyebrow reveal-item">Elektriker in Kaufbeuren-Neugablonz</p>
        <h1 className="reveal-item">
          Strom, der<br />
          <span className="grad-text">einfach funktioniert.</span>
        </h1>
        <p className="hero__sub reveal-item">
          Elektroinstallation, Störungsdienst und Sanierung — schnell, sauber und persönlich. Seit Jahrzehnten der
          zuverlässige Elektriker für Kaufbeuren und Umgebung.
        </p>
        <div className="hero__actions reveal-item">
          <a href="tel:+498341062260" className="btn btn--primary">Jetzt anrufen</a>
          <a href="#kontakt" className="btn btn--ghost">Route &amp; Kontakt</a>
        </div>
        <div className="hero__rating reveal-item">
          <span className="stars" aria-hidden="true">★★★★★</span>
          <span>5,0 · 10 Google-Rezensionen</span>
        </div>
      </div>

      <div className="hero__scrollcue" ref={scrollcueRef} aria-hidden="true">
        <span></span>
        <p>Scrollen</p>
      </div>
    </section>
  );
}
