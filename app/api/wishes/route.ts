import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const { wish, date } = await request.json()
    
    if (!wish || !date) {
      return NextResponse.json(
        { error: 'Deseo y fecha son requeridos' },
        { status: 400 }
      )
    }

    // Crear la carpeta data si no existe
    const dataDir = path.join(process.cwd(), 'data', 'wishes')
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true })
    }

    // Crear nombre de archivo único
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `wish-${timestamp}.txt`
    const filepath = path.join(dataDir, filename)

    // Contenido del archivo
    const content = `🎂 DESEO MÁGICO DE GABY 🎂
📅 Fecha: ${date}
⏰ Timestamp: ${new Date().toISOString()}
✨ Deseo: ${wish}

---
💝 Guardado con amor en el Portal Mágico
🌟 Que todos tus deseos se hagan realidad
`

    // Guardar el archivo
    await writeFile(filepath, content, 'utf-8')

    return NextResponse.json({
      success: true,
      message: 'Deseo guardado exitosamente',
      filename: filename,
      filepath: filepath
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
    const dataDir = path.join(process.cwd(), 'data', 'wishes')
    
    if (!existsSync(dataDir)) {
      return NextResponse.json({ wishes: [] })
    }

    // Leer todos los archivos de deseos
    const { readdir } = await import('fs/promises')
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
    console.error('Error al leer deseos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
