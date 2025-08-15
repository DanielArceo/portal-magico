import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { wish, date } = await request.json()
    
    if (!wish || !date) {
      return NextResponse.json(
        { error: 'Deseo y fecha son requeridos' },
        { status: 400 }
      )
    }

    // En Vercel no podemos escribir archivos, pero simulamos el guardado exitoso
    // Los datos se guardan en localStorage en el frontend
    const timestamp = new Date().toISOString()
    const filename = `wish-${timestamp.replace(/[:.]/g, '-')}.txt`

    // Simular el contenido que se guardaría
    const content = `🎂 DESEO MÁGICO DE GABY 🎂
📅 Fecha: ${date}
⏰ Timestamp: ${timestamp}
✨ Deseo: ${wish}

---
💝 Guardado con amor en el Portal Mágico
🌟 Que todos tus deseos se hagan realidad
`

    // En desarrollo local, intentar guardar el archivo
    if (process.env.NODE_ENV === 'development') {
      try {
        const { writeFile, mkdir } = await import('fs/promises')
        const { existsSync } = await import('fs')
        const path = await import('path')
        
        const dataDir = path.join(process.cwd(), 'data', 'wishes')
        if (!existsSync(dataDir)) {
          await mkdir(dataDir, { recursive: true })
        }
        
        const filepath = path.join(dataDir, filename)
        await writeFile(filepath, content, 'utf-8')
      } catch (error) {
        console.log('No se pudo guardar archivo en desarrollo:', error)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Deseo guardado exitosamente',
      filename: filename,
      content: content,
      timestamp: timestamp
    })

  } catch (error) {
    console.error('Error al guardar deseo:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // En Vercel no podemos leer archivos, devolvemos un array vacío
    // Los datos se manejan en localStorage en el frontend
    if (process.env.NODE_ENV === 'development') {
      try {
        const { readdir, readFile } = await import('fs/promises')
        const { existsSync } = await import('fs')
        const path = await import('path')
        
        const dataDir = path.join(process.cwd(), 'data', 'wishes')
        
        if (!existsSync(dataDir)) {
          return NextResponse.json({ wishes: [] })
        }

        const files = await readdir(dataDir)
        const wishFiles = files.filter(file => file.endsWith('.txt'))

        const wishes = []
        for (const file of wishFiles) {
          try {
            const filepath = path.join(dataDir, file)
            const content = await readFile(filepath, 'utf-8')
            const lines = content.split('\n')
            
            const wish = {
              filename: file,
              content: content,
              date: lines[1]?.replace('📅 Fecha: ', '') || '',
              timestamp: lines[2]?.replace('⏰ Timestamp: ', '') || '',
              wish: lines[3]?.replace('✨ Deseo: ', '') || ''
            }
            wishes.push(wish)
          } catch (error) {
            console.error(`Error al leer archivo ${file}:`, error)
          }
        }

        return NextResponse.json({ wishes })
      } catch (error) {
        console.log('No se pudieron leer archivos en desarrollo:', error)
      }
    }

    return NextResponse.json({ wishes: [] })

  } catch (error) {
    console.error('Error al leer deseos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
