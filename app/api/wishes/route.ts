import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { wish, date } = await request.json()
    
    if (!wish || !date) {
      return NextResponse.json(
        { error: 'Deseo y fecha son requeridos' },
        { status: 400 }
      )
    }

    // Guardar en la base de datos
    const result = await sql`
      INSERT INTO wishes (text, date)
      VALUES (${wish}, ${date})
      RETURNING id, text, date, timestamp;
    `

    const savedWish = result.rows[0]

    return NextResponse.json({
      success: true,
      message: 'Deseo guardado exitosamente en la base de datos',
      wish: savedWish
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
    // Obtener todos los deseos de la base de datos
    const result = await sql`
      SELECT id, text, date, timestamp
      FROM wishes
      ORDER BY timestamp DESC;
    `

    return NextResponse.json({
      wishes: result.rows,
      count: result.rows.length
    })

  } catch (error) {
    console.error('Error al leer deseos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
