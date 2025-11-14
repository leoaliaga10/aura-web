# Convertidor Markdown a PDF

Aplicación web para convertir archivos Markdown a PDF y gestionar documentación.

## Características

1. **Conversión a PDF**: Convierte archivos Markdown a PDF respetando el tamaño A4
2. **Guardado de archivos**: Guarda archivos .md en la carpeta `files`
3. **Visualizador de documentación**: Página web para listar y visualizar archivos .md guardados (solo lectura)

## Instalación

1. Instala las dependencias (puedes usar `npm` o `pnpm`):
```bash
npm install
# o
pnpm install
```

## Uso

1. Inicia el servidor:
```bash
npm start
# o
pnpm start
```

2. Abre tu navegador en:
   - Editor: `http://localhost:3000/v3.html`
   - Visualizador: `http://localhost:3000/viewer.html`

## Estructura

- `v3.html`: Editor principal para convertir Markdown a PDF
- `viewer.html`: Visualizador de archivos .md guardados
- `server.js`: Servidor Express para manejar guardado y listado de archivos
- `files/`: Carpeta donde se guardan los archivos .md

## API Endpoints

- `POST /api/save-md`: Guarda un archivo .md
- `GET /api/list-md`: Lista todos los archivos .md disponibles
- `GET /api/get-md/:filename`: Obtiene el contenido de un archivo .md específico

