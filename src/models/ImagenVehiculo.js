// src/models/ImagenVehiculo.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ImagenVehiculo = sequelize.define(
  "ImagenVehiculo",
  {
    imagen_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    vehiculo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "vehiculos",
        key: "vehiculo_id",
      },
      onDelete: "CASCADE",
    },
    url_imagen: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    tipo_imagen: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "exterior",
      validate: {
        isIn: [["exterior", "interior", "motor", "detalles", "360"]],
      },
    },
    orden: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    es_principal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "imagenes_vehiculos",
    timestamps: true,
    updatedAt: false,
    indexes: [
      { fields: ["vehiculo_id"] },
      { fields: ["es_principal"] },
      { fields: ["orden"] },
    ],
  }
);

module.exports = ImagenVehiculo;

