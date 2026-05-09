import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await openDb();

    await db.exec(`
      CREATE TABLE IF NOT EXISTS Cliente (
        ID INTEGER PRIMARY KEY,
        nome TEXT NOT NULL,
        telefone TEXT NOT NULL,
        nif TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS Pedido (
        ID INTEGER PRIMARY KEY,
        descricao TEXT NOT NULL,
        status TEXT NOT NULL,
        cliente_ID INTEGER,
        FOREIGN KEY(cliente_ID) REFERENCES Cliente(ID)
      );
    `);

    return NextResponse.json({ mensagem: "Banco de dados e tabelas criados com sucesso!" });
  } catch (error) {
    return NextResponse.json({ erro: "Deu algo errado", detalhes: error }, { status: 500 });
  }
}