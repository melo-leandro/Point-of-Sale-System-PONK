
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import '../../css/PointOfSale.css';
import CodigoOrDesconto from '@/Components/CodigoOrDesconto';


export default function PointOfSale({ user, caixa_id, caixa_status, vendas }) {

    if(!caixa_status || caixa_status !== 'aberto') {
        const [countdown, setCountdown] = useState(5);

        // Hook para redirecionamento automático com contador regressivo
        useEffect(() => {
            const interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        router.visit('/');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }, []);

        return (
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center'}}>
                <h2>Caixa fechado ou não disponível. Por favor, abra um caixa para continuar.</h2>
                <p>Redirecionando para a página de caixas em {countdown} segundo{countdown !== 1 ? 's' : ''}...</p>
            </div>

        );
    }
    // Helper function to safely convert values to numbers
    const toNumber = (value) => {
        if (value === null || value === undefined || value === '') return 0;
        if (typeof value === 'number') return value;
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
    };

    const [screenState, setScreenState] = useState('inputProdutos');
    const [itens, setItens] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [valorTotal, setValorTotal] = useState(0);
    const [loadingVenda, setLoadingVenda] = useState(true);
    const [tentouCriar, setTentouCriar] = useState(false);


    
    const vendaAtual = vendas && vendas.find(v => v.status === 'pendente' && v.caixa_id === caixa_id);
    
    // Função para carregar itens da venda
    const carregarItensVenda = async () => {
        if (vendaAtual && vendaAtual.id) {
            try {
                const response = await fetch(`/pointOfSale/acoes/itens-adicionados?venda_id=${vendaAtual.id}`, {
                    method: 'GET',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                        'Accept': 'application/json',
                    }
                });

                const data = await response.json();
                
                if (response.ok && data.success) {
                    setItens(data.itens || []);
                    setProdutos(data.produtos || []);
                    
                    // Calcula o valor total
                    const total = (data.itens || []).reduce((acc, item) => {
                        const produto = (data.produtos || []).find(p => p.codigo === item.produto_id);
                        if (produto && produto.valor_unitario) {
                            const valorUnitario = toNumber(produto.valor_unitario);
                            const quantidade = toNumber(item.qtde);
                            return acc + (valorUnitario * quantidade);
                        }
                        return acc;
                    }, 0);
                    setValorTotal(total);
                } else {
                    console.error('Erro ao carregar itens:', data);
                }
            } catch (error) {
                console.error('Erro ao carregar itens:', error);
            }
        }
    };
    
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
                onSuccess: (response) => {
                    setLoadingVenda(false);
                    // O Inertia vai automaticamente atualizar os props com a nova venda
                },
                onError: (errors) => {
                    console.error('Erro ao criar venda:', errors);
                    setLoadingVenda(false);
                }
            });
        } else if (vendaAtual) {
            setLoadingVenda(false);
            carregarItensVenda(); // Carrega os itens quando a venda estiver disponível
        }
    }, [vendaAtual, caixa_id, tentouCriar, vendas]);

    // Carrega itens quando a venda muda
    useEffect(() => {
        if (vendaAtual && !loadingVenda) {
            carregarItensVenda();
        }
    }, [vendaAtual]);

    
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
                                onItemAdded={carregarItensVenda}
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
                                        {itens.length > 0 ? itens.map((item, idx) => {
                                            const produto = produtos.find(p => p.codigo === item.produto_id) || {};
                                            const valorUnitario = toNumber(produto.valor_unitario);
                                            const quantidade = toNumber(item.qtde);
                                            const total = valorUnitario * quantidade;
                                            return (
                                                <tr key={item.id_item || idx}>
                                                    <td>{idx + 1}</td>
                                                    <td>{item.produto_id}</td>
                                                    <td>{produto.nome || 'Produto não encontrado'}</td>
                                                    <td>{quantidade}</td>
                                                    <td>R$ {valorUnitario.toFixed(2).replace('.', ',')}</td>
                                                    <td>R$ {total.toFixed(2).replace('.', ',')}</td>
                                                </tr>
                                            );
                                        }) : (
                                            <tr>
                                                <td colSpan="6" style={{textAlign: 'center', padding: '20px', color: '#666'}}>
                                                    Nenhum item adicionado
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="cartao-total">
                                <div className="rotulo">
                                    <h2>Valor total</h2>
                                </div>
                                <div className="valor">
                                    <h2>R$ {toNumber(valorTotal).toFixed(2).replace('.', ',')}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
