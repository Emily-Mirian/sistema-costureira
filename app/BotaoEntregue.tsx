"use client";

import { marcarComoEntregue } from './actions';
import { useRouter } from 'next/navigation'; // <-- 1. IMPORTAMOS O ROTEADOR

export default function BotaoEntregue({ pedidoId }: { pedidoId: number }) {
    const router = useRouter(); // <-- 2. ATIVAMOS O ROTEADOR

    return (
        <button
            className="botao-proximo"
            onClick={async () => {
                if (window.confirm("O pedido foi entregue para a cliente?")) {
                    await marcarComoEntregue(pedidoId); // Altera no banco

                    router.refresh(); // <-- 3. A MÁGICA: Obriga a tela a buscar os dados novos do servidor!
                }
            }}
        >
            ✓ Entregue
        </button>
    );
}