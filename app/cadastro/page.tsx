"use client"; // Avisa que tem JavaScript rodando

import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Ferramenta para redirecionar a tela

export default function Cadastro() {
    const router = useRouter(); // Inicializa o nosso redirecionador

    // analogia com java: método void do Java
    async function criarNovoPedido(evento: React.FormEvent<HTMLFormElement>) {
        // Isso nn deixa a página piscar no recarregar do HTML
        evento.preventDefault();

        // FormData pega todos os inputs de uma vez
        const formData = new FormData(evento.currentTarget);

        // pacote de dados q vão para o back
        const pacoteDeDados = {
            nome: formData.get('nome'),
            telefone: formData.get('telefone'),
            nif: formData.get('nif'),
            descricao: formData.get('descricao')
        };

        try {
            // ponte com o Back-end. Chamamos a rota que fizemos antes.
            const resposta = await fetch('/api/clientes', {
                method: 'POST', // (INSERT)
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pacoteDeDados), // Transforma o pacote em texto JSON
            });

            if (resposta.ok) {
                alert("Pedido salvo com sucesso!");
                router.push('/'); // Manda o usuario de volta para o quadro
            } else {
                alert("Deu erro ao salvar no banco de dados.");
            }
        } catch (erro) {
            console.error("Erro de conexão:", erro);
        }
    }

    return (
        <div className="box-cadastro">
            <div className="modal-cadastro">
                <h1>Novo Pedido</h1>

                {/* se apertar enter é igual apertar cadastrar*/}
                <form className="formulario-costura" onSubmit={criarNovoPedido}>

                    <div className="campo">
                        <label htmlFor="nome">Nome da Cliente</label>
                        <input type="text" id="nome" name="nome" placeholder="Ex: Maria Silva" required />
                    </div>

                    <div className="campo">
                        <label htmlFor="telefone">Telefone</label>
                        <input type="text" id="telefone" name="telefone" placeholder="(41) 99999-9999" required />
                    </div>

                    <div className="campo">
                        <label htmlFor="nif">NIF</label>
                        <input type="text" id="nif" name="nif" placeholder="99999999999" required />
                    </div>

                    <div className="campo">
                        <label htmlFor="descricao">Descrição do Serviço</label>
                        <textarea id="descricao" name="descricao" placeholder="Ex: Ajuste de barra em vestido" required></textarea>
                    </div>

                    <div className="grupo-botoes">
                        <Link href="/">
                            <button type="button" className="botao-cadastro cancelar">
                                Cancelar
                            </button>
                        </Link>

                        <button type="submit" className="botao-cadastro salvar">
                            Criar Pedido
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}