// src/models/Vehiculo.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Vehiculo = sequelize.define(
  "Vehiculo",
  {
    vehiculo_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    vin: {
      type: DataTypes.STRING(17),
      unique: true,
      allowNull: true, // Puede ser null para vehículos en stock sin VIN asignado
    },
    modelo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "modelos",
        key: "modelo_id",
      },
    },
    anio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1900,
        max: new Date().getFullYear() + 1,
      },
    },
    condicion: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [["nuevo", "usado", "certificado"]],
      },
    },
    color_exterior: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    color_interior: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    tipo_transmision: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [["manual", "automatica", "cvt", "dct"]],
      },
    },
    tipo_combustible: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        isIn: [
          [
            "gasolina",
            "diesel",
            "electrico",
            "hibrido",
            "hibrido_enchufable",
            "gnc",
          ],
        ],
      },
    },
    kilometraje: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    numero_puertas: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    capacidad_pasajeros: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cilindrada: {
      type: DataTypes.DECIMAL(4, 1),
    },
    potencia_hp: {
      type: DataTypes.INTEGER,
    },
    traccion: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [["delantera", "trasera", "4x4", "awd"]],
      },
    },
    precio_compra: {
      type: DataTypes.DECIMAL(12, 2),
    },
    precio_venta: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    precio_oferta: {
      type: DataTypes.DECIMAL(12, 2),
      validate: {
        min: 0,
      },
    },
    estado_inventario: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "disponible",
      validate: {
        isIn: [
          ["disponible", "reservado", "vendido", "en_transito", "mantenimiento"],
        ],
      },
    },
    fecha_ingreso: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    fecha_venta: {
      type: DataTypes.DATEONLY,
    },
    ubicacion_fisica: {
      type: DataTypes.STRING(100),
    },
    proveedor_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "proveedores",
        key: "proveedor_id",
      },
    },
    propietario_anterior_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "usuarios",
        key: "usuario_id",
      },
    },
    destacado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    deleted_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "vehiculos",
    timestamps: true,
    paranoid: true, // Soft delete
    indexes: [
      { fields: ["modelo_id"] },
      { fields: ["condicion"] },
      { fields: ["estado_inventario"] },
      { fields: ["anio"] },
      { fields: ["precio_venta"] },
      { fields: ["destacado"] },
      { fields: ["ubicacion_fisica"] },
    ],
  }
);

module.exports = Vehiculo;

