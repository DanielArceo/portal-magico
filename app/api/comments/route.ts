import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const { comment, type, rating, module } = await request.json()
    
    if (!comment) {
      return NextResponse.json(
        { error: 'El comentario es requerido' },
        { status: 400 }
      )
    }

    // Crear la carpeta data si no existe
    const dataDir = path.join(process.cwd(), 'data', 'comments')
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true })
    }

    // Crear nombre de archivo único
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `comment-${timestamp}.txt`
    const filepath = path.join(dataDir, filename)

    // Contenido del archivo
    const content = `💬 COMENTARIO Y SUGERENCIA DE GABY 💬
📅 Fecha: ${new Date().toLocaleDateString('es-ES')}
⏰ Timestamp: ${new Date().toISOString()}
🎯 Tipo: ${type || 'Comentario general'}
⭐ Calificación: ${rating ? '⭐'.repeat(rating) : 'No calificó'}
📱 Módulo: ${module || 'General'}
💭 Comentario: ${comment}

---
💝 Guardado con amor en el Portal Mágico
🌟 Tus comentarios nos ayudan a mejorar
`

    // Guardar el archivo
    await writeFile(filepath, content, 'utf-8')

    return NextResponse.json({
      success: true,
      message: 'Comentario guardado exitosamente',
      filename: filename,
      filepath: filepath
    })

  } catch (error) {
    console.error('Error al guardar comentario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'data', 'comments')
    
    if (!existsSync(dataDir)) {
      return NextResponse.json({ comments: [] })
    }

    // Leer todos los archivos de comentarios
    const { readdir } = await import('fs/promises')
    const files = await readdir(dataDir)
    const commentFiles = files.filter(file => file.endsWith('.txt'))

    const comments = []
    for (const file of commentFiles) {
      try {
        const filepath = path.join(dataDir, file)
        const content = await readFile(filepath, 'utf-8')
        const lines = content.split('\n')
        
        const comment = {
          filename: file,
          content: content,
          date: lines[1]?.replace('📅 Fecha: ', '') || '',
          timestamp: lines[2]?.replace('⏰ Timestamp: ', '') || '',
          type: lines[3]?.replace('🎯 Tipo: ', '') || '',
          rating: lines[4]?.replace('⭐ Calificación: ', '') || '',
          module: lines[5]?.replace('📱 Módulo: ', '') || '',
          comment: lines[6]?.replace('💭 Comentario: ', '') || ''
        }
        comments.push(comment)
      } catch (error) {
        console.error(`Error al leer archivo ${file}:`, error)
      }
    }

    return NextResponse.json({ comments })

  } catch (error) {
    console.error('Error al leer comentarios:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
