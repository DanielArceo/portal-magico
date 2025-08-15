import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { createTables } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { wish, date } = await request.json()
    
    if (!wish || !date) {
      return NextResponse.json(
        { error: 'Deseo y fecha son requeridos' },
        { status: 400 }
      )
    }

    // Intentar crear las tablas si no existen
    try {
      await createTables()
    } catch (tableError) {
      console.warn('Error creando tablas, continuando...:', tableError)
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
    
    // Si es un error de tabla no encontrada, intentar crear las tablas
    if (error instanceof Error && error.message.includes('relation "wishes" does not exist')) {
      try {
        await createTables()
        // Intentar insertar de nuevo
        const { wish, date } = await request.json()
        
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
      } catch (retryError) {
        console.error('Error en reintento:', retryError)
        return NextResponse.json(
          { error: 'Error al guardar deseo. Intenta de nuevo.' },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Error al guardar deseo. Intenta de nuevo.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Intentar crear las tablas si no existen
    try {
      await createTables()
    } catch (tableError) {
      console.warn('Error creando tablas en GET, continuando...:', tableError)
    }

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
    
    // Si es un error de tabla no encontrada, intentar crear las tablas
    if (error instanceof Error && error.message.includes('relation "wishes" does not exist')) {
      try {
        await createTables()
        const result = await sql`
          SELECT id, text, date, timestamp
          FROM wishes
          ORDER BY timestamp DESC;
        `
        return NextResponse.json({
          wishes: result.rows,
          count: result.rows.length
        })
      } catch (retryError) {
        console.error('Error en reintento GET:', retryError)
        return NextResponse.json(
          { error: 'Error al leer deseos. Intenta de nuevo.' },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Error al leer deseos. Intenta de nuevo.' },
      { status: 500 }
    )
  }
}
