// src/database/seed.js
const { sequelize, Marca, Modelo, Vehiculo, ImagenVehiculo } = require("../models");

const seedDatabase = async () => {
  try {
    console.log("🌱 Iniciando seed de la base de datos...");

    // Limpiar datos existentes (opcional, comentar si no quieres limpiar)
    // await sequelize.sync({ force: true });

    // 1. MARCAS
    console.log("📦 Creando marcas...");
    const renault = await Marca.create({
      nombre: "Renault",
      pais_origen: "Francia",
      logo_url: "/assets/img/logo-renault.png",
      activo: true,
    });

    const toyota = await Marca.create({
      nombre: "Toyota",
      pais_origen: "Japón",
      logo_url: "/assets/img/logo-toyota.png",
      activo: true,
    });

    const volkswagen = await Marca.create({
      nombre: "Volkswagen",
      pais_origen: "Alemania",
      logo_url: "/assets/img/logo-vw.png",
      activo: true,
    });

    const ford = await Marca.create({
      nombre: "Ford",
      pais_origen: "Estados Unidos",
      logo_url: "/assets/img/logo-ford.png",
      activo: true,
    });

    const chevrolet = await Marca.create({
      nombre: "Chevrolet",
      pais_origen: "Estados Unidos",
      logo_url: "/assets/img/logo-chevrolet.png",
      activo: true,
    });

    console.log("✅ Marcas creadas");

    // 2. MODELOS RENAULT (0km)
    console.log("📦 Creando modelos Renault...");
    const duster = await Modelo.create({
      marca_id: renault.marca_id,
      nombre: "Duster",
      tipo_carroceria: "suv",
      segmento: "compacto",
      activo: true,
    });

    const arkana = await Modelo.create({
      marca_id: renault.marca_id,
      nombre: "Arkana",
      tipo_carroceria: "suv",
      segmento: "mediano",
      activo: true,
    });

    const koleos = await Modelo.create({
      marca_id: renault.marca_id,
      nombre: "Koleos",
      tipo_carroceria: "suv",
      segmento: "premium",
      activo: true,
    });

    const kwid = await Modelo.create({
      marca_id: renault.marca_id,
      nombre: "Kwid",
      tipo_carroceria: "hatchback",
      segmento: "economico",
      activo: true,
    });

    const kardian = await Modelo.create({
      marca_id: renault.marca_id,
      nombre: "Kardian",
      tipo_carroceria: "suv",
      segmento: "compacto",
      activo: true,
    });

    const master = await Modelo.create({
      marca_id: renault.marca_id,
      nombre: "Master",
      tipo_carroceria: "van",
      segmento: "compacto",
      activo: true,
    });

    // 3. MODELOS OTRAS MARCAS (para usados)
    console.log("📦 Creando modelos de otras marcas...");
    const corolla = await Modelo.create({
      marca_id: toyota.marca_id,
      nombre: "Corolla",
      tipo_carroceria: "sedan",
      segmento: "mediano",
      activo: true,
    });

    const hilux = await Modelo.create({
      marca_id: toyota.marca_id,
      nombre: "Hilux",
      tipo_carroceria: "pickup",
      segmento: "mediano",
      activo: true,
    });

    const amarok = await Modelo.create({
      marca_id: volkswagen.marca_id,
      nombre: "Amarok",
      tipo_carroceria: "pickup",
      segmento: "mediano",
      activo: true,
    });

    const ranger = await Modelo.create({
      marca_id: ford.marca_id,
      nombre: "Ranger",
      tipo_carroceria: "pickup",
      segmento: "mediano",
      activo: true,
    });

    const cruze = await Modelo.create({
      marca_id: chevrolet.marca_id,
      nombre: "Cruze",
      tipo_carroceria: "sedan",
      segmento: "mediano",
      activo: true,
    });

    console.log("✅ Modelos creados");

    // 4. VEHÍCULOS 0KM RENAULT
    console.log("🚗 Creando vehículos 0km Renault...");

    const duster2025 = await Vehiculo.create({
      vin: "8A1RN0001R0000001",
      modelo_id: duster.modelo_id,
      anio: 2025,
      condicion: "nuevo",
      color_exterior: "Gris Cometa",
      color_interior: "Negro",
      tipo_transmision: "automatica",
      tipo_combustible: "gasolina",
      kilometraje: 0,
      numero_puertas: 5,
      capacidad_pasajeros: 5,
      cilindrada: 1.3,
      potencia_hp: 156,
      traccion: "4x4",
      precio_venta: 24500000,
      estado_inventario: "disponible",
      ubicacion_fisica: "Paraná",
      destacado: true,
    });

    await ImagenVehiculo.create({
      vehiculo_id: duster2025.vehiculo_id,
      url_imagen: "/assets/img/hero-duster.jpg",
      tipo_imagen: "exterior",
      orden: 1,
      es_principal: true,
    });

    const arkana2025 = await Vehiculo.create({
      vin: "8A1RN0002R0000002",
      modelo_id: arkana.modelo_id,
      anio: 2025,
      condicion: "nuevo",
      color_exterior: "Rojo Llama",
      color_interior: "Negro",
      tipo_transmision: "cvt",
      tipo_combustible: "gasolina",
      kilometraje: 0,
      numero_puertas: 5,
      capacidad_pasajeros: 5,
      cilindrada: 1.3,
      potencia_hp: 140,
      traccion: "delantera",
      precio_venta: 28900000,
      estado_inventario: "disponible",
      ubicacion_fisica: "Paraná",
      destacado: true,
    });

    await ImagenVehiculo.create({
      vehiculo_id: arkana2025.vehiculo_id,
      url_imagen: "/assets/img/hero-megane.jpg",
      tipo_imagen: "exterior",
      orden: 1,
      es_principal: true,
    });

    const koleos2025 = await Vehiculo.create({
      vin: "8A1RN0003R0000003",
      modelo_id: koleos.modelo_id,
      anio: 2025,
      condicion: "nuevo",
      color_exterior: "Negro Etoile",
      color_interior: "Cuero Beige",
      tipo_transmision: "automatica",
      tipo_combustible: "gasolina",
      kilometraje: 0,
      numero_puertas: 5,
      capacidad_pasajeros: 7,
      cilindrada: 2.5,
      potencia_hp: 171,
      traccion: "4x4",
      precio_venta: 45800000,
      estado_inventario: "disponible",
      ubicacion_fisica: "Paraná",
      destacado: true,
    });

    await ImagenVehiculo.create({
      vehiculo_id: koleos2025.vehiculo_id,
      url_imagen: "/assets/img/hero-koleos.jpg",
      tipo_imagen: "exterior",
      orden: 1,
      es_principal: true,
    });

    const kwid2025 = await Vehiculo.create({
      vin: "8A1RN0004R0000004",
      modelo_id: kwid.modelo_id,
      anio: 2025,
      condicion: "nuevo",
      color_exterior: "Blanco Glaciar",
      color_interior: "Gris",
      tipo_transmision: "manual",
      tipo_combustible: "gasolina",
      kilometraje: 0,
      numero_puertas: 5,
      capacidad_pasajeros: 5,
      cilindrada: 1.0,
      potencia_hp: 66,
      traccion: "delantera",
      precio_venta: 14900000,
      estado_inventario: "disponible",
      ubicacion_fisica: "Crespo",
      destacado: false,
    });

    await ImagenVehiculo.create({
      vehiculo_id: kwid2025.vehiculo_id,
      url_imagen: "/assets/img/hero-kwid.jpg",
      tipo_imagen: "exterior",
      orden: 1,
      es_principal: true,
    });

    const kardian2025 = await Vehiculo.create({
      vin: "8A1RN0005R0000005",
      modelo_id: kardian.modelo_id,
      anio: 2025,
      condicion: "nuevo",
      color_exterior: "Azul Zafiro",
      color_interior: "Negro",
      tipo_transmision: "cvt",
      tipo_combustible: "gasolina",
      kilometraje: 0,
      numero_puertas: 5,
      capacidad_pasajeros: 5,
      cilindrada: 1.0,
      potencia_hp: 91,
      traccion: "delantera",
      precio_venta: 19500000,
      estado_inventario: "disponible",
      ubicacion_fisica: "Paraná",
      destacado: false,
    });

    await ImagenVehiculo.create({
      vehiculo_id: kardian2025.vehiculo_id,
      url_imagen: "/assets/img/hero-duster.jpg",
      tipo_imagen: "exterior",
      orden: 1,
      es_principal: true,
    });

    const master2025 = await Vehiculo.create({
      vin: "8A1RN0006R0000006",
      modelo_id: master.modelo_id,
      anio: 2025,
      condicion: "nuevo",
      color_exterior: "Blanco",
      color_interior: "Gris",
      tipo_transmision: "manual",
      tipo_combustible: "diesel",
      kilometraje: 0,
      numero_puertas: 4,
      capacidad_pasajeros: 3,
      cilindrada: 2.3,
      potencia_hp: 135,
      traccion: "trasera",
      precio_venta: 38900000,
      estado_inventario: "disponible",
      ubicacion_fisica: "Paraná",
      destacado: false,
    });

    await ImagenVehiculo.create({
      vehiculo_id: master2025.vehiculo_id,
      url_imagen: "/assets/img/tile-utilitarios.jpg",
      tipo_imagen: "exterior",
      orden: 1,
      es_principal: true,
    });

    console.log("✅ Vehículos 0km Renault creados");

    // 5. VEHÍCULOS USADOS (VARIAS MARCAS)
    console.log("🚗 Creando vehículos usados...");

    const corollaUsado = await Vehiculo.create({
      vin: "JTDBT923X81234567",
      modelo_id: corolla.modelo_id,
      anio: 2020,
      condicion: "usado",
      color_exterior: "Gris Plata",
      color_interior: "Gris",
      tipo_transmision: "automatica",
      tipo_combustible: "gasolina",
      kilometraje: 45000,
      numero_puertas: 4,
      capacidad_pasajeros: 5,
      cilindrada: 1.8,
      potencia_hp: 140,
      traccion: "delantera",
      precio_venta: 18500000,
      estado_inventario: "disponible",
      ubicacion_fisica: "Paraná",
      destacado: false,
    });

    await ImagenVehiculo.create({
      vehiculo_id: corollaUsado.vehiculo_id,
      url_imagen: "/assets/img/tile-pasajeros.jpg",
      tipo_imagen: "exterior",
      orden: 1,
      es_principal: true,
    });

    const hiluxUsada = await Vehiculo.create({
      vin: "8AJTT02P0J4123456",
      modelo_id: hilux.modelo_id,
      anio: 2019,
      condicion: "usado",
      color_exterior: "Blanco",
      color_interior: "Negro",
      tipo_transmision: "manual",
      tipo_combustible: "diesel",
      kilometraje: 78000,
      numero_puertas: 4,
      capacidad_pasajeros: 5,
      cilindrada: 2.8,
      potencia_hp: 177,
      traccion: "4x4",
      precio_venta: 32500000,
      estado_inventario: "disponible",
      ubicacion_fisica: "Crespo",
      destacado: false,
    });

    await ImagenVehiculo.create({
      vehiculo_id: hiluxUsada.vehiculo_id,
      url_imagen: "/assets/img/tile-utilitarios.jpg",
      tipo_imagen: "exterior",
      orden: 1,
      es_principal: true,
    });

    const amarokUsada = await Vehiculo.create({
      vin: "WV1ZZZ2HZ12345678",
      modelo_id: amarok.modelo_id,
      anio: 2018,
      condicion: "usado",
      color_exterior: "Negro",
      color_interior: "Negro",
      tipo_transmision: "automatica",
      tipo_combustible: "diesel",
      kilometraje: 95000,
      numero_puertas: 4,
      capacidad_pasajeros: 5,
      cilindrada: 2.0,
      potencia_hp: 180,
      traccion: "4x4",
      precio_venta: 28900000,
      estado_inventario: "disponible",
      ubicacion_fisica: "Paraná",
      destacado: false,
    });

    await ImagenVehiculo.create({
      vehiculo_id: amarokUsada.vehiculo_id,
      url_imagen: "/assets/img/tile-utilitarios.jpg",
      tipo_imagen: "exterior",
      orden: 1,
      es_principal: true,
    });

    const rangerUsada = await Vehiculo.create({
      vin: "8AFER13P0J1234567",
      modelo_id: ranger.modelo_id,
      anio: 2021,
      condicion: "usado",
      color_exterior: "Gris Oscuro",
      color_interior: "Negro",
      tipo_transmision: "automatica",
      tipo_combustible: "diesel",
      kilometraje: 52000,
      numero_puertas: 4,
      capacidad_pasajeros: 5,
      cilindrada: 3.2,
      potencia_hp: 200,
      traccion: "4x4",
      precio_venta: 38500000,
      estado_inventario: "disponible",
      ubicacion_fisica: "Ramírez",
      destacado: true,
    });

    await ImagenVehiculo.create({
      vehiculo_id: rangerUsada.vehiculo_id,
      url_imagen: "/assets/img/tile-utilitarios.jpg",
      tipo_imagen: "exterior",
      orden: 1,
      es_principal: true,
    });

    const cruzeUsado = await Vehiculo.create({
      vin: "8AGCR69X0J1234567",
      modelo_id: cruze.modelo_id,
      anio: 2019,
      condicion: "usado",
      color_exterior: "Azul",
      color_interior: "Beige",
      tipo_transmision: "automatica",
      tipo_combustible: "gasolina",
      kilometraje: 62000,
      numero_puertas: 4,
      capacidad_pasajeros: 5,
      cilindrada: 1.4,
      potencia_hp: 153,
      traccion: "delantera",
      precio_venta: 16800000,
      estado_inventario: "disponible",
      ubicacion_fisica: "Paraná",
      destacado: false,
    });

    await ImagenVehiculo.create({
      vehiculo_id: cruzeUsado.vehiculo_id,
      url_imagen: "/assets/img/tile-pasajeros.jpg",
      tipo_imagen: "exterior",
      orden: 1,
      es_principal: true,
    });

    console.log("✅ Vehículos usados creados");

    console.log("\n🎉 Seed completado exitosamente!");
    console.log(`
📊 Resumen:
  - 5 Marcas
  - 11 Modelos
  - 12 Vehículos (6 nuevos Renault + 6 usados varias marcas)
  - 12 Imágenes
    `);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error en seed:", error);
    process.exit(1);
  }
};

seedDatabase();

