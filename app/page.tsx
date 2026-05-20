import { openDb } from '@/lib/db';
import PainelAtelie from './PainelAtelie';

export default async function Home() {
    // conexão com o bd
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

    const clientes = await db.all("SELECT * FROM Cliente ORDER BY nome ASC");

    // Traz o pedido e os dados da dona do pedido
    const pedidosEmAndamento = await db.all(`
        SELECT
            Pedido.ID as pedidoId,
            Pedido.descricao,
            Pedido.status,
            Cliente.nome,
            Cliente.telefone,
            Cliente.nif
        FROM Pedido
        INNER JOIN Cliente ON Pedido.cliente_ID = Cliente.ID
        WHERE Pedido.status = 'Em Andamento'
    `);
    return (
            <PainelAtelie
                clientesIniciais={clientes}
                pedidosIniciais={pedidosEmAndamento}
            />
    );
}

