import Link from "next/link";
import { openDb } from '@/lib/db'; // Import a chave do nosso banco
import { revalidatePath } from 'next/cache'; // da um f5 invisivel quando atualizar o bd
import BotaoEntregue from './BotaoEntregue';

export default async function Home() {
    // conexão com o bd
    const db = await openDb();

    // Traz o pedido e os dados da dona do pedido
    const pedidos = await db.all(`
        SELECT
            Pedido.ID as pedidoId,
            Pedido.descricao,
            Pedido.status,
            Cliente.nome,
            Cliente.telefone,
            Cliente.nif
        FROM Pedido
        INNER JOIN Cliente ON Pedido.cliente_ID = Cliente.ID
    `);

    // Filtro da lista gigante em duas listas menores
    const pendentes = pedidos.filter(p => p.status === 'Pendente');
    const emAndamento = pedidos.filter(p => p.status === 'Em Andamento');
    const finalizados = pedidos.filter(p => p.status === 'Finalizado');

    async function mudarStatus(formData: FormData) {
        "use server"; // Garante que a segurança e execução fiquem no servidor

        const idDaTela = formData.get('id');
        const novoStatus = formData.get('status');

        console.log("--------------------");
        console.log("Botão clicado, pedido ID: ", idDaTela);
        console.log("tentar mudar para: ",novoStatus);

        try{
            const banco = await openDb();

            const idNumero = Number(idDaTela);

            // Atualiza a coluna status baseado no ID do pedido
            const resultado = await banco.run('UPDATE Pedido SET status = ? WHERE ID = ?', [novoStatus, idNumero]);

            // diz quantas linhas ele conseguiu alterar
            console.log("Linhas alteradas no banco:", resultado.changes);
            console.log("--------------------");

            // Recarrega a página Home instantaneamente para mostrar o cartão na nova coluna
            revalidatePath('/');
        } catch(erro){
            console.error("erro no update: ", erro);
        }
    }

    return (
        <main>
            <header className="header-principal">
                <div className="nome">
                    <h1>Ateliê</h1>
                </div>
                <div className="cadastro">
                    <Link href="/cadastro" className="botao-novo-pedido">
                        + Novo Pedido
                    </Link>
                </div>
            </header>

            <section className="quadro">

                <div className="coluna coluna-pendente">
                    <h2>Pendentes</h2>

                    {pendentes.map((pedido) => (
                        <article key={pedido.pedidoId} className="cartao-pedido">
                            <div className="info-linha">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icone-azul">
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                                </svg>
                                <p className="nome-cliente">{pedido.nome}</p>
                            </div>

                            <div className="info-linha">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icone-vermelho">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                </svg>
                                <a
                                    href={`https://wa.me/351${pedido.telefone.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="numero-cliente"
                                >
                                    {pedido.telefone}
                                </a>
                            </div>

                            <p className="nis-cliente">NIF {pedido.nif}</p>
                            <p className="descricao-produto">{pedido.descricao}</p>

                            <form action={mudarStatus}>
                                <input type="hidden" name="id" value={pedido.pedidoId} />
                                <input type="hidden" name="status" value="Em Andamento"/>
                                <button className="botao-proximo">→ Começar</button>
                            </form>
                        </article>
                    ))}
                </div>

                <div className="coluna coluna-andamento">
                    <h2>Em Andamento</h2>

                    {emAndamento.map((pedido) => (
                        <article key={pedido.pedidoId} className="cartao-pedido">
                             <div className="info-linha">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icone-azul">
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                                </svg>
                                <p className="nome-cliente">{pedido.nome}</p>
                            </div>
                            <div className="info-linha">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icone-vermelho">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                </svg>
                                <a
                                    href={`https://wa.me/351${pedido.telefone.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="numero-cliente"
                                >
                                    {pedido.telefone}
                                </a>
                            </div>

                            <p className="nis-cliente">NIF {pedido.nif}</p>
                            <p className="descricao-produto">{pedido.descricao}</p>
                            <div className="botao-andamento">
                                <form action={mudarStatus}>
                                    <input type="hidden" name="id" value={pedido.pedidoId} />
                                    <input type="hidden" name="status" value="Pendente" />
                                    <button className="botao-voltar">↩ Voltar</button>
                                </form>
                                <form action={mudarStatus}>
                                    <input type="hidden" name="id" value={pedido.pedidoId} />
                                    <input type="hidden" name="status" value="Finalizado" />
                                    <button className="botao-finalizar">✓ Finalizar</button>
                                </form>
                            </div>
                        </article>
                    ))}
                </div>
                <div className="coluna coluna-finalizado">
                    <h2>Finalizados</h2>
                    {finalizados.map((pedido) => (
                        <article key={pedido.pedidoId} className="cartao-pedido">
                            <div className="info-linha">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icone-azul">
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                                    </svg>
                                    <p className="nome-cliente">{pedido.nome}</p>
                            </div>
                            <div className="info-linha">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icone-vermelho">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                </svg>
                                <a
                                    href={`https://wa.me/351${pedido.telefone.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="numero-cliente"
                                >
                                    {pedido.telefone}
                                </a>
                            </div>
                            <p className="nis-cliente">NIF {pedido.nif}</p>
                            <p className="descricao-produto">{pedido.descricao}</p>

                            <div className="botao-andamento">
                                <form action={mudarStatus}>
                                    <input type="hidden" name="id" value={pedido.pedidoId} />
                                    <input type="hidden" name="status" value="Em Andamento" />
                                    <button className="botao-voltar">↩ Reabrir</button>
                                </form>

                                <BotaoEntregue pedidoId={pedido.pedidoId} mudarStatus={mudarStatus} />
                            </div>
                        </article>
                    ))}
                </div>

            </section>
        </main>
    );
}