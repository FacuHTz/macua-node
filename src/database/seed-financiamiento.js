const { sequelize } = require('../models');

async function seedFinanciamiento() {
  try {
    console.log('🌱 Iniciando seed de financiamiento...');

    // Insertar SOLO en planes_financiamiento (usando columnas reales)
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

    console.log('🎉 Seed de financiamiento completado!');
    
  } catch (error) {
    console.error('❌ Error en seed de financiamiento:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

seedFinanciamiento();

