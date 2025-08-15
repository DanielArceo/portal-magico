import { NextResponse } from 'next/server'
import { createTables } from '@/lib/db'

export async function GET() {
  try {
    await createTables()
    
    return NextResponse.json({
      success: true,
      message: 'Base de datos inicializada correctamente'
    })
  } catch (error) {
    console.error('Error inicializando base de datos:', error)
    return NextResponse.json(
      { error: 'Error inicializando base de datos' },
      { status: 500 }
    )
  }
}
