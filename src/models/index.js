// src/models/index.js
const sequelize = require("../config/database");
const Marca = require("./Marca");
const Modelo = require("./Modelo");
const Vehiculo = require("./Vehiculo");
const ImagenVehiculo = require("./ImagenVehiculo");

// Definir relaciones
Marca.hasMany(Modelo, {
  foreignKey: "marca_id",
  as: "modelos",
});
Modelo.belongsTo(Marca, {
  foreignKey: "marca_id",
  as: "marca",
});

Modelo.hasMany(Vehiculo, {
  foreignKey: "modelo_id",
  as: "vehiculos",
});
Vehiculo.belongsTo(Modelo, {
  foreignKey: "modelo_id",
  as: "modelo",
});

Vehiculo.hasMany(ImagenVehiculo, {
  foreignKey: "vehiculo_id",
  as: "imagenes",
});
ImagenVehiculo.belongsTo(Vehiculo, {
  foreignKey: "vehiculo_id",
  as: "vehiculo",
});

module.exports = {
  sequelize,
  Marca,
  Modelo,
  Vehiculo,
  ImagenVehiculo,
};

