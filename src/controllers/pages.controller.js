// src/controllers/pages.controller.js
const { Vehiculo, Modelo, Marca, ImagenVehiculo } = require("../models");
const { Op } = require("sequelize");

/* =========================
 * HOME
 * ========================= */
const home = (req, res) => {
  res.render("home", {
    title: "MACUA | Concesionario Oficial Renault (Demo)",
  });
};

/* =========================
 * HELPER: Obtener metadatos para filtros
 * ========================= */
const getMeta = async () => {
  try {
    // Obtener marcas únicas
    const marcas = await Marca.findAll({
      where: { activo: true },
      attributes: ["nombre"],
      order: [["nombre", "ASC"]],
    });

    // Obtener tipos de carrocería únicos
    const carrocerias = await Modelo.findAll({
      attributes: ["tipo_carroceria"],
      group: ["tipo_carroceria"],
      order: [["tipo_carroceria", "ASC"]],
    });

    // Obtener tipos de combustible únicos de vehículos disponibles
    const combustibles = await Vehiculo.findAll({
      attributes: ["tipo_combustible"],
      where: { estado_inventario: "disponible" },
      group: ["tipo_combustible"],
      order: [["tipo_combustible", "ASC"]],
    });

    // Obtener tipos de transmisión únicos
    const transmisiones = await Vehiculo.findAll({
      attributes: ["tipo_transmision"],
      where: { estado_inventario: "disponible" },
      group: ["tipo_transmision"],
      order: [["tipo_transmision", "ASC"]],
    });

    // Obtener ubicaciones únicas
    const ubicaciones = await Vehiculo.findAll({
      attributes: ["ubicacion_fisica"],
      where: {
        estado_inventario: "disponible",
        ubicacion_fisica: { [Op.ne]: null },
      },
      group: ["ubicacion_fisica"],
      order: [["ubicacion_fisica", "ASC"]],
    });

    return {
      brands: marcas.map((m) => m.nombre),
      bodies: carrocerias.map((c) => c.tipo_carroceria),
      fuels: combustibles.map((c) => c.tipo_combustible),
      transmissions: transmisiones.map((t) => t.tipo_transmision),
      locations: ubicaciones.map((u) => u.ubicacion_fisica).filter(Boolean),
    };
  } catch (error) {
    console.error("Error obteniendo metadatos:", error);
    return {
      brands: [],
      bodies: [],
      fuels: [],
      transmissions: [],
      locations: [],
    };
  }
};

/* =========================
 * HELPER: Transformar vehículo de BD a formato frontend
 * ========================= */
const transformVehiculo = (vehiculo) => {
  const imagenPrincipal =
    vehiculo.imagenes && vehiculo.imagenes.length > 0
      ? vehiculo.imagenes.find((img) => img.es_principal)?.url_imagen ||
        vehiculo.imagenes[0]?.url_imagen
      : "/assets/img/hero-duster.jpg"; // Imagen por defecto

  return {
    id: `veh-${vehiculo.vehiculo_id}`,
    brand: vehiculo.modelo?.marca?.nombre || "",
    model: vehiculo.modelo?.nombre || "",
    year: vehiculo.anio,
    price: parseFloat(vehiculo.precio_venta),
    km: vehiculo.kilometraje,
    fuel: vehiculo.tipo_combustible,
    transmission: vehiculo.tipo_transmision,
    body: vehiculo.modelo?.tipo_carroceria || "",
    zero_km: vehiculo.condicion === "nuevo",
    financing: true, // Por ahora siempre true
    location: vehiculo.ubicacion_fisica,
    image: imagenPrincipal,
    gallery: vehiculo.imagenes?.map((img) => img.url_imagen) || [imagenPrincipal],
    createdAt: vehiculo.created_at,
    // Campos adicionales para detalle
    color_exterior: vehiculo.color_exterior,
    color_interior: vehiculo.color_interior,
    numero_puertas: vehiculo.numero_puertas,
    capacidad_pasajeros: vehiculo.capacidad_pasajeros,
    cilindrada: vehiculo.cilindrada,
    potencia_hp: vehiculo.potencia_hp,
    traccion: vehiculo.traccion,
    destacado: vehiculo.destacado,
  };
};

/* =========================
 * PÁGINA: LISTADO /vehiculos
 * ========================= */
const vehiculos = async (req, res) => {
  try {
    const meta = await getMeta();
    res.render("vehiculos", {
      title: "Vehículos | MACUA",
      meta,
      PUBLIC_URL: process.env.PUBLIC_URL || "",
    });
  } catch (error) {
    console.error("Error en página vehiculos:", error);
    res.status(500).send("Error al cargar la página");
  }
};

/* =========================
 * PÁGINA: DETALLE /vehiculos/:id
 * ========================= */
const vehiculoDetalle = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Extraer el ID numérico del formato "veh-123"
    const vehiculoId = id.startsWith("veh-") ? parseInt(id.replace("veh-", "")) : parseInt(id);

    const vehiculo = await Vehiculo.findByPk(vehiculoId, {
      include: [
        {
          model: Modelo,
          as: "modelo",
          include: [
            {
              model: Marca,
              as: "marca",
            },
          ],
        },
        {
          model: ImagenVehiculo,
          as: "imagenes",
          order: [["orden", "ASC"]],
        },
      ],
    });

    if (!vehiculo) {
      return res.status(404).render("404", {
        title: "Vehículo no encontrado | MACUA",
        message: "El vehículo no existe o fue dado de baja.",
      });
    }

    // Transformar vehículo
    const veh = transformVehiculo(vehiculo);

    // Obtener vehículos relacionados (misma marca)
    const relacionados = await Vehiculo.findAll({
      where: {
        vehiculo_id: { [Op.ne]: vehiculoId },
        estado_inventario: "disponible",
      },
      include: [
        {
          model: Modelo,
          as: "modelo",
          where: {
            marca_id: vehiculo.modelo.marca_id,
          },
          include: [
            {
              model: Marca,
              as: "marca",
            },
          ],
        },
        {
          model: ImagenVehiculo,
          as: "imagenes",
          where: { es_principal: true },
          required: false,
        },
      ],
      limit: 6,
    });

    const related = relacionados.map(transformVehiculo);

    res.render("vehiculo", {
      title: `${veh.brand} ${veh.model} ${veh.year || ""} | MACUA`,
      vehiculo: veh,
      gallery: veh.gallery,
      related,
      PUBLIC_URL: process.env.PUBLIC_URL || "",
    });
  } catch (error) {
    console.error("Error en detalle de vehículo:", error);
    res.status(500).render("404", {
      title: "Error | MACUA",
      message: "Ocurrió un error al cargar el vehículo.",
    });
  }
};

/* =========================
 * API: LISTA /api/vehiculos
 * ========================= */
const apiVehiculos = async (req, res) => {
  try {
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

    // Construir condiciones WHERE
    const where = {
      estado_inventario: "disponible",
    };

    // Filtro por tipo (0km/usado)
    if (filtros.tipo.length > 0) {
      if (filtros.tipo.includes("0km") && !filtros.tipo.includes("usado")) {
        where.condicion = "nuevo";
      } else if (filtros.tipo.includes("usado") && !filtros.tipo.includes("0km")) {
        where.condicion = { [Op.in]: ["usado", "certificado"] };
      }
    }

    // Filtros de combustible
    if (filtros.fuel.length > 0) {
      where.tipo_combustible = { [Op.in]: filtros.fuel };
    }

    // Filtros de transmisión
    if (filtros.transmission.length > 0) {
      where.tipo_transmision = { [Op.in]: filtros.transmission };
    }

    // Filtros de ubicación
    if (filtros.location.length > 0) {
      where.ubicacion_fisica = { [Op.in]: filtros.location };
    }

    // Filtros de rango de precio
    if (minPrice || maxPrice) {
      where.precio_venta = {};
      if (minPrice) where.precio_venta[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.precio_venta[Op.lte] = parseFloat(maxPrice);
    }

    // Filtros de rango de año
    if (minYear || maxYear) {
      where.anio = {};
      if (minYear) where.anio[Op.gte] = parseInt(minYear);
      if (maxYear) where.anio[Op.lte] = parseInt(maxYear);
    }

    // Filtros de rango de kilometraje
    if (minKm || maxKm) {
      where.kilometraje = {};
      if (minKm) where.kilometraje[Op.gte] = parseInt(minKm);
      if (maxKm) where.kilometraje[Op.lte] = parseInt(maxKm);
    }

    // Incluir relaciones
    const modeloWhere = {};
    const marcaWhere = {};

    // Filtros de carrocería
    if (filtros.body.length > 0) {
      modeloWhere.tipo_carroceria = { [Op.in]: filtros.body };
    }

    // Filtros de marca
    if (filtros.brand.length > 0) {
      marcaWhere.nombre = { [Op.in]: filtros.brand };
    }

    const include = [
      {
        model: Modelo,
        as: "modelo",
        where: Object.keys(modeloWhere).length > 0 ? modeloWhere : undefined,
        required: true,
        include: [
          {
            model: Marca,
            as: "marca",
            where: Object.keys(marcaWhere).length > 0 ? marcaWhere : undefined,
            required: true,
          },
        ],
      },
      {
        model: ImagenVehiculo,
        as: "imagenes",
        where: { es_principal: true },
        required: false,
      },
    ];

    // Búsqueda por texto
    if (q) {
      const term = q.toString().toLowerCase().trim();
      // Búsqueda en marca o modelo (requiere join)
      where[Op.or] = [
        { "$modelo.nombre$": { [Op.iLike]: `%${term}%` } },
        { "$modelo.marca.nombre$": { [Op.iLike]: `%${term}%` } },
      ];
    }

    // Ordenamiento
    let order = [];
    switch (sort) {
      case "price_asc":
        order = [["precio_venta", "ASC"]];
        break;
      case "price_desc":
        order = [["precio_venta", "DESC"]];
        break;
      case "year_desc":
        order = [["anio", "DESC"]];
        break;
      case "km_asc":
        order = [["kilometraje", "ASC"]];
        break;
      case "relevance":
      default:
        order = [
          ["destacado", "DESC"],
          ["created_at", "DESC"],
        ];
        break;
    }

    // Consulta con paginación
    const { count, rows } = await Vehiculo.findAndCountAll({
      where,
      include,
      order,
      limit: ps,
      offset: (p - 1) * ps,
      distinct: true,
      subQuery: false,
    });

    // Transformar resultados
    const items = rows.map(transformVehiculo);

    res.json({
      items,
      total: count,
      page: p,
      pageSize: ps,
    });
  } catch (error) {
    console.error("Error en API vehiculos:", error);
    res.status(500).json({
      error: "Error al obtener vehículos",
      message: error.message,
    });
  }
};

/* =========================
 * API: ITEM /api/vehiculos/:id
 * ========================= */
const apiVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Extraer el ID numérico del formato "veh-123"
    const vehiculoId = id.startsWith("veh-") ? parseInt(id.replace("veh-", "")) : parseInt(id);

    const vehiculo = await Vehiculo.findByPk(vehiculoId, {
      include: [
        {
          model: Modelo,
          as: "modelo",
          include: [
            {
              model: Marca,
              as: "marca",
            },
          ],
        },
        {
          model: ImagenVehiculo,
          as: "imagenes",
          order: [["orden", "ASC"]],
        },
      ],
    });

    if (!vehiculo) {
      return res.status(404).json({ error: "not_found" });
    }

    const result = transformVehiculo(vehiculo);
    res.json(result);
  } catch (error) {
    console.error("Error en API vehiculo detalle:", error);
    res.status(500).json({
      error: "Error al obtener vehículo",
      message: error.message,
    });
  }
};

module.exports = {
  home,
  vehiculos,
  vehiculoDetalle,
  apiVehiculos,
  apiVehiculo,
};

