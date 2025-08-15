import { sql } from '@vercel/postgres';

export async function createTables() {
  try {
    // Crear tabla de deseos
    await sql`
      CREATE TABLE IF NOT EXISTS wishes (
        id SERIAL PRIMARY KEY,
        text TEXT NOT NULL,
        date VARCHAR(50) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Crear tabla de comentarios
    await sql`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        text TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'comentario',
        rating INTEGER DEFAULT 5,
        module VARCHAR(50) DEFAULT 'general',
        date VARCHAR(50) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Crear tabla de dibujos
    await sql`
      CREATE TABLE IF NOT EXISTS drawings (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url TEXT,
        date VARCHAR(50) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log('Tablas creadas exitosamente');
  } catch (error) {
    console.error('Error creando tablas:', error);
  }
}

export { sql };
