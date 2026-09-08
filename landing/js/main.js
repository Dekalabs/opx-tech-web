/**
 * OPX · comportamiento de la landing.
 * Sin peticiones externas: los datos llegan embebidos por sync-data.mjs.
 * Todo el contenido es legible sin JavaScript; aquí solo se añade
 * animación, el caso guiado interactivo y el modo presentación.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { animate as motionAnimate } from "motion";

gsap.registerPlugin(ScrollTrigger, SplitText);

/* ── flags del paquete ─────────────────────────────────────────────── */
const SUITE_SCENE_3D_ENABLED = false; // futura escena 3D: fuera de alcance
const dataEl = document.getElementById("opx-data");
const DATA = dataEl ? JSON.parse(dataEl.textContent) : null;
const CONTACT_FORM_ENABLED = DATA?.contact?.form_enabled === true;

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
document.documentElement.classList.add("js");

const siteHeader = document.querySelector(".site-header");
const syncHeaderSurface = () => siteHeader?.classList.toggle("is-scrolled", window.scrollY > 20);
syncHeaderSurface();
window.addEventListener("scroll", syncHeaderSurface, { passive: true });

const corporateVideo = document.querySelector(".video-showcase video");
if (corporateVideo) {
  const ensureCorporateVideoPlayback = () => corporateVideo.play().catch(() => {});
  corporateVideo.addEventListener("canplay", ensureCorporateVideoPlayback, { once: true });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) ensureCorporateVideoPlayback();
  });
  ensureCorporateVideoPlayback();
}

/* ══ 1 · Animación de entrada (solo sin reduced-motion) ═══════════════ */
if (!reduced) {
  const h1 = document.querySelector(".hero h1");
  if (h1) {
    try {
      const split = new SplitText(h1, { type: "words" });
      gsap.from(split.words, {
        yPercent: 60, autoAlpha: 0, duration: 0.9, ease: "power3.out",
        stagger: 0.05, delay: 0.1,
        /* Al terminar hay que deshacer el troceado: un transform en las
           palabras las promueve a su propia capa y eso anula el
           background-clip:text del degradado de <em>, que dejaría de
           pintarse. Revert restaura el marcado original. */
        onComplete: () => split.revert(),
      });
    } catch { /* SplitText no disponible: se conserva el titular estático */ }
  }
  gsap.from(".hero-lead, .hero .cta-row", {
    y: 22, autoAlpha: 0, duration: 0.8, ease: "power2.out", stagger: 0.12, delay: 0.35,
  });

  ScrollTrigger.batch(".card:not(.suite-card):not(.question-card), .pain, .mock-panel, .ia-quote", {
    start: "top 92%",
    once: true,
    onEnter: (els) => gsap.from(els, { y: 26, autoAlpha: 0, duration: 0.7, ease: "power2.out", stagger: 0.07 }),
  });

  const flow = document.getElementById("cycle-flow");
  if (flow) gsap.to(flow, { strokeDashoffset: -1320, repeat: -1, duration: 14, ease: "none" });

  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("pointerdown", () => motionAnimate(btn, { scale: 0.96 }, { type: "spring", stiffness: 520, damping: 30 }));
    for (const ev of ["pointerup", "pointerleave", "blur"]) {
      btn.addEventListener(ev, () => motionAnimate(btn, { scale: 1 }, { type: "spring", stiffness: 420, damping: 24 }));
    }
  });
}

/* ══ 2 · Enfoque: pregunta única, revelado tipográfico y navegación ══ */
const approachApi = (() => {
  const root = document.querySelector(".questions");
  const cards = [...document.querySelectorAll(".question-card")];
  const pagination = document.querySelector(".question-pagination");
  const live = document.querySelector(".question-live");
  if (!root || !pagination || !cards.length || reduced) {
    return { count: cards.length, index: () => 0, goto: () => false, next: () => false, prev: () => false, play: () => false, pause: () => false };
  }

  const productColors = { venue: "var(--p-venue)", flow: "var(--p-flow)", response: "var(--p-response)", insight: "var(--p-insight)" };
  const interval = 5200;
  let active = 0;
  let timer = null;
  let inView = false;
  let pausedByPointer = false;
  let pausedByFocus = false;
  let timeline = null;
  let activeSplit = null;

  root.classList.add("is-carousel");
  pagination.classList.add("is-active");

  const dots = cards.map((card, index) => {
    const title = card.querySelector("h3")?.textContent.trim() || `Pregunta ${index + 1}`;
    const id = `enfoque-pregunta-${index + 1}`;
    card.id = id;
    card.setAttribute("role", "tabpanel");
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "question-dot";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-controls", id);
    dot.setAttribute("aria-label", `Mostrar ${title}`);
    dot.style.setProperty("--dot-color", productColors[card.dataset.p] || "var(--accent-400)");
    dot.addEventListener("click", () => {
      show(index, true);
      restart();
    });
    pagination.append(dot);
    return dot;
  });

  const setState = (index) => {
    cards.forEach((card, cardIndex) => {
      const selected = cardIndex === index;
      card.classList.toggle("is-active", selected);
      card.setAttribute("aria-hidden", String(!selected));
      card.tabIndex = selected ? 0 : -1;
    });
    dots.forEach((dot, dotIndex) => {
      const selected = dotIndex === index;
      dot.setAttribute("aria-selected", String(selected));
      dot.tabIndex = selected ? 0 : -1;
    });
    root.style.setProperty("--active-color", productColors[cards[index].dataset.p] || "var(--accent-400)");
  };

  const reveal = (card) => {
    timeline?.kill();
    activeSplit?.revert();
    activeSplit = null;
    const title = card.querySelector("h3");
    const index = card.querySelector(".question-index");
    const detail = card.querySelector("p");
    const media = card.querySelector(".question-media");
    timeline = gsap.timeline();
    timeline.fromTo(card, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .48, ease: "power2.out" });
    if (media) {
      timeline.fromTo(media, { y: 56, autoAlpha: 0, scale: .985 }, { y: 0, autoAlpha: 1, scale: 1, duration: .85, ease: "power3.out" }, .08);
    }
    timeline.fromTo(index, { y: -12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .45, ease: "power2.out" }, 0.08);
    if (title) {
      try {
        activeSplit = new SplitText(title, { type: "words,lines", linesClass: "question-line" });
        timeline.from(activeSplit.words, { yPercent: 115, autoAlpha: 0, duration: .8, ease: "power3.out", stagger: .055 }, .12);
      } catch {
        timeline.from(title, { y: 30, autoAlpha: 0, duration: .75, ease: "power3.out" }, .12);
      }
    }
    timeline.fromTo(detail, { y: 15, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .55, ease: "power2.out" }, .4);
    timeline.eventCallback("onComplete", () => {
      activeSplit?.revert();
      activeSplit = null;
    });
  };

  function show(index, announce = false) {
    const target = (index + cards.length) % cards.length;
    if (target === active && cards[target].classList.contains("is-active")) return false;
    const previous = cards[active];
    active = target;
    gsap.killTweensOf(previous);
    gsap.to(previous, { y: -18, autoAlpha: 0, duration: .28, ease: "power2.in" });
    setState(active);
    reveal(cards[active]);
    if (announce && live) live.textContent = `${cards[active].querySelector("h3")?.textContent}. ${cards[active].querySelector("p")?.textContent}`;
    return true;
  }

  const stop = () => {
    if (timer) window.clearInterval(timer);
    timer = null;
  };
  const start = () => {
    stop();
    if (inView && !pausedByPointer && !pausedByFocus && !document.hidden) timer = window.setInterval(() => show(active + 1), interval);
  };
  function restart() { stop(); start(); }

  setState(0);
  gsap.set(cards[0], { y: 0, autoAlpha: 1 });

  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView) {
      if (!root.dataset.revealed) {
        root.dataset.revealed = "true";
        reveal(cards[active]);
      }
      start();
    } else stop();
  }, { threshold: .35 });
  observer.observe(root);

  root.addEventListener("pointerenter", () => { pausedByPointer = true; stop(); });
  root.addEventListener("pointerleave", () => { pausedByPointer = false; start(); });
  pagination.addEventListener("focusin", () => { pausedByFocus = true; stop(); });
  pagination.addEventListener("focusout", (event) => {
    if (pagination.contains(event.relatedTarget)) return;
    pausedByFocus = false;
    start();
  });
  pagination.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const target = event.key === "Home" ? 0 : event.key === "End" ? cards.length - 1 : active + (event.key === "ArrowRight" ? 1 : -1);
    show(target, true);
    dots[active].focus();
    restart();
  });
  document.addEventListener("visibilitychange", () => document.hidden ? stop() : start());

  let touchX = null;
  root.addEventListener("pointerdown", (event) => { if (event.pointerType === "touch") touchX = event.clientX; });
  root.addEventListener("pointerup", (event) => {
    if (event.pointerType !== "touch" || touchX === null) return;
    const delta = event.clientX - touchX;
    touchX = null;
    if (Math.abs(delta) > 52) {
      show(active + (delta < 0 ? 1 : -1), true);
      restart();
    }
  });

  return {
    count: cards.length,
    index: () => active,
    goto: (index) => show(index, true),
    next: () => show(active + 1, true),
    prev: () => show(active - 1, true),
    play: () => { pausedByPointer = false; pausedByFocus = false; start(); return true; },
    pause: () => { pausedByPointer = true; stop(); return true; },
  };
})();

/* ══ 3 · Suite: paneles que se revelan y conservan su estado ═════════ */
const suiteCards = [...document.querySelectorAll(".suite-card")];
const suiteCardsRoot = document.querySelector(".suite-cards");

if (suiteCardsRoot && suiteCards.length) {
  suiteCards.forEach((card, index) => card.style.setProperty("--suite-index", index));

  const openSuiteCard = (card) => {
    if (card.classList.contains("is-open")) return;
    card.classList.add("is-open");
    if (suiteCards.every((item) => item.classList.contains("is-open"))) {
      suiteCardsRoot.classList.add("is-complete");
    }
    window.setTimeout(() => ScrollTrigger.refresh(), 800);
  };

  if (reduced) {
    suiteCards.forEach((card) => card.classList.add("is-open"));
    suiteCardsRoot.classList.add("is-complete");
  } else {
    suiteCardsRoot.classList.add("is-enhanced");
    suiteCards.forEach((card, index) => {
      ScrollTrigger.create({
        trigger: card,
        start: () => `top ${96 + (index * 12)}px`,
        once: true,
        onEnter: () => openSuiteCard(card),
      });
      card.addEventListener("focusin", () => openSuiteCard(card));

      let hoverTimer;
      card.addEventListener("pointerenter", (event) => {
        if (event.pointerType !== "mouse") return;
        hoverTimer = window.setTimeout(() => openSuiteCard(card), 120);
      });
      card.addEventListener("pointerleave", () => window.clearTimeout(hoverTimer));
    });
  }
}

/* ══ 3 · Resaltado por producto en el caso guiado ════════════════════ */
const highlightProduct = (productId) => {
  document.querySelectorAll(".cycle-node").forEach((node) => {
    node.classList.toggle("is-active", node.dataset.p === productId);
  });
};

/* ══ 4 · Caso guiado (motor de estados sobre el JSON canónico) ═══════ */
const caseApi = (() => {
  const steps = DATA?.case?.steps ?? [];
  const stepEls = [...document.querySelectorAll(".case-step")];
  const live = document.querySelector(".case-live");
  const controls = document.getElementById("case-controls");
  const labels = { pendiente: "Pendiente", activo: "Activo", completado: "Completado" };
  let index = -1; // -1 = sin iniciar

  const stateFor = (i) => (index >= steps.length ? "completado" : i < index ? "completado" : i === index ? "activo" : "pendiente");

  const render = (announce = true) => {
    const visibleIndex = index < 0 ? 0 : Math.min(index, steps.length - 1);
    stepEls.forEach((el, i) => {
      const state = stateFor(i);
      el.dataset.state = state;
      el.hidden = i !== visibleIndex;
      if (i === visibleIndex) el.setAttribute("aria-current", "step");
      else el.removeAttribute("aria-current");
      const badge = el.querySelector(".case-state");
      if (badge) badge.textContent = labels[state];
    });
    const btn = (name) => controls?.querySelector(`[data-case="${name}"]`);
    if (btn("prev")) btn("prev").disabled = index <= 0;
    if (btn("next")) btn("next").disabled = index < 0 || index >= steps.length;
    if (btn("start")) btn("start").disabled = index >= 0 && index < steps.length;
    if (live && announce) {
      if (index < 0) live.textContent = "Recorrido sin iniciar. Pulsa «Iniciar el recorrido».";
      else if (index >= steps.length) live.textContent = "Recorrido completado: el incidente quedó registrado como patrón.";
      else {
        const s = steps[index];
        const product = DATA.products.find((p) => p.id === s.product);
        live.textContent = `Paso ${index + 1} de ${steps.length} — ${s.time} · ${s.title} (${product?.name ?? s.product}).`;
      }
    }
    const current = steps[index];
    highlightProduct(current ? current.product : null);
    if (index >= 0 && index < steps.length && stepEls[index] && !reduced) {
      stepEls[index].scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  };

  const canGo = (i) => i >= -1 && i <= steps.length && i <= index + 1;
  const api = {
    count: steps.length,
    index: () => index,
    state: (id) => {
      const i = steps.findIndex((s) => s.id === id);
      return i < 0 ? null : stateFor(i);
    },
    start: () => { index = 0; render(); return true; },
    next: () => { if (index >= steps.length) return false; index += 1; render(); return true; },
    prev: () => { if (index <= 0) return false; index -= 1; render(); return true; },
    reset: () => { index = -1; render(); return true; },
    goto: (i) => { if (!canGo(i)) return false; index = i; render(); return true; },
  };

  if (controls && steps.length) {
    controls.hidden = false;
    controls.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-case]");
      if (!btn) return;
      ({ start: api.start, next: api.next, prev: api.prev, reset: api.reset })[btn.dataset.case]?.();
    });
    render(false);
  }
  return api;
})();

/* ══ 4 · Modo presentación (P / ?mode=present) ═══════════════════════ */
const presentApi = (() => {
  const slides = [...document.querySelectorAll("main > section[data-present]")];
  if (!slides.length) return { isOpen: () => false, count: 0 };

  let open = false;
  let active = 0;
  let savedScroll = 0;
  let savedFocus = null;
  let hud, progress;

  const buildHud = () => {
    hud = document.createElement("div");
    hud.className = "present-hud";
    hud.innerHTML = `
      <span class="present-chapter"></span>
      <span class="present-hint">Teclas de dirección para navegar · Esc salir</span>
      <span class="present-counter"><span class="present-current">01</span> / <span class="present-total">${String(slides.length).padStart(2, "0")}</span></span>`;
    progress = document.createElement("div");
    progress.className = "present-progress";
    document.body.append(hud, progress);
  };

  const fit = () => {
    const slide = slides[active];
    const wrap = slide.querySelector(".wrap");
    if (!wrap) return;
    wrap.style.transform = "";
    const cs = getComputedStyle(slide);
    const availW = slide.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - 4;
    const availH = slide.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - 4;
    const rect = wrap.getBoundingClientRect();
    const scale = Math.min(1, (availW / rect.width) * 0.995, (availH / rect.height) * 0.995);
    if (scale < 1) {
      wrap.style.transformOrigin = "50% 50%";
      wrap.style.transform = `scale(${scale.toFixed(4)})`;
    }
  };

  const show = (i, focus = true) => {
    active = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach((slide, k) => {
      const isActive = k === active;
      slide.classList.toggle("is-active", isActive);
      slide.inert = !isActive;
      if (!isActive) {
        const w = slide.querySelector(".wrap");
        if (w) w.style.transform = "";
      }
    });
    hud.querySelector(".present-chapter").textContent = slides[active].dataset.presentChapter ?? "";
    hud.querySelector(".present-current").textContent = String(active + 1).padStart(2, "0");
    progress.style.width = `${((active + 1) / slides.length) * 100}%`;
    fit();
    if (focus) {
      slides[active].setAttribute("tabindex", "-1");
      slides[active].focus({ preventScroll: true });
    }
  };

  const openPresent = () => {
    if (open) return;
    open = true;
    savedScroll = window.scrollY;
    savedFocus = document.activeElement;
    if (!hud) buildHud();
    hud.style.display = "";
    progress.style.display = "";
    document.body.classList.add("presenting");
    document.querySelector(".site-header")?.setAttribute("inert", "");
    document.querySelector(".site-footer")?.setAttribute("inert", "");
    ScrollTrigger.getAll().forEach((st) => st.disable(false));
    gsap.set(".card, .pain, .case-step, .mock-panel, .ia-quote, .hero h1 div, .hero-lead, .hero .cta-row", { clearProps: "all" });
    const fromView = slides.findIndex((s) => s.getBoundingClientRect().bottom > 80);
    document.documentElement.requestFullscreen?.().catch(() => {});
    show(Math.max(0, fromView), true);
  };

  const closePresent = () => {
    if (!open) return;
    open = false;
    document.body.classList.remove("presenting");
    document.querySelector(".site-header")?.removeAttribute("inert");
    document.querySelector(".site-footer")?.removeAttribute("inert");
    slides.forEach((slide) => {
      slide.classList.remove("is-active");
      slide.inert = false;
      const w = slide.querySelector(".wrap");
      if (w) w.style.transform = "";
    });
    if (hud) { hud.style.display = "none"; progress.style.display = "none"; }
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    window.scrollTo({ top: savedScroll, behavior: "instant" });
    ScrollTrigger.getAll().forEach((st) => st.enable(false));
    ScrollTrigger.refresh();
    savedFocus?.focus?.({ preventScroll: true });
  };

  /* teclado */
  document.addEventListener("keydown", (e) => {
    const typing = e.target.closest("input, textarea, select, [contenteditable]");
    if (!open) {
      if ((e.key === "p" || e.key === "P") && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        openPresent();
      }
      return;
    }
    if (e.key === "Escape") { e.preventDefault(); closePresent(); return; }
    if (typing) return;
    if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(e.key)) { e.preventDefault(); show(active + 1); }
    else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); show(active - 1); }
    else if (e.key === "Home") { e.preventDefault(); show(0); }
    else if (e.key === "End") { e.preventDefault(); show(slides.length - 1); }
    else if (e.key === "Tab") {
      /* trampa de foco dentro de la diapositiva activa */
      const focusables = [...slides[active].querySelectorAll(
        'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      )].filter((el) => !el.matches(":disabled") && el.offsetParent !== null);
      if (!focusables.length) { e.preventDefault(); slides[active].focus(); return; }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === slides[active])) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      } else if (!slides[active].contains(document.activeElement)) {
        e.preventDefault(); first.focus();
      }
    }
  });

  /* rueda y gesto táctil */
  let wheelLock = 0;
  document.addEventListener("wheel", (e) => {
    if (!open) return;
    e.preventDefault();
    const now = Date.now();
    if (now - wheelLock < 620 || Math.abs(e.deltaY) < 24) return;
    wheelLock = now;
    show(active + (e.deltaY > 0 ? 1 : -1));
  }, { passive: false });

  let touchX = null;
  document.addEventListener("pointerdown", (e) => { if (open && e.pointerType === "touch") touchX = e.clientX; });
  document.addEventListener("pointerup", (e) => {
    if (!open || e.pointerType !== "touch" || touchX === null) return;
    const dx = e.clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 56) show(active + (dx < 0 ? 1 : -1));
  });

  /* Los enlaces internos visibles en una diapositiva navegan dentro de la
     presentación en vez de limitarse a cambiar el hash tras el overlay. */
  document.addEventListener("click", (e) => {
    if (!open) return;
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute("href").slice(1);
    const target = document.getElementById(id)?.closest("main > section[data-present]");
    const index = slides.indexOf(target);
    if (index < 0) return;
    e.preventDefault();
    history.replaceState(null, "", `#${id}`);
    show(index);
  });

  window.addEventListener("resize", () => { if (open) fit(); });

  if (new URLSearchParams(location.search).get("mode") === "present") {
    requestAnimationFrame(() => openPresent());
  }

  return {
    count: slides.length,
    isOpen: () => open,
    active: () => active,
    open: openPresent,
    close: closePresent,
    goto: (i) => { if (open) show(i); return open; },
  };
})();

/* ══ 5 · Contacto ════════════════════════════════════════════════════ */
const form = document.querySelector(".contact-form");
if (form && !CONTACT_FORM_ENABLED) {
  form.addEventListener("submit", (e) => e.preventDefault());
}

/* ══ 6 · API estable para pruebas ════════════════════════════════════ */
window.OPX = {
  flags: { SUITE_SCENE_3D_ENABLED, CONTACT_FORM_ENABLED },
  data: DATA,
  caseApi,
  approachApi,
  presentApi,
  highlightProduct,
};
