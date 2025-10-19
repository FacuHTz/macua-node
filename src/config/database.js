// src/config/database.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "concesionaria_db",
  process.env.DB_USER || "facu",
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 5433,
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true, // snake_case en BD
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// Probar conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a PostgreSQL establecida correctamente");
  } catch (error) {
    console.error("❌ Error conectando a PostgreSQL:", error.message);
    process.exit(1);
  }
};

testConnection();

module.exports = sequelize;

