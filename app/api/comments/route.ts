import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { comment, type = 'comentario', rating = 5, module = 'general' } = await request.json()
    
    if (!comment) {
      return NextResponse.json(
        { error: 'Comentario es requerido' },
        { status: 400 }
      )
    }

    // En Vercel no podemos escribir archivos, pero simulamos el guardado exitoso
    const timestamp = new Date().toISOString()
    const filename = `comment-${timestamp.replace(/[:.]/g, '-')}.txt`

    // Simular el contenido que se guardaría
    const content = `💬 COMENTARIO Y SUGERENCIA DE GABY 💬
📅 Fecha: ${new Date().toLocaleDateString('es-ES')}
⏰ Timestamp: ${timestamp}
🎯 Tipo: ${type}
⭐ Calificación: ${'⭐'.repeat(rating)}
📱 Módulo: ${module}
💭 Comentario: ${comment}

---
💝 Guardado con amor en el Portal Mágico
🌟 Tus comentarios nos ayudan a mejorar
`

    // En desarrollo local, intentar guardar el archivo
    if (process.env.NODE_ENV === 'development') {
      try {
        const { writeFile, mkdir } = await import('fs/promises')
        const { existsSync } = await import('fs')
        const path = await import('path')
        
        const dataDir = path.join(process.cwd(), 'data', 'comments')
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
      message: 'Comentario guardado exitosamente',
      filename: filename,
      content: content,
      timestamp: timestamp
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
    // En Vercel no podemos leer archivos, devolvemos un array vacío
    if (process.env.NODE_ENV === 'development') {
      try {
        const { readdir, readFile } = await import('fs/promises')
        const { existsSync } = await import('fs')
        const path = await import('path')
        
        const dataDir = path.join(process.cwd(), 'data', 'comments')
        
        if (!existsSync(dataDir)) {
          return NextResponse.json({ comments: [] })
        }

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
        console.log('No se pudieron leer archivos en desarrollo:', error)
      }
    }

    return NextResponse.json({ comments: [] })

  } catch (error) {
    console.error('Error al leer comentarios:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
