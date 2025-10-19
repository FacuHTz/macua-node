// src/models/Modelo.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Modelo = sequelize.define(
  "Modelo",
  {
    modelo_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    marca_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "marcas",
        key: "marca_id",
      },
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    tipo_carroceria: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [
          [
            "sedan",
            "suv",
            "pickup",
            "hatchback",
            "coupe",
            "convertible",
            "van",
            "wagon",
            "deportivo",
          ],
        ],
      },
    },
    segmento: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [
          ["economico", "compacto", "mediano", "premium", "lujo", "deportivo"],
        ],
      },
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "modelos",
    timestamps: true,
    updatedAt: false,
    indexes: [
      { fields: ["marca_id"] },
      { fields: ["tipo_carroceria"] },
      { fields: ["segmento"] },
      { unique: true, fields: ["marca_id", "nombre"] },
    ],
  }
);

module.exports = Modelo;

