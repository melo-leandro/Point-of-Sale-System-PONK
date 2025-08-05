
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import '../../css/PointOfSale.css';
import CodigoOrDesconto from '@/Components/CodigoOrDesconto';


export default function PointOfSale({ user, caixa_id, caixa_status, vendas }) {

    const [screenState, setScreenState] = useState('inputProdutos');
    const [itens, setItens] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [valorTotal, setValorTotal] = useState(0);
    const [loadingVenda, setLoadingVenda] = useState(true);
    const [tentouCriar, setTentouCriar] = useState(false);

    
    const vendaAtual = vendas && vendas.find(v => v.status === 'pendente' && v.caixa_id === caixa_id);
    
        // Cria uma venda automaticamente ao entrar na página se não houver venda pendente
    useEffect(() => {
        if (!vendaAtual && !tentouCriar) {
            setTentouCriar(true);
            router.post('/vendas', {
                cpf_cliente: null,
                forma_pagamento: 'dinheiro',
                valor_total: 0,
                status: 'pendente',
                caixa_id: caixa_id
            }, {
                preserveScroll: true,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                onSuccess: (response) => {
                    setLoadingVenda(false);
                },
                onError: (errors) => {
                    console.error('Erro ao criar venda:', errors);
                    setLoadingVenda(false);
                }
            });
        } else if (vendaAtual) {
            setLoadingVenda(false);
        }
    }, [vendaAtual, caixa_id, tentouCriar, vendas]);

    
    useEffect(() => {
        const handleKeyDown = (event) => {
            switch (event.key) {
                case 'F1':
                    event.preventDefault();
                    // Implementar lógica para excluir item
                    break;
                case 'F2':
                    event.preventDefault();
                    // Implementar lógica para inserir quantidade/peso
                    break;
                case 'F3':
                    event.preventDefault();
                    // Implementar lógica para ir para o pagamento
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown); // limpeza
    }, []);

    if (loadingVenda) {
        return (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <h2>Criando venda, aguarde...</h2>
            </div>
        );
    }

    return (
        <>
            <Head title="Ponto de Venda" />
            <AuthenticatedLayout>
                <div className="ponto-venda-container">
                    <div className="cabecalho-ponto-venda">
                        <h1>NOME DOS ITENS AQUI IMPLEMENTAR</h1>
                    </div>

                    <div id="painel-itens">
                        {/* Coluna lateral */}
                        <div className="barra-lateral">
                            <CodigoOrDesconto
                                state={screenState}
                                vendaAtual={vendaAtual}
                            />

                            <div className="cartao-escuro valor-unitario">
                                <div className="titulo-cartao">Valor unitário</div>
                                <div className="valor-cartao">
                                    <h2>R$ 0,00</h2>
                                </div>
                            </div>

                            <div className="cartao-escuro total-item">
                                <div className="titulo-cartao">Total do item</div>
                                <div className="valor-cartao">
                                    <h2>R$ 0,00</h2>
                                </div>
                            </div>

                            <div className="cartao-atalhos">
                                <ul>
                                    <li>F1 - Excluir item</li>
                                    <li>F2 - Inserir quantidade/peso</li>
                                    <li>F3 - Ir para o pagamento</li>
                                </ul>
                            </div>
                        </div>

                        {/* Coluna principal */}
                        <div className="coluna-principal">
                            <div className="carrinho-wrapper">
                                <table className="carrinho">
                                    <thead>
                                        <tr>
                                            <th>Nº Item</th>
                                            <th>Código</th>
                                            <th>Descrição</th>
                                            <th>Quantidade</th>
                                            <th>Valor Unitário</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {itens.map((item, idx) => {
                                            const produto = produtos[idx] || {};
                                            return (
                                                <tr key={item.id || idx}>
                                                    <td>{idx + 1}</td>
                                                    <td>{item.produto_id}</td>
                                                    <td>{produto.nome || ''}</td>
                                                    <td>{item.qtde}</td>
                                                    <td>R$ {produto.valor_unitario ? produto.valor_unitario.toFixed(2) : '0,00'}</td>
                                                    <td>R$ {produto.valor_unitario && item.qtde ? (produto.valor_unitario * item.qtde).toFixed(2) : '0,00'}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="cartao-total">
                                <div className="rotulo">
                                    <h2>Valor total</h2>
                                </div>
                                <div className="valor">
                                    <h2>R$ {valorTotal.toFixed(2)}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
