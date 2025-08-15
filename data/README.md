# 📁 Estructura de Datos del Portal Mágico

Esta carpeta contiene todos los archivos generados por la aplicación del Portal Mágico.

## 📂 Estructura de Carpetas

```
data/
├── wishes/          # Deseos mágicos guardados
│   ├── wish-2024-12-25T10-30-45-123Z.txt
│   ├── wish-2024-12-25T11-15-22-456Z.txt
│   └── ...
├── drawings/        # Dibujos del Portal Mágico
│   ├── drawing-2024-12-25T10-30-45-123Z.png
│   ├── drawing-2024-12-25T10-30-45-123Z.json
│   ├── drawing-2024-12-25T11-15-22-456Z.png
│   ├── drawing-2024-12-25T11-15-22-456Z.json
│   └── ...
├── comments/        # Comentarios y sugerencias
│   ├── comment-2024-12-25T10-30-45-123Z.txt
│   ├── comment-2024-12-25T11-15-22-456Z.txt
│   └── ...
└── README.md        # Este archivo
```

## 🎂 Deseos Mágicos (`wishes/`)

Cada deseo se guarda en un archivo de texto con el formato:
- **Nombre**: `wish-YYYY-MM-DDTHH-MM-SS-sssZ.txt`
- **Contenido**: Texto formateado con emojis y metadatos

### Ejemplo de archivo de deseo:
```
🎂 DESEO MÁGICO DE GABY 🎂
📅 Fecha: 2024-12-25
⏰ Timestamp: 2024-12-25T10:30:45.123Z
✨ Deseo: Que este año esté lleno de amor y felicidad

---
💝 Guardado con amor en el Portal Mágico
🌟 Que todos tus deseos se hagan realidad
```

## 🎨 Dibujos del Portal Mágico (`drawings/`)

Cada dibujo se guarda como:
- **Archivo PNG**: `drawing-YYYY-MM-DDTHH-MM-SS-sssZ.png`
- **Metadatos JSON**: `drawing-YYYY-MM-DDTHH-MM-SS-sssZ.json`

### Ejemplo de archivo de metadatos:
```json
{
  "filename": "drawing-2024-12-25T10-30-45-123Z.png",
  "title": "Dibujo de Gaby",
  "timestamp": "2024-12-25T10:30:45.123Z",
  "created": "25/12/2024, 10:30:45",
  "description": "Dibujo creado en el Portal Mágico"
}
```

## 💬 Comentarios y Sugerencias (`comments/`)

Cada comentario se guarda en un archivo de texto con el formato:
- **Nombre**: `comment-YYYY-MM-DDTHH-MM-SS-sssZ.txt`
- **Contenido**: Texto formateado con emojis y metadatos

### Ejemplo de archivo de comentario:
```
💬 COMENTARIO Y SUGERENCIA DE GABY 💬
📅 Fecha: 2024-12-25
⏰ Timestamp: 2024-12-25T10:30:45.123Z
🎯 Tipo: Comentario general
⭐ Calificación: ⭐⭐⭐⭐⭐
📱 Módulo: drawing
💭 Comentario: ¡Me encantó el Portal Mágico! Es muy divertido dibujar aquí.

---
💝 Guardado con amor en el Portal Mágico
🌟 Tus comentarios nos ayudan a mejorar
```

## 🔧 APIs Disponibles

### Guardar Deseo
- **POST** `/api/wishes`
- **Body**: `{ "wish": "texto del deseo", "date": "2024-12-25" }`

### Leer Deseos
- **GET** `/api/wishes`
- **Response**: Lista de todos los deseos guardados

### Guardar Dibujo
- **POST** `/api/drawings`
- **Body**: `{ "imageData": "data:image/png;base64,...", "title": "Título opcional" }`

### Leer Dibujos
- **GET** `/api/drawings`
- **Response**: Lista de todos los dibujos guardados

### Guardar Comentario
- **POST** `/api/comments`
- **Body**: `{ "comment": "texto del comentario", "type": "comentario|sugerencia|feedback", "rating": 5, "module": "general" }`

### Leer Comentarios
- **GET** `/api/comments`
- **Response**: Lista de todos los comentarios guardados

## 💝 Notas Importantes

- Todos los archivos se crean automáticamente cuando se usan las funciones de la aplicación
- Los nombres de archivo incluyen timestamps únicos para evitar conflictos
- Los archivos se guardan en formato UTF-8 para compatibilidad
- Las imágenes se guardan en formato PNG para máxima calidad
- Los metadatos se guardan en formato JSON para fácil lectura

## 🌟 Backup y Seguridad

- Se recomienda hacer backup regular de esta carpeta
- Los archivos contienen información personal y sentimental
- Mantener esta carpeta segura y privada
