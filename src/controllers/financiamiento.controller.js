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
        INSERT INTO conversaciones_ia (
          usuario_id, 
          sesion_anonima_id, 
          fecha_inicio, 
          estado, 
          origen_pagina, 
          intencion_detectada
        )
        VALUES (NULL, gen_random_uuid()::text, NOW(), 'activa', 'financiacion', 'financiacion')
        RETURNING conversacion_ia_id
      `);
      convId = result[0].conversacion_ia_id;
    }
    
    // Guardar mensaje del usuario
    await sequelize.query(`
      INSERT INTO mensajes_ia (conversacion_ia_id, tipo_emisor, contenido, timestamp)
      VALUES ($1, 'usuario', $2, NOW())
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
      SELECT 
        plan_id,
        nombre_plan,
        entidad_financiera,
        plazo_meses,
        tasa_interes_anual,
        enganche_minimo_porcentaje,
        monto_minimo,
        monto_maximo,
        comision_apertura,
        requiere_aval
      FROM planes_financiamiento 
      WHERE activo = true
    `);
    
    const [vehiculos] = await sequelize.query(`
      SELECT 
        v.vehiculo_id, 
        v.precio_venta, 
        m.nombre as modelo, 
        ma.nombre as marca,
        v.anio,
        v.condicion
      FROM vehiculos v
      JOIN modelos m ON v.modelo_id = m.modelo_id
      JOIN marcas ma ON m.marca_id = ma.marca_id
      WHERE v.estado_inventario = 'disponible'
      LIMIT 20
    `);

    // Obtener términos del glosario para ayudar a la IA
    const [glosario] = await sequelize.query(`
      SELECT termino, definicion_simple, ejemplo
      FROM glosario_ia
      WHERE activo = true AND categoria = 'financiero'
      LIMIT 10
    `);
    
    // Construir prompt para IA
    const prompt = `Eres un asistente de financiamiento de una concesionaria Renault. Ayuda al cliente a calcular cuotas.

PLANES DISPONIBLES:
${JSON.stringify(planes, null, 2)}

VEHÍCULOS DISPONIBLES:
${JSON.stringify(vehiculos, null, 2)}

GLOSARIO (para explicar términos):
${glosario.map(g => `${g.termino}: ${g.definicion_simple}`).join('\n')}

HISTORIAL DE CONVERSACIÓN:
${historial.reverse().map(m => `${m.tipo_emisor}: ${m.contenido}`).join('\n')}

MENSAJE ACTUAL DEL CLIENTE: ${mensaje}

INSTRUCCIONES:
1. Si pregunta por un vehículo específico, busca el precio en la lista de vehículos disponibles
2. Para calcular cuota mensual usa la fórmula del sistema francés:
   - Tasa mensual = tasa_interes_anual / 12 / 100
   - Cuota = monto * (tasa_mensual * (1+tasa_mensual)^plazo) / ((1+tasa_mensual)^plazo - 1)
3. Considera el enganche_minimo_porcentaje de cada plan
4. Menciona la comision_apertura si aplica
5. Si el plan requiere_aval, infórmalo
6. Sé breve, claro y amigable
7. Usa números reales de los datos proporcionados
8. Si no entiendes, pide aclaración de forma cortés

Responde de forma conversacional y profesional.`;
    
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
      INSERT INTO mensajes_ia (conversacion_ia_id, tipo_emisor, contenido, timestamp)
      VALUES ($1, 'ia', $2, NOW())
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

