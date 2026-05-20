import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function GET() {
    const db = await openDb();
    const clientes = await db.all('SELECT * FROM Cliente');
    return NextResponse.json(clientes);
}

export async function POST(request: Request) {
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
            descricao TEXT,
            status TEXT NOT NULL,
            cliente_ID INTEGER,
            FOREIGN KEY(cliente_ID) REFERENCES Cliente(ID)
        );
    `);

    const dados = await request.json();

    try {
        let cliente = await db.get('SELECT ID FROM Cliente WHERE nif = ?', [dados.nif]);
        let clienteId;

        if (!cliente) {
            const resultado = await db.run(
                'INSERT INTO Cliente (nome, telefone, nif) VALUES (?, ?, ?)',
                [dados.nome, dados.telefone, dados.nif]
            );
            clienteId = resultado.lastID;
        } else {
            clienteId = cliente.ID;
        }

        await db.run(
            'INSERT INTO Pedido (descricao, status, cliente_ID) VALUES (?, ?, ?)',
            ['', 'Em Andamento', clienteId]
        );

        return NextResponse.json({ mensagem: "Cliente cadastrado e costura iniciada!" });

    } catch (erro) {
        console.error("Erro no servidor:", erro);
        return NextResponse.json({ erro: "Falha ao salvar no banco" }, { status: 500 });
    }
}