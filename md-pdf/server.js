const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const FILES_DIR = path.join(__dirname, 'files');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Servir archivos estáticos desde el directorio md-pdf

// Asegurar que el directorio files existe
async function ensureFilesDir() {
    try {
        await fs.access(FILES_DIR);
    } catch {
        await fs.mkdir(FILES_DIR, { recursive: true });
        console.log('Directorio files creado');
    }
}

// Ruta para guardar archivos .md
app.post('/api/save-md', async (req, res) => {
    try {
        const { filename, content } = req.body;

        if (!filename || !content) {
            return res.status(400).json({ error: 'Se requiere filename y content' });
        }

        // Validar que el nombre del archivo termine en .md
        if (!filename.endsWith('.md')) {
            return res.status(400).json({ error: 'El archivo debe tener extensión .md' });
        }

        // Validar que el nombre del archivo no contenga caracteres peligrosos
        if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
            return res.status(400).json({ error: 'Nombre de archivo inválido' });
        }

        const filePath = path.join(FILES_DIR, filename);
        await fs.writeFile(filePath, content, 'utf8');

        res.json({ 
            success: true, 
            message: `Archivo ${filename} guardado exitosamente`,
            filename: filename
        });
    } catch (error) {
        console.error('Error al guardar archivo:', error);
        res.status(500).json({ error: 'Error al guardar el archivo' });
    }
});

// Ruta para listar archivos .md
app.get('/api/list-md', async (req, res) => {
    try {
        const files = await fs.readdir(FILES_DIR);
        const mdFiles = files
            .filter(file => file.endsWith('.md') || file.endsWith('.markdown'))
            .map(file => ({
                filename: file,
                name: file.replace(/\.(md|markdown)$/, '')
            }));

        res.json({ files: mdFiles });
    } catch (error) {
        console.error('Error al listar archivos:', error);
        res.status(500).json({ error: 'Error al listar archivos' });
    }
});

// Ruta para obtener el contenido de un archivo .md
app.get('/api/get-md/:filename', async (req, res) => {
    try {
        const { filename } = req.params;

        // Validar que el nombre del archivo no contenga caracteres peligrosos
        if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
            return res.status(400).json({ error: 'Nombre de archivo inválido' });
        }

        const filePath = path.join(FILES_DIR, filename);
        
        // Verificar que el archivo existe
        try {
            await fs.access(filePath);
        } catch {
            return res.status(404).json({ error: 'Archivo no encontrado' });
        }

        const content = await fs.readFile(filePath, 'utf8');
        res.json({ 
            filename: filename,
            content: content 
        });
    } catch (error) {
        console.error('Error al leer archivo:', error);
        res.status(500).json({ error: 'Error al leer el archivo' });
    }
});

// Iniciar servidor
async function startServer() {
    await ensureFilesDir();
    
    app.listen(PORT, () => {
        console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
        console.log(`Archivos estáticos servidos desde: ${__dirname}`);
        console.log(`Archivos .md guardados en: ${FILES_DIR}`);
    });
}

startServer().catch(console.error);

