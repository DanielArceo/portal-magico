import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const { imageData, title } = await request.json()
    
    if (!imageData) {
      return NextResponse.json(
        { error: 'Datos de imagen son requeridos' },
        { status: 400 }
      )
    }

    // Crear la carpeta data si no existe
    const dataDir = path.join(process.cwd(), 'data', 'drawings')
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true })
    }

    // Extraer los datos de la imagen (remover el prefijo data:image/png;base64,)
    const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '')
    
    // Crear nombre de archivo único
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `drawing-${timestamp}.png`
    const filepath = path.join(dataDir, filename)

    // Guardar la imagen como archivo PNG
    await writeFile(filepath, base64Data, 'base64')

    // Crear archivo de metadatos
    const metadataFilename = `drawing-${timestamp}.json`
    const metadataFilepath = path.join(dataDir, metadataFilename)
    
    const metadata = {
      filename: filename,
      title: title || 'Dibujo de Gaby',
      timestamp: new Date().toISOString(),
      created: new Date().toLocaleString('es-ES'),
      description: 'Dibujo creado en el Portal Mágico'
    }

    await writeFile(metadataFilepath, JSON.stringify(metadata, null, 2), 'utf-8')

    return NextResponse.json({
      success: true,
      message: 'Dibujo guardado exitosamente',
      filename: filename,
      metadataFile: metadataFilename,
      filepath: filepath
    })

  } catch (error) {
    console.error('Error al guardar dibujo:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'data', 'drawings')
    
    if (!existsSync(dataDir)) {
      return NextResponse.json({ drawings: [] })
    }

    // Leer todos los archivos de dibujos
    const { readdir } = await import('fs/promises')
    const files = await readdir(dataDir)
    const imageFiles = files.filter(file => file.endsWith('.png'))
    const metadataFiles = files.filter(file => file.endsWith('.json'))

    const drawings = []
    for (const imageFile of imageFiles) {
      try {
        // Buscar el archivo de metadatos correspondiente
        const baseName = imageFile.replace('.png', '')
        const metadataFile = metadataFiles.find(f => f === `${baseName}.json`)
        
        let metadata = {
          filename: imageFile,
          title: 'Dibujo de Gaby',
          timestamp: new Date().toISOString(),
          created: new Date().toLocaleString('es-ES')
        }

        if (metadataFile) {
          const metadataFilepath = path.join(dataDir, metadataFile)
          const metadataContent = await readFile(metadataFilepath, 'utf-8')
          metadata = { ...metadata, ...JSON.parse(metadataContent) }
        }

        drawings.push(metadata)
      } catch (error) {
        console.error(`Error al leer archivo ${imageFile}:`, error)
      }
    }

    return NextResponse.json({ drawings })

  } catch (error) {
    console.error('Error al leer dibujos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
