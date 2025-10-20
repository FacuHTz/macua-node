const { sequelize } = require('../models');

async function seedFinanciamiento() {
  try {
    console.log('🌱 Iniciando seed de financiamiento...');

    // 1. Crear planes de financiamiento
    await sequelize.query(`
      INSERT INTO planes_financiamiento (nombre, descripcion, tasa_interes_anual, plazo_minimo_meses, plazo_maximo_meses, anticipo_minimo_porcentaje, monto_minimo, monto_maximo, activo, prioridad)
      VALUES 
        ('Plan Tradicional', 'Financiamiento estándar con tasa competitiva', 18.5, 12, 60, 20, 5000, 50000, true, 1),
        ('Plan 0% Interés', 'Sin interés en 12 cuotas (promoción)', 0, 12, 12, 30, 10000, 30000, true, 2),
        ('Plan Flex', 'Máxima flexibilidad en plazos y anticipo', 22.0, 6, 72, 10, 3000, 100000, true, 3)
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Planes de financiamiento creados');

    // 2. Crear tasas vigentes
    await sequelize.query(`
      INSERT INTO tasas_vigentes (plan_financiamiento_id, tasa_interes, fecha_inicio, fecha_fin, activa)
      SELECT plan_id, tasa_interes_anual, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year', true
      FROM planes_financiamiento
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Tasas vigentes creadas');

    // 3. Crear condiciones financieras
    await sequelize.query(`
      INSERT INTO condiciones_financieras (plan_financiamiento_id, plazo_meses, tasa_interes, cuota_ejemplo_10000, vigente)
      VALUES
        (1, 12, 18.5, 920, true),
        (1, 24, 18.5, 495, true),
        (1, 36, 18.5, 360, true),
        (1, 48, 18.5, 295, true),
        (1, 60, 18.5, 255, true),
        (2, 12, 0, 833, true),
        (3, 12, 22.0, 945, true),
        (3, 24, 22.0, 515, true),
        (3, 36, 22.0, 380, true),
        (3, 48, 22.0, 315, true),
        (3, 60, 22.0, 280, true),
        (3, 72, 22.0, 260, true)
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Condiciones financieras creadas');

    // 4. Crear glosario de términos
    await sequelize.query(`
      INSERT INTO glosario_ia (termino, definicion, categoria, ejemplos)
      VALUES
        ('Anticipo', 'Monto inicial que pagas al momento de la compra. Mientras mayor sea, menores serán tus cuotas mensuales.', 'financiamiento', '["Si el auto cuesta $20,000 y das $5,000 de anticipo, financiarás $15,000"]'),
        ('Tasa de interés', 'Porcentaje anual que se cobra por el préstamo. Determina cuánto pagarás de más por financiar.', 'financiamiento', '["Con tasa del 18.5% anual, pagarás aproximadamente 1.54% mensual"]'),
        ('Plazo', 'Cantidad de meses en los que pagarás el préstamo. A mayor plazo, cuotas más bajas pero más interés total.', 'financiamiento', '["12 meses = cuotas altas, poco interés", "60 meses = cuotas bajas, más interés"]'),
        ('Cuota mensual', 'Monto fijo que pagarás cada mes hasta completar el préstamo.', 'financiamiento', '["Incluye capital + interés"]'),
        ('CFT', 'Costo Financiero Total. Incluye tasa de interés más todos los gastos adicionales.', 'financiamiento', '["Si la tasa es 18.5% y hay gastos, el CFT puede ser 20%"]')
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Glosario de términos creado');

    console.log('🎉 Seed de financiamiento completado!');
    
  } catch (error) {
    console.error('❌ Error en seed de financiamiento:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

seedFinanciamiento();

