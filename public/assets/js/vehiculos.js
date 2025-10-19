// public/assets/js/vehiculos.js
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const fmtARS = (n) =>
    Number(n).toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    });

  const form = $("#filtersForm");
  const sortSel = $("#sort");
  const pageSizeSel = $("#pageSize");
  const grid = $("#grid");
  const countEl = $("#count");
  const prevBtn = $("#prev");
  const nextBtn = $("#next");
  const pageInfo = $("#pageInfo");
  const resetBtn = $("#btnReset");

  let page = 1;

  function getParams() {
    const fd = new FormData(form);
    const params = new URLSearchParams();

    // textos & numéricos
    [
      "q",
      "minPrice",
      "maxPrice",
      "minYear",
      "maxYear",
      "minKm",
      "maxKm",
    ].forEach((k) => {
      const v = (fd.get(k) || "").toString().trim();
      if (v) params.set(k, v);
    });

    // múltiples (checkbox)
    for (const key of [
      "tipo",
      "brand",
      "body",
      "fuel",
      "transmission",
      "location",
    ]) {
      const vals = $$(`input[name="${key}"]:checked`).map((i) => i.value);
      vals.forEach((v) => params.append(key, v));
    }

    // orden & paginado
    params.set("sort", sortSel.value || "relevance");
    params.set("pageSize", pageSizeSel.value || "12");
    params.set("page", String(page));

    return params;
  }

  function cardTpl(v) {
    const thumb = v.image || "/assets/img/hero-duster.jpg";
    return `
      <article class="card">
        <a href="/vehiculos/${v.id}" class="thumb" style="background-image:url('${thumb}')" aria-label="Ver detalles de ${v.brand} ${v.model}"></a>
        <div class="body">
          <div class="badges">
            ${
              v.zero_km
                ? `<span class="badge">0km</span>`
                : `<span class="badge">usado</span>`
            }
            ${v.financing ? `<span class="badge">financiación</span>` : ``}
          </div>
          <a href="/vehiculos/${v.id}" class="card-title-link">
            <h3>${v.brand} ${v.model} ${v.year || ""}</h3>
          </a>
          <div class="price">${fmtARS(v.price)}</div>
          <div class="meta">
            ${
              v.km != null
                ? `<span>${v.km.toLocaleString("es-AR")} km</span>`
                : ``
            }
            ${v.transmission ? `<span>${v.transmission}</span>` : ``}
            ${v.fuel ? `<span>${v.fuel}</span>` : ``}
            ${v.body ? `<span>${v.body}</span>` : ``}
            ${v.location ? `<span>${v.location}</span>` : ``}
          </div>
        </div>
        <div class="foot">
          <a href="/vehiculos/${v.id}" class="btn btn-primary">Ver detalles</a>
          <a class="btn btn-light" href="https://wa.me/5493430000000?text=${encodeURIComponent(
            `Hola! Me interesa el ${v.brand} ${v.model} ${v.year} (${fmtARS(
              v.price
            )}).`
          )}" target="_blank" rel="noopener">WhatsApp</a>
        </div>
      </article>
    `;
  }

  async function fetchData() {
    const params = getParams();
    const res = await fetch(`/api/vehiculos?${params.toString()}`);
    if (!res.ok) throw new Error("No se pudieron obtener vehículos");
    return res.json();
  }

  async function render() {
    const { items, total, page: p, pageSize } = await fetchData();
    countEl.textContent = total.toLocaleString("es-AR");
    grid.innerHTML =
      items.map((v) => cardTpl(v)).join("") ||
      `<p>No se encontraron resultados.</p>`;

    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    prevBtn.disabled = p <= 1;
    nextBtn.disabled = p >= totalPages;
    pageInfo.textContent = `${p} / ${totalPages}`;
  }

  // Eventos
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    page = 1;
    render().catch(console.error);
  });
  form.addEventListener("change", () => {
    page = 1;
    render().catch(console.error);
  });
  sortSel.addEventListener("change", () => {
    page = 1;
    render().catch(console.error);
  });
  pageSizeSel.addEventListener("change", () => {
    page = 1;
    render().catch(console.error);
  });
  prevBtn.addEventListener("click", () => {
    page = Math.max(1, page - 1);
    render().catch(console.error);
  });
  nextBtn.addEventListener("click", () => {
    page = page + 1;
    render().catch(console.error);
  });
  resetBtn.addEventListener("click", () => {
    form.reset();
    $$('input[type="checkbox"]', form).forEach((i) => (i.checked = false));
    page = 1;
    render().catch(console.error);
  });

  // Primera carga
  render().catch(console.error);
})();
