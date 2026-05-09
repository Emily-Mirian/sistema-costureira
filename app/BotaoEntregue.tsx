"use client"; // avisa o Next.js que isso roda no navegador

export default function BotaoEntregue({ pedidoId, mudarStatus }: { pedidoId: number, mudarStatus: (formData: FormData) => void }) {
    return (
        <form action={mudarStatus} onSubmit={(e) => {
            // Se clicar em "Cancelar" no aviso, o envio é interrompido
            if (!window.confirm("O pedido foi entregue para o cliente?")) {
                e.preventDefault();
            }
        }}>
            <input type="hidden" name="id" value={pedidoId} />
            <input type="hidden" name="status" value="Entregue" />
            <button type="submit" className="botao-proximo">
                ✓ Entregue
            </button>
        </form>
    );
}