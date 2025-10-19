# Configuración de Base de Datos PostgreSQL

## 📋 Pasos para Conectar a la Base de Datos

### 1. Crear archivo `.env`

Copia el archivo `.env.example` y renómbralo a `.env`:

```bash
cp .env.example .env
```

### 2. Configurar credenciales en `.env`

Edita el archivo `.env` con tus credenciales reales:

```env
# Puerto del servidor
PORT=3000

# Dominio público
PUBLIC_URL=http://localhost:3000

# Base de Datos PostgreSQL
DB_HOST=127.0.0.1
DB_PORT=5433
DB_NAME=concesionaria_db
DB_USER=facu
DB_PASSWORD=TU_PASSWORD_REAL_AQUI

# Ambiente
NODE_ENV=development
```

⚠️ **IMPORTANTE:** Reemplaza `TU_PASSWORD_REAL_AQUI` con la contraseña real de tu base de datos.

### 3. Poblar la Base de Datos

Ejecuta el script de seed para crear los datos iniciales:

```bash
npm run seed
```

Este comando creará:
- ✅ 5 Marcas (Renault, Toyota, Volkswagen, Ford, Chevrolet)
- ✅ 11 Modelos
- ✅ 12 Vehículos (6 nuevos Renault + 6 usados de varias marcas)
- ✅ 12 Imágenes

### 4. Iniciar el Servidor

```bash
npm run dev
```

El servidor iniciará en `http://localhost:3000`

---

## 🔍 Verificación

Si todo está configurado correctamente, deberías ver en la consola:

```
✅ Conexión a PostgreSQL establecida correctamente
🚗 MACUA app corriendo en http://localhost:3000
```

---

## 🚨 Solución de Problemas

### Error: "Connection refused"

**Causa:** No se puede conectar a PostgreSQL

**Solución:**
1. Verifica que PostgreSQL esté corriendo en el droplet
2. Verifica que el puerto sea el correcto (5433)
3. Si estás conectando desde tu PC local, asegúrate de tener acceso remoto configurado

### Error: "Authentication failed"

**Causa:** Usuario o contraseña incorrectos

**Solución:**
1. Verifica las credenciales en el archivo `.env`
2. Asegúrate de que el usuario `facu` tenga permisos en la base de datos

### Error: "Database does not exist"

**Causa:** La base de datos no existe

**Solución:**
1. Conéctate al droplet y crea la base de datos:
```bash
sudo -u postgres psql -p 5433 -c "CREATE DATABASE concesionaria_db;"
```

### Error: "Relation does not exist"

**Causa:** Las tablas no fueron creadas

**Solución:**
1. Verifica que ejecutaste el script SQL de creación de tablas
2. Ejecuta el seed nuevamente: `npm run seed`

---

## 📊 Datos de Ejemplo Creados

### Vehículos 0km Renault:
1. **Duster 2025** - SUV 4x4 - $24,500,000
2. **Arkana 2025** - SUV - $28,900,000
3. **Koleos 2025** - SUV 7 pasajeros - $45,800,000
4. **Kwid 2025** - Hatchback - $14,900,000
5. **Kardian 2025** - SUV Compacto - $19,500,000
6. **Master 2025** - Van Utilitaria - $38,900,000

### Vehículos Usados:
1. **Toyota Corolla 2020** - 45,000 km - $18,500,000
2. **Toyota Hilux 2019** - 78,000 km - $32,500,000
3. **Volkswagen Amarok 2018** - 95,000 km - $28,900,000
4. **Ford Ranger 2021** - 52,000 km - $38,500,000
5. **Chevrolet Cruze 2019** - 62,000 km - $16,800,000

---

## 🔄 Cambios Realizados

### Archivos Creados:
- `src/config/database.js` - Configuración de Sequelize
- `src/models/Marca.js` - Modelo de Marca
- `src/models/Modelo.js` - Modelo de Modelo
- `src/models/Vehiculo.js` - Modelo de Vehículo
- `src/models/ImagenVehiculo.js` - Modelo de Imagen
- `src/models/index.js` - Índice de modelos con relaciones
- `src/database/seed.js` - Script de seed

### Archivos Modificados:
- `src/controllers/pages.controller.js` - Actualizado para usar BD
- `package.json` - Agregadas dependencias de Sequelize
- `.env.example` - Agregadas variables de BD

### Frontend:
- ✅ **Sin cambios** - El frontend funciona exactamente igual
- ✅ **Misma API** - Los endpoints siguen siendo los mismos
- ✅ **Mismo formato** - Los datos tienen el mismo formato JSON

---

## 🎯 Próximos Pasos

Una vez que todo funcione correctamente:

1. ✅ Verificar que el listado de vehículos carga correctamente
2. ✅ Verificar que los filtros funcionan
3. ✅ Verificar que el detalle de vehículo carga
4. ✅ Verificar que la búsqueda funciona

Si todo funciona bien, estarás listo para:
- Agregar más vehículos desde el CRM (próxima fase)
- Implementar autenticación
- Agregar funcionalidades de e-commerce

---

## 📞 Soporte

Si tienes algún problema, verifica:
1. Los logs de la consola al iniciar el servidor
2. Los logs de PostgreSQL en el droplet
3. La conectividad de red entre tu PC y el droplet

