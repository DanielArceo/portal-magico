import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { imageData, title = 'Dibujo de Gaby' } = await request.json()
    
    if (!imageData) {
      return NextResponse.json(
        { error: 'Datos de imagen son requeridos' },
        { status: 400 }
      )
    }

    const date = new Date().toLocaleDateString('es-ES')
    const description = 'Dibujo creado en el Portal Mágico'

    // Por ahora guardamos solo los metadatos
    // Las imágenes se pueden subir a Vercel Blob en el futuro
    const result = await sql`
      INSERT INTO drawings (title, description, image_url, date)
      VALUES (${title}, ${description}, ${'data:image/png;base64,' + imageData.substring(0, 100) + '...'}, ${date})
      RETURNING id, title, description, image_url, date, timestamp;
    `

    const savedDrawing = result.rows[0]

    return NextResponse.json({
      success: true,
      message: 'Dibujo guardado exitosamente en la base de datos',
      drawing: savedDrawing
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
    // Obtener todos los dibujos de la base de datos
    const result = await sql`
      SELECT id, title, description, image_url, date, timestamp
      FROM drawings
      ORDER BY timestamp DESC;
    `

    return NextResponse.json({
      drawings: result.rows,
      count: result.rows.length
    })

  } catch (error) {
    console.error('Error al leer dibujos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
