
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import '../../css/PointOfSale.css';
import CodigoOrDesconto from '@/Components/CodigoOrDesconto';
import QuantidadePopUp from '@/Components/QuantidadePopUp';
import PinGerentePopUp from '@/Components/PinGerentePopUp';
import RemoverItemPopUp from '@/Components/RemoverItemPopUp';
import ConfirmarCancelamentoPopUp from '@/Components/ConfirmarCancelamentoPopUp';


export default function PointOfSale({ user, caixa_id, caixa_status, vendas }) {

    // Helper function to safely convert values to numbers
    const toNumber = (value) => {
        if (value === null || value === undefined || value === '') return 0;
        if (typeof value === 'number') return value;
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
    };

    const produtoDoItem = (item) => {
        return produtos.find(p => p.codigo === item.produto_id) || {};
    };

    
    const [screenState, setScreenState] = useState('inputProdutos');
    const [itens, setItens] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [valorTotal, setValorTotal] = useState(0);
    const [loadingVenda, setLoadingVenda] = useState(true);
    const [tentouCriar, setTentouCriar] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [showQuantidadePopUp, setShowQuantidadePopUp] = useState(false);
    const [showPinGerentePopUp, setShowPinGerentePopUp] = useState(false);
    const [showRemoverItemPopUp, setShowRemoverItemPopUp] = useState(false);
    const [showConfirmarCancelamentoPopUp, setShowConfirmarCancelamentoPopUp] = useState(false);
    const [ultimoItem, setUltimoItem] = useState(null);
    const [totalUltimoItem, setTotalUltimoItem] = useState(0);
    const [pinRecebido, setPinRecebido] = useState('');
    
    // Função generalizada para mapear item com dados calculados
    const mapearItemComDados = (item, idx) => {
        const produto = produtos.find(p => p.codigo === item.produto_id) || {};
        const valorUnitario = toNumber(produto.valor_unitario);
        const quantidade = toNumber(item.qtde);
        const total = valorUnitario * quantidade;
        
        const formatarQuantidade = (qtd, unidade) => {
            if (unidade === 'UN') return qtd;
            return qtd < 1 ? qtd * 1000 + 'g' : qtd + 'kg';
        };

        return {
            ...item,
            index: idx + 1,
            produto,
            valorUnitario,
            quantidade,
            total,
            quantidadeFormatada: formatarQuantidade(quantidade, produto.unidade),
            valorUnitarioFormatado: `R$ ${valorUnitario.toFixed(2).replace('.', ',')}`,
            totalFormatado: `R$ ${total.toFixed(2).replace('.', ',')}`
        };
    };

    // Mapeia todos os itens com dados calculados
    const itensComDados = itens.map(mapearItemComDados);

    // Hook para redirecionamento automático com contador regressivo
    useEffect(() => {
        if (!caixa_status || caixa_status !== 'Aberto') {
            const interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        router.visit('/statusCaixa');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [caixa_status]);

    // Early return para caixa fechado
    if (!caixa_status || caixa_status !== 'Aberto') {
        return (
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center'}}>
                <h2>Caixa fechado ou não disponível. Por favor, abra um caixa para continuar.</h2>
                <p>Redirecionando para a página de caixas em {countdown} segundo{countdown !== 1 ? 's' : ''}...</p>
            </div>
        );
    }

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
                    
                    const itensAtualizados = data.itens || [];
                    const produtosAtualizados = data.produtos || [];
                    
                    // Define o último item
                    const ultimoItemAtualizado = itensAtualizados.length > 0 ? itensAtualizados[itensAtualizados.length - 1] : null;
                    setUltimoItem(ultimoItemAtualizado);
                    
                    // Calcula o total do último item usando os dados atualizados
                    if (ultimoItemAtualizado) {
                        const produtoUltimoItem = produtosAtualizados.find(p => p.codigo === ultimoItemAtualizado.produto_id) || {};
                        const valorUnitarioUltimoItem = toNumber(produtoUltimoItem.valor_unitario);
                        const quantidadeUltimoItem = toNumber(ultimoItemAtualizado.qtde);
                        setTotalUltimoItem(valorUnitarioUltimoItem * quantidadeUltimoItem);
                    } else {
                        setTotalUltimoItem(0);
                    }

                    // Calcula o valor total
                    const total = itensAtualizados.reduce((acc, item) => {
                        const produto = produtosAtualizados.find(p => p.codigo === item.produto_id);
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

    // Atualiza o total do último item quando ultimoItem ou produtos mudam
    useEffect(() => {
        if (ultimoItem && produtos.length > 0) {
            const produtoUltimoItem = produtos.find(p => p.codigo === ultimoItem.produto_id) || {};
            const valorUnitarioUltimoItem = toNumber(produtoUltimoItem.valor_unitario);
            const quantidadeUltimoItem = toNumber(ultimoItem.qtde);
            setTotalUltimoItem(valorUnitarioUltimoItem * quantidadeUltimoItem);
        } else {
            setTotalUltimoItem(0);
        }
    }, [ultimoItem, produtos]);

    
    useEffect(() => {
        const handleKeyDown = (event) => {
            switch (event.key) {
                case 'F2':
                    event.preventDefault();
                    setShowQuantidadePopUp(true);
                    break;
                case 'F3':
                    event.preventDefault();
                    setShowPinGerentePopUp(true);
                    break;
                case 'F4':
                    event.preventDefault();
                    setScreenState('pagamento');
                    break;
                case 'F5':
                    event.preventDefault();
                    setShowConfirmarCancelamentoPopUp(true);
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown); // limpeza
    }, [itens]);    
    
    if (loadingVenda) {
        return (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <h2>Criando venda, aguarde...</h2>
            </div>
        );
    }

    // Funções para o modal de quantidade
    const handleQuantidadeConfirm = (novaQuantidade) => {
        const produtoItem = produtoDoItem(ultimoItem);
        let json = null;
        if (itens.length > 0) {
            if (produtoItem.unidade === 'UN') {
                json = JSON.stringify({
                    nova_quantidade: novaQuantidade,
                    venda_id: vendaAtual.id
                });
                console.log('JSON para UN:', json);
            }
            else if (produtoItem.unidade === 'KG'){
                json = JSON.stringify({
                    novo_peso: novaQuantidade,
                    venda_id: vendaAtual.id
                });
                console.log('JSON para KG:', json);
            }
            else {
                console.error('JSON inválido, unidade não suportada:', json);
                return;
            }
   
            fetch(`/pointOfSale/acoes/${produtoItem.unidade == 'UN' ? 'nova-quantidade' : 'novo-peso'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Accept': 'application/json',
                },
                body: json
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Quantidade alterada com sucesso:', data);
                    carregarItensVenda(); // Recarrega os itens após a alteração
                } else {
                    console.error('Erro ao alterar quantidade:', data);
                    alert(data.message || 'Erro ao alterar quantidade. Verifique se o código está correto.');
                }
            })
            .catch(error => {
                console.error('Erro ao alterar quantidade:', error);
                alert('Erro ao alterar quantidade. Verifique se o código está correto.');
            });
        }
        setShowQuantidadePopUp(false);
    };

    const handleQuantidadeCancel = () => {
        setShowQuantidadePopUp(false);
    };

    // Funções para o modal de PIN do gerente
    const handlePinConfirm = async (pin) => {
        setPinRecebido(pin);
        console.log('PIN digitado:', pin);
        try {
            const response = await fetch(`/pointOfSale/acoes/validar-gerente?pin=${encodeURIComponent(pin)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                }
            });
            const data = await response.json();
            if (response.ok && data.success) {
                console.log('Pin verificado com sucesso');
                setShowPinGerentePopUp(false);
                setShowRemoverItemPopUp(true);
            } else {
                console.error('Pin incorreto', data);
                alert('O PIN digitado está incorreto. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao validar PIN:', error);
            alert('Erro ao validar PIN. Tente novamente.');
        }
    };

    const handlePinCancel = () => {
        setShowPinGerentePopUp(false);
    };

    const handleRemoverItemConfirm = (id) => {
        console.log('ID do item a remover:', id);
        router.post('/pointOfSale/acoes/remover-item', {
            item_id: id,
            pin: pinRecebido,
            venda_id: vendaAtual.id
        }, {
            onSuccess: () => {
                console.log('Item removido com sucesso');
                setShowRemoverItemPopUp(false);
                carregarItensVenda(); // Recarrega os itens após a remoção
            },
            onError: (errors) => {
                console.error('Erro ao remover item:', errors);
                alert('Erro ao remover item. Verifique se o ID está correto.');
            }
        });
    };

    const handleRemoverItemCancel = () => {
        setShowRemoverItemPopUp(false);
    };
    
    const cancelarVenda = () => {
        router.post('/pointOfSale/acoes/cancelar', {
            venda_id: vendaAtual.id
        }, {
            onSuccess: () => {
                console.log('Venda cancelada com sucesso');
                setShowConfirmarCancelamentoPopUp(false);
                // Redireciona para a criação de uma nova venda
                router.visit('/pointOfSale');
            },
            onError: (errors) => {
                console.error('Erro ao cancelar venda:', errors);
                alert('Erro ao cancelar venda. Tente novamente.');
                setShowConfirmarCancelamentoPopUp(false);
            }
        });
    };

    const handleConfirmarCancelamento = () => {
        cancelarVenda();
    };

    const handleCancelarCancelamento = () => {
        setShowConfirmarCancelamentoPopUp(false);
    };

    return (
        <>
            <Head title="Ponto de Venda" />
            <AuthenticatedLayout>
                <div className="ponto-venda-container">
                    <div className="cabecalho-ponto-venda">
                        <h1>{produtoDoItem(ultimoItem).nome}</h1>
                    </div>

                    <div id="painel-itens">
                        {/* Coluna lateral */}
                        <div className="barra-lateral">
                            <CodigoOrDesconto
                                state={screenState}
                                vendaAtual={vendaAtual}
                                recarregaItensAdicionados={carregarItensVenda}
                                produtos={produtos}
                            />

                            <div className="cartao-escuro valor-unitario">
                                <div className="titulo-cartao">Valor unitário</div>
                                <div className="valor-cartao">
                                    <h2>R$ {ultimoItem ? toNumber(produtoDoItem(ultimoItem).valor_unitario).toFixed(2).replace('.', ',') : '0,00'}</h2>
                                </div>
                            </div>

                            <div className="cartao-escuro total-item">
                                <div className="titulo-cartao">Total do item</div>
                                <div className="valor-cartao">
                                    <h2>R$ {toNumber(totalUltimoItem).toFixed(2).replace('.', ',')}</h2>
                                </div>
                            </div>

                            <div className="cartao-atalhos">
                                <ul>
                                    <li>F2 - Alterar quantidade/peso</li>
                                    <li>F3 - Excluir item</li>
                                    <li>F4 - Ir para o pagamento</li>
                                    <li>F5 - Cancelar venda</li>
                                </ul>
                            </div>
                        </div>

                        {/* Coluna principal */}
                        <div className="coluna-principal">
                            <div className="carrinho-wrapper">
                                <table className="carrinho">
                                    <thead>
                                        <tr>
                                            <th>Nº</th>
                                            <th>Código</th>
                                            <th>Descrição</th>
                                            <th>Qtd.</th>
                                            <th>Valor Unitário</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {itensComDados.length > 0 ? itensComDados.map((itemData, idx) => (
                                            <tr key={itemData.id_item || idx}>
                                                <td>{itemData.index}</td>
                                                <td>{itemData.produto_id}</td>
                                                <td>{itemData.produto.nome || 'Produto não encontrado'}</td>
                                                <td>{itemData.quantidadeFormatada}</td>
                                                <td>{itemData.valorUnitarioFormatado}</td>
                                                <td>{itemData.totalFormatado}</td>
                                            </tr>
                                        )) : (
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
            
            {/* Modal de quantidade */}
            <QuantidadePopUp
                aparecendo={showQuantidadePopUp}
                tipoItem={ultimoItem ? (produtoDoItem(ultimoItem).unidade) : null}
                aoFechar={handleQuantidadeCancel}
                aoConfirmar={handleQuantidadeConfirm}
                valorInicial="1"
            />

            <PinGerentePopUp
                aparecendo={showPinGerentePopUp}
                aoConfirmar={handlePinConfirm}
                aoFechar={handlePinCancel}
                titulo="Insira o PIN do gerente para continuar:"
            />

            <RemoverItemPopUp
                aparecendo={showRemoverItemPopUp}
                aoConfirmar={handleRemoverItemConfirm}
                aoFechar={handleRemoverItemCancel}
                mapeamento={itensComDados}
            />

            <ConfirmarCancelamentoPopUp
                aparecendo={showConfirmarCancelamentoPopUp}
                aoConfirmar={handleConfirmarCancelamento}
                aoFechar={handleCancelarCancelamento}
            />
        </>
    );
}
