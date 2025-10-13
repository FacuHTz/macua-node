(function () {
  /* ============ helpers ============ */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const fmt = (n) => n.toLocaleString("es-AR", { maximumFractionDigits: 0 });

  /* ============ header year & scroll ============ */
  const header = $("#header");
  const year = $("#y");
  if (year) year.textContent = new Date().getFullYear();
  window.addEventListener("scroll", () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (y > 20) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  });

  /* ============ slider ============ */
  const slider = $(".slider");
  if (slider) {
    const slides = $$(".slide", slider);
    const prev = $(".nav.prev", slider);
    const next = $(".nav.next", slider);
    let idx = 0;
    let timer = null;
    const delay = parseInt(slider.dataset.autoplay || "6000", 10);

    const go = (i) => {
      slides[idx].classList.remove("active");
      idx = (i + slides.length) % slides.length;
      slides[idx].classList.add("active");
    };
    const play = () => {
      stop();
      timer = setInterval(() => go(idx + 1), delay);
    };
    const stop = () => timer && clearInterval(timer);

    prev.addEventListener("click", () => {
      go(idx - 1);
      play();
    });
    next.addEventListener("click", () => {
      go(idx + 1);
      play();
    });

    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", play);
    play();
  }

  /* ============ simple modals for header utils ============ */
  $$(".u-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.modal;
      const modal = document.createElement("div");
      modal.innerHTML = `
        <div class="modal-card">
          <button class="close" aria-label="Cerrar">×</button>
          <div class="modal-body">
            ${
              type === "search"
                ? '<h3>Buscar vehículos</h3><input placeholder="Modelo o versión" autofocus />'
                : type === "map"
                ? "<h3>Sucursales</h3><p>Santa Fe · Paraná · Rosario</p>"
                : "<h3>Contacto</h3><p>Dejanos tu mensaje y te respondemos.</p>"
            }
          </div>
        </div>`;
      Object.assign(modal.style, {
        position: "fixed",
        inset: "0",
        background: "rgba(0,0,0,.65)",
        display: "grid",
        placeItems: "center",
        zIndex: 1200,
      });
      const card = $(".modal-card", modal);
      Object.assign(card.style, {
        position: "relative",
        background: "#fff",
        padding: "20px 22px",
        borderRadius: "10px",
        minWidth: "min(92vw,480px)",
      });
      const close = $(".close", modal);
      Object.assign(close.style, {
        position: "absolute",
        right: "12px",
        top: "8px",
        background: "none",
        border: "0",
        fontSize: "28px",
        cursor: "pointer",
      });
      close.addEventListener("click", () => modal.remove());
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.remove();
      });
      document.body.appendChild(modal);
    });
  });

  /* ====================================================== */
  /* ===============  CHAT: Asesor 0km  =================== */
  /* ====================================================== */
  const root = $("#affchat");
  if (!root) return;

  const wnd = $(".affchat-window", root);
  const bubble = $(".affchat-bubble", root);
  const body = $("#affchat-body");
  const quick = $("#affchat-quick");
  const form = $("#affchat-form");
  const input = $("#affchat-input");
  const btnMin = $(".affchat-header .min", root);
  const btnCls = $(".affchat-header .cls", root);

  const WA_NUMBER = "5490000000000"; // TODO: tu número
  const WA_LINK = (txt) =>
    `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(txt)}`;

  // Estado simple
  let state = {
    mode: "welcome", // welcome -> collecting
    months: 48,
    rate: 0.035, // tasa mensual referencial (3.5% mensual como placeholder)
  };

  // Utilidades
  const nowTime = () =>
    new Date().toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  const scrollBottom = () => (body.scrollTop = body.scrollHeight);
  const msg = (html, who = "bot") => {
    const el = document.createElement("div");
    el.className = `affchat-msg ${who}`;
    el.innerHTML = `<div>${html}<span class="affchat-time">${nowTime()}</span></div>`;
    body.appendChild(el);
    scrollBottom();
  };
  const chip = (label, payload, alt = false) => {
    const b = document.createElement("button");
    b.className = `affchip${alt ? " alt" : ""}`;
    b.type = "button";
    b.textContent = label;
    b.dataset.payload = JSON.stringify(payload);
    return b;
  };
  const setChips = (items = []) => {
    quick.innerHTML = "";
    items.forEach((it) => {
      const c = chip(it.label, it.payload, !!it.alt);
      c.addEventListener("click", () => onChip(it.payload, it.label));
      quick.appendChild(c);
    });
  };

  // Estimador simple: PV de anualidad + entrega
  function estimatePrice(monthly, months, rate, down) {
    const i = rate;
    const n = months;
    if (i <= 0) return monthly * n + down;
    const pv = (monthly * (1 - Math.pow(1 + i, -n))) / i;
    return pv + down;
  }

  // Parseo muy flexible de números escritos
  function parseNumbers(text) {
    const found = (text.match(/\d[\d\.\,]*/g) || []).map((v) =>
      parseInt(v.replace(/[^\d]/g, ""), 10)
    );
    if (!found.length) return { monthly: null, down: null };
    if (found.length === 1) return { monthly: found[0], down: 0 };
    return { monthly: found[0], down: found[1] };
  }

  // Render bienvenida + opciones
  function welcome() {
    msg(
      "<b>¡Hola! Soy tu Asesor 0km.</b> ¿Querés saber si hoy te alcanza un 0km? chateá conmigo sin compromiso, te aseguro que es <b>más fácil</b> de lo que pensás."
    );
    msg(
      "Decime <b>cuánto podés pagar por mes</b> y si tenés <b>entrega</b>. Te doy una <i>estimación orientativa</i> al toque."
    );
    setChips([
      { label: "Calcular ahora", payload: { action: "calc_now" } },
      {
        label: "Tengo usado para entregar",
        payload: { action: "used" },
        alt: true,
      },
      { label: "Ver planes típicos", payload: { action: "plans" }, alt: true },
    ]);
    input.placeholder = "Ej: 180000 por mes y 500000 de entrega";
    showWindow();
  }

  function onChip(payload, label) {
    if (payload.action === "calc_now") {
      msg(`✅ ${label}`, "user");
      state.mode = "collecting";
      msg(
        "Perfecto. Escribí algo así: <b>200000 por mes y 800000 de entrega</b>. Si no tenés entrega, decí por ejemplo <b>150000 por mes</b>."
      );
      setChips([
        {
          label: "$120.000/mes",
          payload: { action: "prefill", text: "120000 por mes" },
        },
        {
          label: "$180.000/mes + $600.000 entrega",
          payload: {
            action: "prefill",
            text: "180000 por mes y 600000 de entrega",
          },
        },
        {
          label: "$250.000+/mes",
          payload: { action: "prefill", text: "250000 por mes" },
        },
      ]);
      return;
    }
    if (payload.action === "used") {
      msg(`ℹ️ ${label}`, "user");
      msg(
        "Genial. El usado puede mejorar la financiación. Igual probá el cálculo arriba y después hablás con un asesor."
      );
      return;
    }
    if (payload.action === "plans") {
      msg(`ℹ️ ${label}`, "user");
      msg(
        "Trabajamos con planes típicos de 24/36/48 cuotas, con tasas variables según campaña. Probemos una simulación rápida 👇"
      );
      setTimeout(() => onChip({ action: "calc_now" }, "Calcular ahora"), 400);
      return;
    }
    if (payload.action === "prefill") {
      input.value = payload.text;
      input.focus();
      return;
    }
  }

  // Resultado
  function showResult(monthly, down) {
    const m = state.months;
    const i = state.rate;

    const base = estimatePrice(monthly, m, i, down);
    const low = Math.max(0, base * 0.9);
    const high = base * 1.15;

    msg(
      `Con una <b>cuota aprox. $${fmt(
        monthly
      )}/mes</b> durante <b>${m} meses</b>${
        down ? ` y <b>entrega $${fmt(down)}</b>` : ""
      }, podrías apuntar a vehículos de <b>$${fmt(low)} – $${fmt(
        high
      )}</b> (estimación orientativa).`
    );
    msg(
      `Si querés, te uno con un asesor para ver <b>tasa vigente</b>, <b>bonos de contado</b> y si tomamos tu usado.`
    );
    const text = `Hola! Quiero asesoramiento 0km.\nCuota: $${fmt(
      monthly
    )}/mes\nEntrega: $${fmt(down)}\nPlazo: ${m} meses\n¿Opciones disponibles?`;
    setChips([
      { label: "Hablar por WhatsApp", payload: { action: "wa", text } },
      { label: "Nueva simulación", payload: { action: "calc_now" }, alt: true },
    ]);
  }

  // Eventos de formulario
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    msg(text, "user");
    input.value = "";

    const { monthly, down } = parseNumbers(text);
    if (!monthly && monthly !== 0) {
      msg(
        "No pude detectar montos. Probá con: <b>180000 por mes y 500000 de entrega</b>."
      );
      return;
    }
    showResult(monthly, down || 0);
  });

  // Acciones globales de chips
  quick.addEventListener("click", (e) => {
    const b = e.target.closest(".affchip");
    if (!b) return;
    const payload = JSON.parse(b.dataset.payload || "{}");
    if (payload.action === "wa") {
      window.open(
        WA_LINK(payload.text || "Hola, quiero asesoramiento 0km"),
        "_blank"
      );
      return;
    }
  });

  // Mostrar/Ocultar
  function showWindow() {
    wnd.style.display = "grid";
    bubble.style.display = "none";
  }
  function showBubble() {
    wnd.style.display = "none";
    bubble.style.display = "inline-flex";
  }

  btnMin.addEventListener("click", showBubble);
  btnCls.addEventListener("click", showBubble);
  bubble.addEventListener("click", showWindow);

  // “Insistente”: si está minimizado, cada 12s hace nudge
  setInterval(() => {
    if (bubble.style.display !== "none") {
      bubble.style.animation = "none";
      // reflow
      void bubble.offsetWidth;
      bubble.style.animation = "nudge 3s ease-in-out infinite";
    }
  }, 12000);

  // Primera carga
  setTimeout(welcome, 800);
})();
