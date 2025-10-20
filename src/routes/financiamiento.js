const express = require('express');
const router = express.Router();
const financiamientoController = require('../controllers/financiamiento.controller');

// Página de financiación
router.get('/', financiamientoController.mostrarPagina);

// API endpoints
router.get('/planes', financiamientoController.obtenerPlanes);
router.post('/chat', financiamientoController.chatFinanciamiento);

module.exports = router;

