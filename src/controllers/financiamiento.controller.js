const { sequelize } = require('../models');
const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Mostrar página de financiación
exports.mostrarPagina = (req, res) => {
  res.render('financiacion', { title: 'Financiación' });
};

// Obtener planes de financiamiento
exports.obtenerPlanes = async (req, res) => {
  try {
    const [planes] = await sequelize.query(`
      SELECT * FROM planes_financiamiento 
      WHERE activo = true 
      ORDER BY plan_id ASC
    `);
    
    res.json(planes);
  } catch (error) {
    console.error('Error obteniendo planes:', error);
    res.status(500).json({ error: 'Error al obtener planes' });
  }
};

// Chat de financiamiento
exports.chatFinanciamiento = async (req, res) => {
  try {
    const { conversacion_id, mensaje } = req.body;
    
    // Obtener o crear conversación
    let convId = conversacion_id;
    if (!convId) {
      const [result] = await sequelize.query(`
        INSERT INTO conversaciones_ia (usuario_id, tipo, estado)
        VALUES (NULL, 'financiamiento', 'activa')
        RETURNING conversacion_ia_id
      `);
      convId = result[0].conversacion_ia_id;
    }
    
    // Guardar mensaje del usuario
    await sequelize.query(`
      INSERT INTO mensajes_ia (conversacion_ia_id, tipo_emisor, contenido)
      VALUES ($1, 'usuario', $2)
    `, [convId, mensaje]);
    
    // Obtener contexto (últimos mensajes)
    const [historial] = await sequelize.query(`
      SELECT tipo_emisor, contenido 
      FROM mensajes_ia 
      WHERE conversacion_ia_id = $1 
      ORDER BY timestamp DESC 
      LIMIT 10
    `, [convId]);
    
    // Obtener datos de BD para el contexto
    const [planes] = await sequelize.query(`
      SELECT * FROM planes_financiamiento WHERE activo = true
    `);
    
    const [vehiculos] = await sequelize.query(`
      SELECT v.vehiculo_id, v.precio_venta, m.nombre as modelo, ma.nombre as marca
      FROM vehiculos v
      JOIN modelos m ON v.modelo_id = m.modelo_id
      JOIN marcas ma ON m.marca_id = ma.marca_id
      WHERE v.estado_inventario = 'disponible'
      LIMIT 20
    `);
    
    // Construir prompt para IA
    const prompt = `Eres un asistente de financiamiento de una concesionaria Renault. Ayuda al cliente a calcular cuotas.

PLANES DISPONIBLES:
${JSON.stringify(planes)}

VEHÍCULOS DISPONIBLES:
${JSON.stringify(vehiculos)}

HISTORIAL:
${historial.reverse().map(m => `${m.tipo_emisor}: ${m.contenido}`).join('\n')}

MENSAJE ACTUAL: ${mensaje}

INSTRUCCIONES:
1. Si pregunta por un vehículo, busca el precio en la lista
2. Si quiere calcular cuota, usa esta fórmula: cuota = monto * (tasa_mensual * (1+tasa_mensual)^plazo) / ((1+tasa_mensual)^plazo - 1)
3. Tasa mensual = tasa_anual / 12 / 100
4. Sé breve y claro
5. Muestra cálculos con números reales
6. Si no entiendes, pide aclaración

Responde de forma conversacional y útil.`;
    
    // Llamar a OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 300
    });
    
    const respuesta = completion.choices[0].message.content;
    
    // Guardar respuesta de IA
    await sequelize.query(`
      INSERT INTO mensajes_ia (conversacion_ia_id, tipo_emisor, contenido)
      VALUES ($1, 'ia', $2)
    `, [convId, respuesta]);
    
    res.json({
      conversacion_id: convId,
      respuesta: respuesta
    });
    
  } catch (error) {
    console.error('Error en chat:', error);
    res.status(500).json({ 
      error: 'Error procesando mensaje',
      respuesta: 'Lo siento, hubo un error. ¿Puedes reformular tu pregunta?'
    });
  }
};

