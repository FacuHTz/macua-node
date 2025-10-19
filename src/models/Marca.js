// src/models/Marca.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Marca = sequelize.define(
  "Marca",
  {
    marca_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    pais_origen: {
      type: DataTypes.STRING(50),
    },
    logo_url: {
      type: DataTypes.STRING(255),
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "marcas",
    timestamps: true,
    updatedAt: false, // Solo created_at
    indexes: [
      { fields: ["nombre"] },
      { fields: ["activo"] },
    ],
  }
);

module.exports = Marca;

