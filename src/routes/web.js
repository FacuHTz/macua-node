// src/routes/web.js
const express = require("express");
const {
  home,
  vehiculos,
  vehiculoDetalle,
  apiVehiculos,
  apiVehiculo,
} = require("../controllers/pages.controller");

const router = express.Router();

/* Páginas */
router.get("/", home);
router.get("/vehiculos", vehiculos);
router.get("/vehiculos/:id", vehiculoDetalle);

/* API demo (luego se conecta a DB real) */
router.get("/api/vehiculos", apiVehiculos);
router.get("/api/vehiculos/:id", apiVehiculo);

/* Placeholder n8n (lead) */
router.post("/api/prospect", (req, res) => {
  console.log("Lead recibido:", req.body);
  res.json({ ok: true });
});

module.exports = router;
