import CodigoOrDesconto from '@/Components/CodigoOrDesconto';
import ConfirmarCancelamentoPopUp from '@/Components/ConfirmarCancelamentoPopUp';
import PinGerentePopUp from '@/Components/PinGerentePopUp';
import QuantidadePopUp from '@/Components/QuantidadePopUp';
import RemoverItemPopUp from '@/Components/RemoverItemPopUp';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import '../../css/PointOfSale.css';
import CodigoOrDesconto from '@/Components/CodigoOrDesconto';
import QuantidadePopUp from '@/Components/QuantidadePopUp';
import PinGerentePopUp from '@/Components/PinGerentePopUp';
import RemoverItemPopUp from '@/Components/RemoverItemPopUp';
import ConfirmarCancelamentoPopUp from '@/Components/ConfirmarCancelamentoPopUp';
import ValorDisplay from '@/Components/ValorDisplay';
import TotalItemDisplay from '@/Components/TotalItemDisplay';
import Atalhos from '@/Components/Atalhos';
import InserirCPFPopUp from '@/Components/InserirCPFPopUp';
import InserirValorPopUp from '@/Components/InserirValorPopUp';
import FinalizarVendaPopUp from '@/Components/FinalizarVendaPopUp';
import TotalETroco from '@/Components/TotalETroco';


export default function PointOfSale({ user, caixa_id, caixa_status, vendas }) {
    // Helper function to safely convert values to numbers
    const toNumber = (value) => {
        if (value === null || value === undefined || value === '') return 0;
        if (typeof value === 'number') return value;
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
    };

    const produtoDoItem = (item) => {
        if (!item || !item.produto_id) return {};
        return produtos.find(p => p.codigo === item.produto_id) || {};
    };

    const [screenState, setScreenState] = useState('inputProdutos');
    const [itens, setItens] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [valorTotal, setValorTotal] = useState(0);
    const [loadingVenda, setLoadingVenda] = useState(true);
    const [loadingCancelamento, setLoadingCancelamento] = useState(false);
    const [tentouCriar, setTentouCriar] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [showQuantidadePopUp, setShowQuantidadePopUp] = useState(false);
    const [showPinGerentePopUp, setShowPinGerentePopUp] = useState(false);
    const [showRemoverItemPopUp, setShowRemoverItemPopUp] = useState(false);
    const [showConfirmarCancelamentoPopUp, setShowConfirmarCancelamentoPopUp] = useState(false);
    const [showInserirCPF, setShowInserirCPF] = useState(false);
    const [showInserirValor, setShowInserirValor] = useState(false);
    const [showFinalizarVenda, setShowFinalizarVenda] = useState(false);
    const [valorRecebido, setValorRecebido] = useState(0);
    const [ultimoItem, setUltimoItem] = useState(null);
    const [totalUltimoItem, setTotalUltimoItem] = useState(0);
    const [pinRecebido, setPinRecebido] = useState('');
    const [objetivoPin, setObjetivoPin] = useState('');
    const [formaPagamento, setFormaPagamento] = useState('dinheiro');

    // useEffect(() => {
    //     if(screenState === 'pagamento'){

    //     }
    // }, [screenState]);

    // Função generalizada para mapear item com dados calculados
    const mapearItemComDados = (item, idx) => {
        if (!item || !item.produto_id) {
            return {
                ...item,
                index: idx + 1,
                produto: {},
                valorUnitario: 0,
                quantidade: 0,
                total: 0,
                quantidadeFormatada: '0',
                valorUnitarioFormatado: 'R$ 0,00',
                totalFormatado: 'R$ 0,00'
            };
        }

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
            quantidadeFormatada: formatarQuantidade(
                quantidade,
                produto.unidade,
            ),
            valorUnitarioFormatado: `R$ ${valorUnitario.toFixed(2).replace('.', ',')}`,
            totalFormatado: `R$ ${total.toFixed(2).replace('.', ',')}`,
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
                        router.visit('/dashboard');
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
            <div style={{
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                backgroundImage: 'url(/img/background.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
                padding: '20px'
            }}>
                {/* Container principal com estilo do site */}
                <div style={{
                    background: '#003254',
                    color: 'white',
                    borderRadius: '8px',
                    padding: '40px',
                    textAlign: 'center',
                    maxWidth: '500px',
                    width: '100%',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                    {/* Ícone */}
                    <div style={{
                        fontSize: '64px',
                        marginBottom: '20px'
                    }}>
                        🔒
                    </div>
                    
                    {/* Título */}
                    <h2 style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        margin: '0 0 16px 0',
                        color: 'white'
                    }}>
                        Caixa Fechado
                    </h2>
                    
                    {/* Mensagem */}
                    <p style={{
                        fontSize: '16px',
                        lineHeight: '1.5',
                        margin: '0 0 24px 0',
                        opacity: '0.9'
                    }}>
                        O caixa não está disponível no momento.<br />
                        Por favor, abra um caixa para continuar.
                    </p>
                    
                    {/* Contador */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                        padding: '12px',
                        marginBottom: '20px'
                    }}>
                        <p style={{
                            margin: '0',
                            fontSize: '14px'
                        }}>
                            Redirecionando em <strong>{countdown}</strong> segundo{countdown !== 1 ? 's' : ''}...
                        </p>
                    </div>

                    {/* Barra de progresso simples */}
                    <div style={{
                        width: '100%',
                        height: '4px',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '2px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${((5 - countdown) / 5) * 100}%`,
                            height: '100%',
                            backgroundColor: 'white',
                            borderRadius: '2px',
                            transition: 'width 1s ease-in-out'
                        }}></div>
                    </div>
                </div>
            </div>
        );
    }

    const vendaAtual =
        vendas &&
        vendas.find((v) => v.status === 'pendente' && v.caixa_id === caixa_id);

    // Função para carregar itens da venda
    const carregarItensVenda = async () => {
        if (vendaAtual && vendaAtual.id) {
            try {
                const response = await fetch(
                    `/pointOfSale/acoes/itens-adicionados?venda_id=${vendaAtual.id}`,
                    {
                        method: 'GET',
                        headers: {
                            'X-CSRF-TOKEN': document
                                .querySelector('meta[name="csrf-token"]')
                                .getAttribute('content'),
                            Accept: 'application/json',
                        },
                    },
                );

                const data = await response.json();

                if (response.ok && data.success) {
                    setItens(data.itens || []);
                    setProdutos(data.produtos || []);

                    const itensAtualizados = data.itens || [];
                    const produtosAtualizados = data.produtos || [];

                    // Define o último item
                    const ultimoItemAtualizado =
                        itensAtualizados.length > 0
                            ? itensAtualizados[itensAtualizados.length - 1]
                            : null;
                    setUltimoItem(ultimoItemAtualizado);

                    // Calcula o total do último item usando os dados atualizados
                    if (ultimoItemAtualizado) {
                        const produtoUltimoItem =
                            produtosAtualizados.find(
                                (p) =>
                                    p.codigo ===
                                    ultimoItemAtualizado.produto_id,
                            ) || {};
                        const valorUnitarioUltimoItem = toNumber(
                            produtoUltimoItem.valor_unitario,
                        );
                        const quantidadeUltimoItem = toNumber(
                            ultimoItemAtualizado.qtde,
                        );
                        setTotalUltimoItem(
                            valorUnitarioUltimoItem * quantidadeUltimoItem,
                        );
                    } else {
                        setTotalUltimoItem(0);
                    }

                    // Calcula o valor total
                    setValorTotal(data.novo_valor_total || 0);
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
                    console.log('Venda criada com sucesso', response);
                    // Aguarda um pequeno delay para garantir que a venda foi persistida
                    setTimeout(() => {
                        setLoadingVenda(false);
                    }, 200);
                },
                onError: (errors) => {
                    console.error('Erro ao criar venda:', errors);
                    setLoadingVenda(false);
                }
            });
        } else if (vendaAtual) {
            carregarItensVenda(); // Carrega os itens quando a venda estiver disponível
            setLoadingVenda(false);
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
            const produtoUltimoItem =
                produtos.find((p) => p.codigo === ultimoItem.produto_id) || {};
            const valorUnitarioUltimoItem = toNumber(
                produtoUltimoItem.valor_unitario,
            );
            const quantidadeUltimoItem = toNumber(ultimoItem.qtde);
            setTotalUltimoItem(valorUnitarioUltimoItem * quantidadeUltimoItem);
        } else {
            setTotalUltimoItem(0);
        }
    }, [ultimoItem, produtos]);

    // Atualiza o valor recebido automaticamente para cartão quando o total muda
    useEffect(() => {
        if (formaPagamento === 'cartao_credito' || formaPagamento === 'cartao_debito') {
            setValorRecebido(valorTotal);
        }
    }, [valorTotal, formaPagamento]);

    
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (screenState === 'inputProdutos') {
                switch (event.key) {
                    case 'F2':
                        event.preventDefault();
                        setShowQuantidadePopUp(true);
                        break;
                    case 'F3':
                        event.preventDefault();
                        setShowPinGerentePopUp(true);
                        setObjetivoPin('removerItem');
                        break;
                    case 'F4':
                        event.preventDefault();
                        setScreenState('pagamento');
                        break;
                    case 'F10':
                        event.preventDefault();
                        setShowConfirmarCancelamentoPopUp(true);
                        setObjetivoPin('cancelarVenda');
                        break;
                }
            }
            else {
                switch (event.key) {
                    case 'F3':
                        event.preventDefault();
                        setShowInserirCPF(true);
                        break;
                    case 'F4':
                        event.preventDefault();
                        // Validar se há itens na venda
                        if (valorTotal <= 0 || itens.length === 0) {
                            alert('Não há itens na venda para finalizar.');
                            return;
                        }
                        // Validar se o valor recebido foi informado (exceto para cartão)
                        if (formaPagamento !== 'cartao_credito' && formaPagamento !== 'cartao_debito' && valorRecebido <= 0) {
                            alert('É necessário informar o valor recebido antes de finalizar a venda. Pressione F7 para inserir o valor.');
                            return;
                        }
                        // Para cartão, define automaticamente o valor recebido como igual ao total
                        if (formaPagamento === 'cartao_credito' || formaPagamento === 'cartao_debito') {
                            setValorRecebido(valorTotal);
                        }

                        // Validar se o valor recebido é suficiente
                        const valorFinalValidacao = (formaPagamento === 'cartao_credito' || formaPagamento === 'cartao_debito') ? valorTotal : valorRecebido;
                        if (valorFinalValidacao < valorTotal) {
                            alert(`Valor insuficiente! O valor recebido (R$ ${valorFinalValidacao.toFixed(2).replace('.', ',')}) é menor que o total da venda (R$ ${valorTotal.toFixed(2).replace('.', ',')}).`);
                            return;
                        }

                        setShowFinalizarVenda(true);
                        break;
                    case 'F6':
                        event.preventDefault();
                        alert("Não foi encontrada nenhuma impressora compatível.");
                        break;
                    case 'F7':
                        event.preventDefault();
                        if (formaPagamento === 'cartao_credito' || formaPagamento === 'cartao_debito') {
                            alert('Para pagamentos com cartão, o valor é automaticamente igual ao total da venda.');
                        } else {
                            setShowInserirValor(true);
                        }
                        break;
                    case 'F8':
                        event.preventDefault();
                        alert('A gaveta não foi encontrada. Verifique com seu administrador.');
                        break;
                    case 'F10':
                        event.preventDefault();
                        setShowConfirmarCancelamentoPopUp(true);
                        setObjetivoPin('cancelarVenda');
                        break;
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown); // limpeza
    }, [screenState, itens, valorTotal, valorRecebido, formaPagamento]);    
    
    if (loadingVenda) {
        return (
            <div style={{
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                backgroundColor: '#f8f9fa',
                color: '#333'
            }}>
                {/* Spinner */}
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid #e0e0e0',
                    borderTop: '3px solid #007bff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: '20px'
                }}></div>
                
                {/* Texto */}
                <p style={{
                    fontSize: '16px',
                    margin: '0',
                    textAlign: 'center'
                }}>
                    Criando venda, aguarde...
                </p>

                {/* CSS Animation */}
                <style jsx>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    // Funções para o modal de quantidade
    const handleQuantidadeConfirm = (novaQuantidade) => {
        if (!ultimoItem) {
            alert('Nenhum item selecionado para alterar quantidade.');
            setShowQuantidadePopUp(false);
            return;
        }

        const produtoItem = produtoDoItem(ultimoItem);
        if (!produtoItem || !produtoItem.unidade) {
            alert('Produto não encontrado ou sem unidade definida.');
            setShowQuantidadePopUp(false);
            return;
        }

        let json = null;
        if (itens.length > 0) {
            if (produtoItem.unidade === 'UN') {
                json = JSON.stringify({
                    nova_quantidade: novaQuantidade,
                    venda_id: vendaAtual.id,
                });
                console.log('JSON para UN:', json);
            } else if (produtoItem.unidade === 'KG') {
                json = JSON.stringify({
                    novo_peso: novaQuantidade,
                    venda_id: vendaAtual.id,
                });
                console.log('JSON para KG:', json);
            }
            else {
                console.error('JSON inválido, unidade não suportada:', produtoItem.unidade);
                setShowQuantidadePopUp(false);
                return;
            }

            fetch(
                `/pointOfSale/acoes/${produtoItem.unidade == 'UN' ? 'nova-quantidade' : 'novo-peso'}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute('content'),
                        Accept: 'application/json',
                    },
                    body: json,
                },
            )
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        console.log('Quantidade alterada com sucesso:', data);
                        carregarItensVenda(); // Recarrega os itens após a alteração
                    } else {
                        console.error('Erro ao alterar quantidade:', data);
                        alert(
                            data.message ||
                                'Erro ao alterar quantidade. Verifique se o código está correto.',
                        );
                    }
                })
                .catch((error) => {
                    console.error('Erro ao alterar quantidade:', error);
                    alert(
                        'Erro ao alterar quantidade. Verifique se o código está correto.',
                    );
                });
        }
        setShowQuantidadePopUp(false);
    };

    const handleQuantidadeCancel = () => {
        setShowQuantidadePopUp(false);
    };

    // Funções para o modal de PIN do gerente
    const handlePinConfirm = async (pin) => {
        console.log('PIN digitado:', pin);
        console.log('Objetivo do PIN:', objetivoPin);
        
        try {
            const response = await fetch(
                `/pointOfSale/acoes/validar-gerente?pin=${encodeURIComponent(pin)}`,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'X-CSRF-TOKEN': document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute('content'),
                    },
                },
            );
            const data = await response.json();
            if (response.ok && data.success) {
                console.log('Pin verificado com sucesso');
                setPinRecebido(pin); // Define o PIN ANTES de fechar o modal
                setShowPinGerentePopUp(false);
                
                if (objetivoPin === 'removerItem') {
                    setShowRemoverItemPopUp(true);
                }
                else if (objetivoPin === 'cancelarVenda') {
                    // Usa o PIN diretamente, não depende do estado
                    cancelarVendaComPin(pin);
                }
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
        router.post(
            '/pointOfSale/acoes/remover-item',
            {
                item_id: id,
                pin: pinRecebido,
                venda_id: vendaAtual.id,
            },
            {
                onSuccess: () => {
                    console.log('Item removido com sucesso');
                    setShowRemoverItemPopUp(false);
                    carregarItensVenda(); // Recarrega os itens após a remoção
                },
                onError: (errors) => {
                    console.error('Erro ao remover item:', errors);
                    alert(
                        'Erro ao remover item. Verifique se o ID está correto.',
                    );
                },
            },
        );
    };

    const handleRemoverItemCancel = () => {
        setShowRemoverItemPopUp(false);
    };
    
    const cancelarVendaComPin = (pin) => {
        console.log('Cancelando venda com PIN direto:', pin);
        console.log('Venda atual completa:', vendaAtual);
        console.log('ID da venda:', vendaAtual?.id);
        console.log('Tipo do ID:', typeof vendaAtual?.id);
        
        // Previne múltiplas submissões
        if (loadingCancelamento) {
            console.log('Cancelamento já em progresso, ignorando nova tentativa');
            return;
        }
        
        if (!pin) {
            alert('PIN do gerente é obrigatório para cancelar a venda.');
            return;
        }
        
        if (!vendaAtual || !vendaAtual.id) {
            alert('Nenhuma venda ativa encontrada para cancelar.');
            return;
        }

        setLoadingCancelamento(true);

        router.post('/pointOfSale/acoes/cancelar', {
            venda_id: vendaAtual.id,
            pin: pin
        }, {
            onSuccess: (page) => {
                console.log('Venda cancelada com sucesso');
                setShowConfirmarCancelamentoPopUp(false);
                setPinRecebido(''); 
                setLoadingCancelamento(false);
                // O redirect para dashboard será automático pelo Inertia
            },
            onError: (errors) => {
                console.error('Erro ao cancelar venda:', errors);
                const errorMessage = errors.message || 'Erro ao cancelar venda. Tente novamente.';
                alert(errorMessage);
                setShowConfirmarCancelamentoPopUp(false);
                setLoadingCancelamento(false);
                router.reload();
            },
            onFinish: () => {
                setLoadingCancelamento(false);
            }
        });
    };

    const handleConfirmarCancelamento = () => {
        setShowConfirmarCancelamentoPopUp(false);
        setObjetivoPin('cancelarVenda');
        setShowPinGerentePopUp(true);
    };

    const handleCancelarCancelamento = () => {
        setShowConfirmarCancelamentoPopUp(false);
    };

    // Funções para o modal de CPF
    const handleCPFConfirm = (cpf) => {
        if (!vendaAtual || !vendaAtual.id) {
            console.error('Nenhuma venda ativa encontrada');
            alert('Erro: Nenhuma venda ativa encontrada.');
            setShowInserirCPF(false);
            return;
        }

        fetch('/pointOfSale/acoes/atualizar-cpf-cliente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                id: vendaAtual.id,
                cpf_cliente: cpf || null // Envia null se CPF estiver vazio
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('CPF do cliente atualizado com sucesso:', cpf);
                setShowInserirCPF(false);
                if (cpf) {
                    alert(`CPF ${cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')} adicionado à venda.`);
                } else {
                    alert('Venda configurada sem CPF.');
                }
            } else {
                console.error('Erro ao atualizar CPF do cliente:', data);
                alert(data.message || 'Erro ao atualizar CPF do cliente.');
            }
        })
        .catch(error => {
            console.error('Erro ao atualizar CPF do cliente:', error);
            alert('Erro ao atualizar CPF do cliente. Tente novamente.');
        });
    };

    const handleCPFCancel = () => {
        setShowInserirCPF(false);
    };

    // Funções para o modal de valor
    const handleValorConfirm = (valor) => {
        setValorRecebido(valor);
        setShowInserirValor(false);
        
        // Aqui você pode adicionar lógica adicional se necessário
        console.log('Valor recebido registrado:', valor);
    };

    const handleValorCancel = () => {
        setShowInserirValor(false);
    };

    // Funções para o modal de finalizar venda
    const handleFinalizarVendaConfirm = () => {
        if (!vendaAtual || !vendaAtual.id) {
            console.error('Nenhuma venda ativa encontrada');
            alert('Erro: Nenhuma venda ativa encontrada.');
            setShowFinalizarVenda(false);
            return;
        }

        if (formaPagamento !== 'cartao_credito' && formaPagamento !== 'cartao_debito' && valorRecebido <= 0) {
            alert('É necessário informar o valor recebido antes de finalizar a venda. Pressione F7 para inserir o valor.');
            setShowFinalizarVenda(false);
            return;
        }

        // Para cartão, garantir que o valor recebido seja igual ao total
        let valorFinal = valorRecebido;
        if (formaPagamento === 'cartao_credito' || formaPagamento === 'cartao_debito') {
            valorFinal = valorTotal;
            setValorRecebido(valorTotal);
        }

        if (valorTotal <= 0) {
            alert('Não há itens na venda para finalizar.');
            setShowFinalizarVenda(false);
            return;
        }

        // Validar se o valor recebido é menor que o total da compra
        if (valorFinal < valorTotal) {
            alert(`Valor insuficiente! O valor recebido (R$ ${valorFinal.toFixed(2).replace('.', ',')}) é menor que o total da venda (R$ ${valorTotal.toFixed(2).replace('.', ',')}).`);
            setShowFinalizarVenda(false);
            return;
        }

        router.post('/pointOfSale/acoes/finalizar', {
            id: vendaAtual.id,
            valor_pago: valorFinal
        }, {
            onSuccess: (page) => {
                console.log('Venda finalizada com sucesso');
                setShowFinalizarVenda(false);
                router.visit('/pointOfSale', { replace: true });
            },
            onError: (errors) => {
                console.error('Erro ao finalizar venda:', errors);
                const errorMessage = errors.message || 'Erro ao finalizar venda. Tente novamente.';
                alert(errorMessage);
                setShowFinalizarVenda(false);
            }
        });
    };

    const handleFinalizarVendaCancel = () => {
        setShowFinalizarVenda(false);
    };

    const handleFormaPagamentoChange = (novaFormaPagamento) => {
        if (!vendaAtual || !vendaAtual.id) {
            console.error('Nenhuma venda ativa encontrada');
            return;
        }

        // Atualiza o estado local
        setFormaPagamento(novaFormaPagamento);

        // Se for cartão de crédito ou débito, define o valor recebido como igual ao total
        if (novaFormaPagamento === 'cartao_credito' || novaFormaPagamento === 'cartao_debito') {
            setValorRecebido(valorTotal);
        }

        fetch('/pointOfSale/acoes/nova-forma-pagamento', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                id: vendaAtual.id,
                forma_pagamento: novaFormaPagamento
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Forma de pagamento atualizada com sucesso:', novaFormaPagamento);
            } else {
                console.error('Erro ao atualizar forma de pagamento:', data);
                alert(data.message || 'Erro ao atualizar forma de pagamento.');
            }
        })
        .catch(error => {
            console.error('Erro ao atualizar forma de pagamento:', error);
            alert('Erro ao atualizar forma de pagamento. Tente novamente.');
        });
    };

    return (
        <>
            <Head title="Ponto de Venda" />
            <AuthenticatedLayout>
                <div className="ponto-venda-container">
                    <div className="cabecalho-ponto-venda">
                        <h1>{ultimoItem ? (produtoDoItem(ultimoItem)?.nome || 'Produto não encontrado') : 'Nenhum item selecionado'}</h1>
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

                            <ValorDisplay
                                screenState={screenState}
                                ultimoItem={ultimoItem}
                                produtos={produtos}
                                valorTotal={valorTotal}
                                itens={itens}
                            />

                            <TotalItemDisplay
                                screenState={screenState}
                                totalUltimoItem={totalUltimoItem}
                                onFormaPagamentoChange={handleFormaPagamentoChange}
                                formaPagamento={formaPagamento}
                            />

                            <Atalhos screenState={screenState} />
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
                                                <td>{itemData.produto_id || 'N/A'}</td>
                                                <td>{itemData.produto?.nome || 'Produto não encontrado'}</td>
                                                <td>{itemData.quantidadeFormatada || '0'}</td>
                                                <td>{itemData.valorUnitarioFormatado || 'R$ 0,00'}</td>
                                                <td>{itemData.totalFormatado || 'R$ 0,00'}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td
                                                    colSpan="6"
                                                    style={{
                                                        textAlign: 'center',
                                                        padding: '20px',
                                                        color: '#666',
                                                    }}
                                                >
                                                    Nenhum item adicionado
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <TotalETroco
                                screenState={screenState}
                                valorTotal={valorTotal}
                                valorPago={valorRecebido}
                            />
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>

            {/* Modal de quantidade */}
            <QuantidadePopUp
                aparecendo={showQuantidadePopUp}
                tipoItem={ultimoItem ? (produtoDoItem(ultimoItem)?.unidade || null) : null}
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

            <InserirCPFPopUp
                aparecendo={showInserirCPF}
                aoConfirmar={handleCPFConfirm}
                aoFechar={handleCPFCancel}
                titulo="Inserir CPF do Cliente"
            />

            <InserirValorPopUp
                aparecendo={showInserirValor}
                aoConfirmar={handleValorConfirm}
                aoFechar={handleValorCancel}
                titulo="Valor Recebido"
                valorTotal={valorTotal}
            />

            <FinalizarVendaPopUp
                aparecendo={showFinalizarVenda}
                aoConfirmar={handleFinalizarVendaConfirm}
                aoFechar={handleFinalizarVendaCancel}
                titulo="Finalizar Venda"
                valorTotal={valorTotal}
                valorRecebido={valorRecebido}
                troco={Math.max(0, valorRecebido - valorTotal)}
            />
        </>
    );
}
