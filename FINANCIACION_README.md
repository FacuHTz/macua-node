# Pantalla de Financiación - Chat Interactivo

## 📋 Descripción

Nueva pantalla de financiación con chat interactivo impulsado por IA que ayuda a los usuarios a calcular cuotas de financiamiento en tiempo real.

## 🚀 Instalación y Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Agregar en `.env`:

```env
OPENAI_API_KEY=tu_api_key_de_openai
```

### 3. Ejecutar seed de financiamiento

```bash
npm run seed:financiamiento
```

Este comando creará:
- 3 planes de financiamiento
- Tasas vigentes
- Condiciones financieras por plazo
- Glosario de términos

### 4. Iniciar servidor

```bash
npm run dev
```

### 5. Acceder a la pantalla

Abrir en el navegador: `http://localhost:3000/financiacion`

## 📁 Archivos Creados

```
src/
├── controllers/
│   └── financiamiento.controller.js    # Lógica del chat y API
├── routes/
│   └── financiamiento.js               # Rutas de financiación
└── database/
    └── seed-financiamiento.js          # Datos iniciales

views/
└── financiacion.ejs                    # Vista principal

public/assets/
├── css/
│   └── financiacion.css                # Estilos
└── js/
    └── financiacion.js                 # Lógica del frontend
```

## 🎯 Funcionalidades

### Chat Interactivo
- Conversación natural con IA
- Cálculo de cuotas en tiempo real
- Consulta de vehículos disponibles
- Explicación de términos financieros

### Planes de Financiamiento
- Plan Tradicional (18.5% TNA)
- Plan 0% Interés (12 cuotas)
- Plan Flex (22% TNA, hasta 72 meses)

### Ejemplos de Uso

**Usuario:** "Quiero financiar una Duster"
**IA:** "La Renault Duster tiene un precio de $25,000. ¿Cuánto podrías dar de anticipo?"

**Usuario:** "Puedo dar $5,000 de anticipo"
**IA:** "Perfecto. Con $5,000 de anticipo, financiarías $20,000. ¿En cuántos meses te gustaría pagarlo?"

**Usuario:** "36 meses"
**IA:** "Con el Plan Tradicional (18.5% anual) en 36 meses, tu cuota sería de aproximadamente $720/mes."

## 🔧 Tablas de BD Utilizadas

- `planes_financiamiento` - Planes disponibles
- `tasas_vigentes` - Tasas actuales
- `condiciones_financieras` - Condiciones por plazo
- `glosario_ia` - Términos explicables
- `conversaciones_ia` - Sesiones de chat
- `mensajes_ia` - Historial de mensajes
- `vehiculos` - Vehículos disponibles

## 🎨 Estilo

Mantiene la coherencia visual con el resto del sitio:
- Colores: Negro (#1a1a1a), Amarillo (#ffcc00)
- Tipografía consistente
- Diseño responsive
- Animaciones suaves

## 📊 API Endpoints

### GET `/financiacion`
Muestra la página de financiación

### GET `/api/financiamiento/planes`
Retorna todos los planes activos

### POST `/api/financiamiento/chat`
Procesa mensajes del chat

**Body:**
```json
{
  "conversacion_id": 123,  // opcional, null para nueva conversación
  "mensaje": "texto del usuario"
}
```

**Response:**
```json
{
  "conversacion_id": 123,
  "respuesta": "texto de la IA"
}
```

## 🧪 Testing

Probar diferentes escenarios:

1. Consulta de vehículo específico
2. Cálculo con diferentes anticipos
3. Comparación de plazos
4. Preguntas sobre términos (anticipo, tasa, CFT)
5. Cambio de plan de financiamiento

## 💡 Optimizaciones Futuras

- [ ] Caché de respuestas frecuentes
- [ ] Sugerencias de opciones de financiamiento
- [ ] Integración con sistema de reservas
- [ ] Exportar simulación a PDF
- [ ] Guardar simulaciones para usuarios registrados

## 🐛 Solución de Problemas

**Error: "OPENAI_API_KEY no definida"**
- Verificar que `.env` tenga la clave correcta

**Error: "Tablas no existen"**
- Ejecutar `npm run seed:financiamiento`

**Chat no responde**
- Verificar conexión a internet
- Revisar logs del servidor
- Verificar cuota de OpenAI API

## 📝 Notas

- El chat usa GPT-3.5-turbo para optimizar costos
- Máximo 300 tokens por respuesta
- Historial limitado a últimos 10 mensajes
- Conversaciones no se eliminan automáticamente

