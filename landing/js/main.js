/**
 * OPX — Optima X · comportamiento de la landing.
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
  gsap.from(".hero .kicker, .hero-lead, .hero .cta-row", {
    y: 22, autoAlpha: 0, duration: 0.8, ease: "power2.out", stagger: 0.12, delay: 0.35,
  });
  gsap.to(".hero-ring-arc", { rotation: 360, transformOrigin: "50% 50%", repeat: -1, duration: 46, ease: "none" });

  ScrollTrigger.batch(".card, .pain, .case-step, .mock-panel, .ia-quote", {
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

/* ══ 2 · Diagrama del ciclo: resaltado por producto ══════════════════ */
const highlightProduct = (productId) => {
  document.querySelectorAll(".cycle-node").forEach((node) => {
    node.classList.toggle("is-active", node.dataset.p === productId);
  });
};

/* ══ 3 · Caso guiado (motor de estados sobre el JSON canónico) ═══════ */
const caseApi = (() => {
  const steps = DATA?.case?.steps ?? [];
  const stepEls = [...document.querySelectorAll(".case-step")];
  const live = document.querySelector(".case-live");
  const controls = document.getElementById("case-controls");
  const labels = { pendiente: "Pendiente", activo: "Activo", completado: "Completado" };
  let index = -1; // -1 = sin iniciar

  const stateFor = (i) => (index >= steps.length ? "completado" : i < index ? "completado" : i === index ? "activo" : "pendiente");

  const render = (announce = true) => {
    stepEls.forEach((el, i) => {
      const state = stateFor(i);
      el.dataset.state = state;
      const badge = el.querySelector(".case-state");
      if (badge) badge.textContent = labels[state];
    });
    const btn = (name) => controls?.querySelector(`[data-case="${name}"]`);
    if (btn("prev")) btn("prev").disabled = index <= 0;
    if (btn("next")) btn("next").disabled = index >= steps.length;
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
      <span class="present-hint">← → navegar · Esc salir</span>
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
    gsap.set(".card, .pain, .case-step, .mock-panel, .ia-quote, .hero h1 div, .hero .kicker, .hero-lead, .hero .cta-row", { clearProps: "all" });
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
  presentApi,
  highlightProduct,
};
