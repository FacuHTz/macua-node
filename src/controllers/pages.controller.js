// src/controllers/pages.controller.js
const fs = require("fs");
const path = require("path");

/* =========================
 * HOME
 * ========================= */
const home = (req, res) => {
  res.render("home", {
    title: "MACUA | Concesionario Oficial Renault (Demo)",
  });
};

/* =========================
 * DATA DEMO (JSON local) → en prod se reemplaza por DB
 * ========================= */
let VEHICLES_CACHE = null;
let VEHICLES_MTIME = null;

function loadVehicles() {
  try {
    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "assets",
      "data",
      "vehiculos.json"
    );
    const stat = fs.statSync(filePath);
    if (!VEHICLES_CACHE || !VEHICLES_MTIME || stat.mtimeMs !== VEHICLES_MTIME) {
      VEHICLES_CACHE = JSON.parse(fs.readFileSync(filePath, "utf8"));
      VEHICLES_MTIME = stat.mtimeMs;
    }
    return VEHICLES_CACHE;
  } catch (err) {
    console.error("Error cargando vehiculos.json:", err);
    return [];
  }
}

function getMeta() {
  const data = loadVehicles();
  const uniq = (arr) => [...new Set(arr.filter(Boolean))];
  return {
    brands: uniq(data.map((d) => d.brand)).sort(),
    bodies: uniq(data.map((d) => d.body)).sort(),
    fuels: uniq(data.map((d) => d.fuel)).sort(),
    transmissions: uniq(data.map((d) => d.transmission)).sort(),
    locations: uniq(data.map((d) => d.location)).sort(),
  };
}

/* =========================
 * PÁGINA: LISTADO /vehiculos
 * ========================= */
const vehiculos = (req, res) => {
  res.render("vehiculos", {
    title: "Vehículos | MACUA",
    meta: getMeta(),
    PUBLIC_URL: process.env.PUBLIC_URL || "",
  });
};

/* =========================
 * PÁGINA: DETALLE /vehiculos/:id
 * ========================= */
const vehiculoDetalle = (req, res) => {
  const { id } = req.params;
  const all = loadVehicles();
  const veh = all.find((v) => v.id === id);

  if (!veh) {
    return res.status(404).render("404", {
      title: "Vehículo no encontrado | MACUA",
      message: "El vehículo no existe o fue dado de baja.",
    });
  }

  const gallery = (
    veh.gallery && veh.gallery.length ? veh.gallery : [veh.image]
  ).filter(Boolean);
  const related = all
    .filter((v) => v.id !== id && v.brand === veh.brand)
    .slice(0, 6);

  res.render("vehiculo", {
    title: `${veh.brand} ${veh.model} ${veh.year || ""} | MACUA`,
    vehiculo: veh,
    gallery,
    related,
    PUBLIC_URL: process.env.PUBLIC_URL || "",
  });
};

/* =========================
 * API: LISTA /api/vehiculos
 * ========================= */
const apiVehiculos = (req, res) => {
  const {
    q,
    sort = "relevance",
    page = "1",
    pageSize = "12",
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    minKm,
    maxKm,
  } = req.query;

  const arr = (k) => {
    const v = req.query[k];
    if (Array.isArray(v)) return v.filter(Boolean);
    if (v == null || v === "") return [];
    return [v];
  };

  const filtros = {
    tipo: arr("tipo"),
    brand: arr("brand"),
    body: arr("body"),
    fuel: arr("fuel"),
    transmission: arr("transmission"),
    location: arr("location"),
  };

  const p = Math.max(1, parseInt(page, 10) || 1);
  const ps = Math.max(1, Math.min(100, parseInt(pageSize, 10) || 12));

  let data = loadVehicles();

  if (q) {
    const term = q.toString().toLowerCase().trim();
    data = data.filter(
      (v) =>
        (v.brand && v.brand.toLowerCase().includes(term)) ||
        (v.model && v.model.toLowerCase().includes(term)) ||
        (v.body && v.body.toLowerCase().includes(term))
    );
  }

  if (filtros.tipo.length) {
    data = data.filter((v) =>
      v.zero_km ? filtros.tipo.includes("0km") : filtros.tipo.includes("usado")
    );
  }

  const inList = (val, list) =>
    list.length ? list.includes((val || "").toString()) : true;

  data = data.filter(
    (v) =>
      inList(v.brand, filtros.brand) &&
      inList(v.body, filtros.body) &&
      inList(v.fuel, filtros.fuel) &&
      inList(v.transmission, filtros.transmission) &&
      inList(v.location, filtros.location)
  );

  const inRange = (val, min, max) => {
    const n = Number(val || 0);
    if (min != null && min !== "" && n < Number(min)) return false;
    if (max != null && max !== "" && n > Number(max)) return false;
    return true;
  };
  if (minPrice || maxPrice)
    data = data.filter((v) => inRange(v.price, minPrice, maxPrice));
  if (minYear || maxYear)
    data = data.filter((v) => inRange(v.year, minYear, maxYear));
  if (minKm || maxKm) data = data.filter((v) => inRange(v.km, minKm, maxKm));

  const sorters = {
    price_asc: (a, b) => (a.price || 0) - (b.price || 0),
    price_desc: (a, b) => (b.price || 0) - (a.price || 0),
    year_desc: (a, b) => (b.year || 0) - (a.year || 0),
    km_asc: (a, b) => (a.km || 0) - (b.km || 0),
    relevance: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  };
  data = data.slice().sort(sorters[sort] || sorters.relevance);

  const total = data.length;
  const start = (p - 1) * ps;
  const items = data.slice(start, start + ps);

  res.json({ items, total, page: p, pageSize: ps });
};

/* =========================
 * API: ITEM /api/vehiculos/:id
 * ========================= */
const apiVehiculo = (req, res) => {
  const { id } = req.params;
  const v = loadVehicles().find((x) => x.id === id);
  if (!v) return res.status(404).json({ error: "not_found" });
  const gallery = (
    v.gallery && v.gallery.length ? v.gallery : [v.image]
  ).filter(Boolean);
  res.json({ ...v, gallery });
};

module.exports = {
  home,
  vehiculos,
  vehiculoDetalle,
  apiVehiculos,
  apiVehiculo,
};
