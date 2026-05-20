"use server";

import { openDb } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Acionado ao clicar no botão do Menu Hambúrguer para abrir um novo pedido para um cliente existente
export async function iniciarCostura(clienteId: number) {
    const db = await openDb();
    await db.run(
        "INSERT INTO Pedido (descricao, status, cliente_ID) VALUES (?, ?, ?)",
        ["", "Em Andamento", clienteId]
    );
    revalidatePath('/');
}

// Muda o status para Entregue (faz sumir da tela de ativos)
export async function marcarComoEntregue(pedidoId: number) {
    const db = await openDb();
    const resultado = await db.run("UPDATE Pedido SET status = ? WHERE ID = ?", ["Entregue", pedidoId]);

    // Isso vai printar no terminal do seu VS Code para confirmar a alteração
    console.log(`[Banco] Pedido ${pedidoId} atualizado para Entregue. Linhas alteradas:`, resultado.changes);

    revalidatePath('/');
}