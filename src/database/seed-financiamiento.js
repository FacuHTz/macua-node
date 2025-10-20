const { sequelize } = require('../models');

async function seedFinanciamiento() {
  try {
    console.log('🌱 Iniciando seed de financiamiento...');

    // 1. Crear planes de financiamiento (usando columnas reales)
    await sequelize.query(`
      INSERT INTO planes_financiamiento (
        nombre_plan, entidad_financiera, plazo_meses, tasa_interes_anual,
        enganche_minimo_porcentaje, monto_minimo, monto_maximo,
        comision_apertura, requiere_aval, activo
      )
      VALUES 
        ('Plan Tradicional', 'Banco MACUA', 60, 18.5, 20, 5000, 50000, 2.5, false, true),
        ('Plan 0% Interés', 'Renault Financiación', 12, 0, 30, 10000, 30000, 0, false, true),
        ('Plan Flex', 'Banco MACUA', 72, 22.0, 10, 3000, 100000, 3.0, true, true)
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Planes de financiamiento creados');

    // 2. Crear tasas vigentes
    await sequelize.query(`
      INSERT INTO tasas_vigentes (plan_financiamiento_id, tasa_interes, fecha_inicio, fecha_fin, activa)
      SELECT plan_id, tasa_interes_anual, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year', true
      FROM planes_financiamiento
      WHERE activo = true
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Tasas vigentes creadas');

    // 3. Crear condiciones financieras (ejemplos de cuotas)
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
        ('Enganche', 'Sinónimo de anticipo. Pago inicial al momento de adquirir el vehículo.', 'financiamiento', '["Enganche mínimo: 20% del valor del vehículo"]')
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

