const path = require("path");
const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const webRoutes = require("./routes/web");

const app = express();

/* Seguridad básica y performance */
app.use(
  helmet({
    contentSecurityPolicy: false, // simple para dev; afinamos en prod
  })
);
app.use(compression());
app.use(morgan("dev"));
app.use(cors({ origin: true }));

/* Body parsers */
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

/* Static (cachea un día imágenes/CSS/JS) */
app.use(
  express.static(path.join(__dirname, "..", "public"), {
    maxAge: "1d",
    etag: true,
  })
);

/* Views */
app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "ejs");

/* Rate limit solo para /api (por si pegamos webhooks o formularios) */
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

/* Rutas web */
app.use("/", webRoutes);

/* Healthcheck y ping */
app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/api/ping", (_req, res) => res.json({ pong: true }));

/* 404 */
app.use((req, res) => {
  if (req.path.startsWith("/api"))
    return res.status(404).json({ error: "Not found" });
  res.status(404).send("Página no encontrada");
});

module.exports = app;
