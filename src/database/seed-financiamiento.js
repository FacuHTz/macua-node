const { sequelize } = require('../models');

async function seedFinanciamiento() {
  try {
    console.log('🌱 Iniciando seed de financiamiento...');

    // 1. Insertar planes de financiamiento
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

    // 2. Insertar tasas vigentes
    await sequelize.query(`
      INSERT INTO tasas_vigentes (
        tipo_tasa, valor_tasa, vigencia_desde, vigencia_hasta, aplicable_a
      )
      VALUES 
        ('fija', 18.50, '2024-01-01', '2024-12-31', 'todos'),
        ('fija', 16.00, '2024-01-01', '2024-12-31', '0km'),
        ('promocional', 0.00, '2024-01-01', '2024-06-30', '0km'),
        ('fija', 22.00, '2024-01-01', '2024-12-31', 'usado'),
        ('variable', 19.50, '2024-01-01', '2024-03-31', 'todos')
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Tasas vigentes creadas');

    // 3. Insertar condiciones financieras
    await sequelize.query(`
      INSERT INTO condiciones_financieras (
        nombre, descripcion, tasa_minima, tasa_maxima, plazo_minimo, plazo_maximo,
        anticipo_minimo_porcentaje, requisitos, gastos_incluidos, vigencia_desde, vigencia_hasta, activo
      )
      VALUES 
        (
          'Condiciones Estándar 0km',
          'Condiciones generales para vehículos nuevos con tasa preferencial',
          16.00, 18.50, 12, 60, 20,
          '["Recibo de sueldo", "DNI vigente", "Comprobante de domicilio"]'::json,
          '["Seguro todo riesgo primer año", "Patentamiento", "Gestión administrativa"]'::json,
          '2024-01-01', '2024-12-31', true
        ),
        (
          'Condiciones Promoción 0% 0km',
          'Promoción especial sin interés para vehículos seleccionados',
          0.00, 0.00, 12, 12, 30,
          '["Recibo de sueldo", "DNI vigente", "Comprobante de domicilio", "Antigüedad laboral mínima 1 año"]'::json,
          '["Patentamiento", "Gestión administrativa"]'::json,
          '2024-01-01', '2024-06-30', true
        ),
        (
          'Condiciones Flex',
          'Máxima flexibilidad en plazos y montos para todos los vehículos',
          18.00, 25.00, 6, 72, 10,
          '["Recibo de sueldo", "DNI vigente", "Comprobante de domicilio", "Aval solidario"]'::json,
          '["Gestión administrativa"]'::json,
          '2024-01-01', '2024-12-31', true
        ),
        (
          'Condiciones Usados Certificados',
          'Condiciones especiales para vehículos usados certificados',
          20.00, 24.00, 12, 48, 25,
          '["Recibo de sueldo", "DNI vigente", "Comprobante de domicilio", "Verificación crediticia"]'::json,
          '["Transferencia", "Gestión administrativa"]'::json,
          '2024-01-01', '2024-12-31', true
        )
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Condiciones financieras creadas');

    // 4. Insertar glosario IA
    await sequelize.query(`
      INSERT INTO glosario_ia (
        termino, definicion_simple, definicion_tecnica, ejemplo, categoria, activo
      )
      VALUES 
        (
          'Anticipo',
          'Es el dinero que pagas al momento de comprar el auto. Mientras más anticipo des, menos tendrás que financiar y tus cuotas serán más bajas.',
          'Pago inicial que reduce el monto del capital a financiar, disminuyendo el costo financiero total y el monto de las cuotas mensuales.',
          'Si el auto cuesta $20,000 y das $5,000 de anticipo, solo financiarás $15,000. Esto reduce tus cuotas mensuales aproximadamente un 25%.',
          'financiero',
          true
        ),
        (
          'Enganche',
          'Es lo mismo que el anticipo. Es el pago inicial que haces al comprar el vehículo.',
          'Sinónimo de anticipo o pago inicial. Porcentaje del valor total del vehículo que se abona al momento de la compra.',
          'Con un enganche del 20% en un auto de $25,000, pagarías $5,000 al inicio y financiarías $20,000.',
          'financiero',
          true
        ),
        (
          'Tasa de interés',
          'Es el porcentaje que te cobra el banco por prestarte el dinero. Mientras más baja la tasa, menos pagarás en total.',
          'Porcentaje anual que se aplica sobre el capital financiado. Representa el costo del dinero prestado y se expresa como TNA (Tasa Nominal Anual).',
          'Con una tasa del 18% anual sobre $20,000, pagarás aproximadamente $300 de interés mensual al inicio del préstamo.',
          'financiero',
          true
        ),
        (
          'Plazo',
          'Es la cantidad de meses en los que vas a pagar el auto. Más meses = cuotas más bajas, pero pagas más interés total.',
          'Período de tiempo expresado en meses durante el cual se amortiza el préstamo mediante cuotas periódicas.',
          'Un préstamo de $15,000 a 36 meses tiene cuotas de ~$520, pero a 60 meses las cuotas bajan a ~$380 (aunque pagas más interés total).',
          'financiero',
          true
        ),
        (
          'Cuota mensual',
          'Es el monto fijo que pagas cada mes hasta terminar de pagar el auto. Incluye parte del préstamo más los intereses.',
          'Pago periódico que incluye amortización de capital e intereses, calculado mediante el sistema francés de amortización.',
          'Si financias $18,000 a 48 meses con tasa del 18%, tu cuota mensual será de aproximadamente $495.',
          'financiero',
          true
        ),
        (
          'TNA',
          'Tasa Nominal Anual. Es el porcentaje de interés que pagas por año, sin contar otros gastos.',
          'Tasa de interés anual expresada en términos nominales, sin incluir capitalización ni costos adicionales del financiamiento.',
          'Una TNA del 18% significa que por cada $10,000 que pidas prestados, pagarás $1,800 de interés anual (sin contar gastos).',
          'financiero',
          true
        ),
        (
          'CFT',
          'Costo Financiero Total. Es el costo real del préstamo incluyendo TODO: intereses, seguros, gastos administrativos, etc.',
          'Porcentaje que representa el costo total del crédito, incluyendo tasa de interés, comisiones, seguros y gastos administrativos.',
          'Un préstamo con TNA 18% puede tener un CFT del 25% si incluye seguro ($200/mes) y gastos administrativos ($500).',
          'financiero',
          true
        ),
        (
          'Comisión de apertura',
          'Es un pago único que hace el banco al inicio del préstamo por gestionar tu crédito.',
          'Cargo administrativo que cobra la entidad financiera al otorgar el préstamo, generalmente expresado como porcentaje del monto financiado.',
          'Si financias $20,000 con una comisión del 2.5%, pagarás $500 adicionales al inicio (puede sumarse al préstamo o pagarse aparte).',
          'financiero',
          true
        ),
        (
          'Aval',
          'Es una persona que firma el contrato contigo y se compromete a pagar si tú no puedes hacerlo.',
          'Garante que asume la responsabilidad solidaria de pago en caso de incumplimiento del deudor principal.',
          'Si pides un Plan Flex, necesitas un aval con ingresos demostrables que respalde el préstamo en caso de que no puedas pagar.',
          'legal',
          true
        ),
        (
          'Patentamiento',
          'Son los trámites y pagos para inscribir el auto a tu nombre en el registro oficial.',
          'Proceso legal y administrativo de inscripción del vehículo en el Registro Nacional de Automotores, incluyendo pago de impuestos y tasas.',
          'El patentamiento de un auto 0km incluye: inscripción inicial ($800), chapas ($150), formularios ($50) y gestión ($300). Total aproximado: $1,300.',
          'legal',
          true
        ),
        (
          'Transferencia',
          'Es el trámite legal para pasar la propiedad del auto del dueño anterior a tu nombre.',
          'Acto jurídico mediante el cual se transmite el dominio del vehículo, requiriendo certificación de firma, libre deuda y formularios oficiales.',
          'Al comprar un auto usado, la transferencia cuesta aproximadamente $600-$1,000 e incluye: verificación policial, formulario 08, certificación de firmas.',
          'legal',
          true
        ),
        (
          'Seguro todo riesgo',
          'Seguro que cubre daños totales o parciales de tu auto, ya sea por choque, robo, incendio, etc.',
          'Póliza de cobertura integral que protege el vehículo contra todo tipo de siniestros, incluyendo responsabilidad civil, daños propios y robo.',
          'Para un auto 0km de $25,000, el seguro todo riesgo cuesta aproximadamente $350-$500 por mes, dependiendo del modelo y tu perfil.',
          'comercial',
          true
        ),
        (
          'Verificación crediticia',
          'Es cuando el banco revisa tu historial financiero para saber si eres buen pagador.',
          'Análisis del historial crediticio del solicitante mediante consulta a centrales de riesgo (Veraz, Nosis) para evaluar capacidad y voluntad de pago.',
          'El banco verifica si tienes deudas impagas, cheques rechazados o atrasos en otros préstamos. Un buen historial mejora tus condiciones.',
          'financiero',
          true
        ),
        (
          'Amortización',
          'Es la parte de tu cuota mensual que se usa para pagar el préstamo en sí (sin contar los intereses).',
          'Proceso de reducción gradual del capital adeudado mediante pagos periódicos. En sistema francés, la amortización aumenta y los intereses disminuyen con el tiempo.',
          'En una cuota de $500, al inicio $300 son intereses y $200 amortización. Al final, $450 son amortización y $50 intereses.',
          'financiero',
          true
        ),
        (
          'Permuta',
          'Es cuando entregas tu auto usado como parte de pago para comprar uno nuevo o más nuevo.',
          'Operación comercial de intercambio donde se recibe un vehículo usado como parte de pago, valuándose según condiciones de mercado.',
          'Si tu auto usado vale $8,000 y el nuevo cuesta $25,000, das tu auto en permuta y financias solo $17,000 (menos el anticipo adicional).',
          'comercial',
          true
        )
      ON CONFLICT (termino) DO NOTHING;
    `);
    console.log('✅ Glosario IA creado');

    console.log('🎉 Seed de financiamiento completado exitosamente!');
    console.log('');
    console.log('📊 Resumen:');
    console.log('   - 3 planes de financiamiento');
    console.log('   - 5 tasas vigentes');
    console.log('   - 4 condiciones financieras');
    console.log('   - 15 términos del glosario');
    
  } catch (error) {
    console.error('❌ Error en seed de financiamiento:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

seedFinanciamiento();

