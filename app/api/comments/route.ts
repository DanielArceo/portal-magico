import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { createTables } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { comment, type = 'comentario', rating = 5, module = 'general' } = await request.json()
    
    if (!comment) {
      return NextResponse.json(
        { error: 'Comentario es requerido' },
        { status: 400 }
      )
    }

    // Intentar crear las tablas si no existen
    try {
      await createTables()
    } catch (tableError) {
      console.warn('Error creando tablas, continuando...:', tableError)
    }

    const date = new Date().toLocaleDateString('es-ES')

    // Guardar en la base de datos
    const result = await sql`
      INSERT INTO comments (text, type, rating, module, date)
      VALUES (${comment}, ${type}, ${rating}, ${module}, ${date})
      RETURNING id, text, type, rating, module, date, timestamp;
    `

    const savedComment = result.rows[0]

    return NextResponse.json({
      success: true,
      message: 'Comentario guardado exitosamente en la base de datos',
      comment: savedComment
    })

  } catch (error) {
    console.error('Error al guardar comentario:', error)
    
    // Si es un error de tabla no encontrada, intentar crear las tablas
    if (error instanceof Error && error.message.includes('relation "comments" does not exist')) {
      try {
        await createTables()
        // Intentar insertar de nuevo
        const { comment, type = 'comentario', rating = 5, module = 'general' } = await request.json()
        const date = new Date().toLocaleDateString('es-ES')
        
        const result = await sql`
          INSERT INTO comments (text, type, rating, module, date)
          VALUES (${comment}, ${type}, ${rating}, ${module}, ${date})
          RETURNING id, text, type, rating, module, date, timestamp;
        `
        
        const savedComment = result.rows[0]
        return NextResponse.json({
          success: true,
          message: 'Comentario guardado exitosamente en la base de datos',
          comment: savedComment
        })
      } catch (retryError) {
        console.error('Error en reintento:', retryError)
        return NextResponse.json(
          { error: 'Error al guardar comentario. Intenta de nuevo.' },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Error al guardar comentario. Intenta de nuevo.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Obtener todos los comentarios de la base de datos
    const result = await sql`
      SELECT id, text, type, rating, module, date, timestamp
      FROM comments
      ORDER BY timestamp DESC;
    `

    return NextResponse.json({
      comments: result.rows,
      count: result.rows.length
    })

  } catch (error) {
    console.error('Error al leer comentarios:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
