"use client"; // Avisa o Next.js que isso roda no navegador

import { useState } from 'react';
import Link from 'next/link';
import { iniciarCostura, marcarComoEntregue } from './actions';
import BotaoEntregue from './BotaoEntregue';

interface Cliente {
    ID: number;
    nome: string;
    telefone: string;
    nif: string;
}

interface Pedido {
    pedidoId: number;
    descricao: string;
    status: string;
    nome: string;
    telefone: string;
    nif: string;
}

export default function PainelAtelie({ clientesIniciais, pedidosIniciais }: { clientesIniciais: Cliente[], pedidosIniciais: Pedido[] }) {
    const [menuAberto, setMenuAberto] = useState(false);
    const [buscaClientes, setBuscaClientes] = useState('');
    const [buscaAndamento, setBuscaAndamento] = useState('');

    // Filtro da barra de pesquisa do Menu Hambúrguer
    const clientesFiltrados = clientesIniciais.filter(c =>
        c.nome.toLowerCase().includes(buscaClientes.toLowerCase()) ||
        c.telefone.includes(buscaClientes) ||
        c.nif.includes(buscaClientes)
    );

    // Filtro da barra de pesquisa principal
    const andamentoFiltrado = pedidosIniciais.filter(p =>
        p.nome.toLowerCase().includes(buscaAndamento.toLowerCase()) ||
        p.telefone.includes(buscaAndamento) ||
        p.nif.includes(buscaAndamento)
    );

    return (
        <main>
            {/* Fundo escuro do Menu Hambúrguer */}
            <div className={`overlay ${menuAberto ? 'aberto' : ''}`} onClick={() => setMenuAberto(false)}></div>

            {/* GAVETA DO MENU LATERAL */}
            <aside className={`menu-lateral ${menuAberto ? 'aberto' : ''}`}>
                <div className="cabecalho-menu">
                    <h1>Clientes</h1>
                    <button className="botao-fechar" onClick={() => setMenuAberto(false)}>✕</button>
                </div>

                <input
                    type="text"
                    className="barra-pesquisa"
                    placeholder="Pesquisar por nome, telefone ou NIF..."
                    value={buscaClientes}
                    onChange={(e) => setBuscaClientes(e.target.value)}
                />

                <Link href="/cadastro" className="botao-novo-pedido" style={{ marginBottom: '20px', display: 'block', textAlign: 'center' }}>
                    + Novo Cliente
                </Link>

                <div className="lista-clientes-scroll">
                    {clientesFiltrados.map(cliente => (
                        <div key={cliente.ID} className="cartao-cliente-simples">

                            {/* O flex: 1 faz esta caixa empurrar o botão para o canto direito! */}
                            <div style={{ flex: 1 }}>
                                <strong style={{ color: '#333' }}>{cliente.nome}</strong>
                                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#666' }}>{cliente.telefone}</p>
                            </div>

                            <button
                                onClick={async () => {
                                    await iniciarCostura(cliente.ID);
                                    setMenuAberto(false);
                                }}
                                className="botao-proximo"
                                style={{ padding: '8px 15px', fontSize: '13px', width: 'auto', flexShrink: 0 }}
                            >
                                + Costura
                            </button>
                        </div>
                    ))}
                </div>
            </aside>

            {/* CABEÇALHO PRINCIPAL DA TELA */}
            <header className="header-principal">
                <div className="cabecalho-mobile" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button className="botao-hamburguer" onClick={() => setMenuAberto(true)}>☰</button>
                    <h1>Ateliê</h1>
                </div>
            </header>

            {/* QUADRO PRINCIPAL - APENAS 1 COLUNA */}
            <section className="quadro" style={{ gridTemplateColumns: '1fr', maxWidth: '800px', margin: '0 auto' }}>
                <div className="coluna coluna-andamento" style={{ width: '100%' }}>
                    <h2>Em Andamento</h2>

                    <input
                        type="text"
                        className="barra-pesquisa"
                        placeholder="Buscar nas roupas em andamento..."
                        value={buscaAndamento}
                        onChange={(e) => setBuscaAndamento(e.target.value)}
                    />

                    {andamentoFiltrado.map((pedido) => (
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
                                    href={`https://wa.me/${pedido.telefone.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="numero-cliente"
                                >
                                    {pedido.telefone}
                                </a>
                            </div>

                            <p className="nis-cliente">NIF {pedido.nif}</p>

                            <div className="botao-andamento" style={{ marginTop: '15px' }}>
                                <BotaoEntregue pedidoId={pedido.pedidoId} />
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}