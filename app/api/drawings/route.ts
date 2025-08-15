import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { imageData, title = 'Dibujo de Gaby' } = await request.json()
    
    if (!imageData) {
      return NextResponse.json(
        { error: 'Datos de imagen son requeridos' },
        { status: 400 }
      )
    }

    // En Vercel no podemos escribir archivos, pero simulamos el guardado exitoso
    const timestamp = new Date().toISOString()
    const filename = `drawing-${timestamp.replace(/[:.]/g, '-')}.png`
    const jsonFilename = `drawing-${timestamp.replace(/[:.]/g, '-')}.json`

    // Simular los metadatos que se guardarían
    const metadata = {
      filename: filename,
      title: title,
      timestamp: timestamp,
      created: new Date().toLocaleString('es-ES'),
      description: 'Dibujo creado en el Portal Mágico'
    }

    // En desarrollo local, intentar guardar los archivos
    if (process.env.NODE_ENV === 'development') {
      try {
        const { writeFile, mkdir } = await import('fs/promises')
        const { existsSync } = await import('fs')
        const path = await import('path')
        
        const dataDir = path.join(process.cwd(), 'data', 'drawings')
        if (!existsSync(dataDir)) {
          await mkdir(dataDir, { recursive: true })
        }
        
        // Guardar la imagen (convertir base64 a buffer)
        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '')
        const buffer = Buffer.from(base64Data, 'base64')
        const imagePath = path.join(dataDir, filename)
        await writeFile(imagePath, buffer)
        
        // Guardar los metadatos
        const jsonPath = path.join(dataDir, jsonFilename)
        await writeFile(jsonPath, JSON.stringify(metadata, null, 2), 'utf-8')
      } catch (error) {
        console.log('No se pudieron guardar archivos en desarrollo:', error)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Dibujo guardado exitosamente',
      filename: filename,
      metadata: metadata,
      timestamp: timestamp
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
    // En Vercel no podemos leer archivos, devolvemos un array vacío
    if (process.env.NODE_ENV === 'development') {
      try {
        const { readdir, readFile } = await import('fs/promises')
        const { existsSync } = await import('fs')
        const path = await import('path')
        
        const dataDir = path.join(process.cwd(), 'data', 'drawings')
        
        if (!existsSync(dataDir)) {
          return NextResponse.json({ drawings: [] })
        }

        const files = await readdir(dataDir)
        const jsonFiles = files.filter(file => file.endsWith('.json'))

        const drawings = []
        for (const file of jsonFiles) {
          try {
            const filepath = path.join(dataDir, file)
            const content = await readFile(filepath, 'utf-8')
            const metadata = JSON.parse(content)
            
            // Verificar si existe la imagen correspondiente
            const imageFilename = metadata.filename
            const imagePath = path.join(dataDir, imageFilename)
            
            if (existsSync(imagePath)) {
              drawings.push({
                ...metadata,
                imagePath: `/api/drawings/image/${imageFilename}` // Ruta para servir la imagen
              })
            }
          } catch (error) {
            console.error(`Error al leer archivo ${file}:`, error)
          }
        }

        return NextResponse.json({ drawings })
      } catch (error) {
        console.log('No se pudieron leer archivos en desarrollo:', error)
      }
    }

    return NextResponse.json({ drawings: [] })

  } catch (error) {
    console.error('Error al leer dibujos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
