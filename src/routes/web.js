const express = require("express");
const { home } = require("../controllers/pages.controller");

const router = express.Router();

router.get("/", home);

/* Placeholder para el próximo paso con n8n:
   recibimos intención/lead del chat y lo mandamos al webhook */
router.post("/api/prospect", (req, res) => {
  // Por ahora, solo logeamos. Próximo paso: forward a n8n.
  console.log("Lead recibido:", req.body);
  res.json({ ok: true });
});

module.exports = router;
