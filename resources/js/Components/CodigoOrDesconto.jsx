import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import QuantidadePopUp from '@/Components/QuantidadePopUp';
import PinGerentePopUp from './PinGerentePopUp';

export default function CodigoOrDesconto({ state, vendaAtual, recarregaItensAdicionados, produtos, mapeamento }) {

    // ==================== ESTADOS ====================
    // Estados para inserir código de produto
    const [codigo, setCodigo] = useState('');
    const [mostrarModalQuantidade, setMostrarModalQuantidade] = useState(false);
    const [produtoParaModal, setProdutoParaModal] = useState(null);
    const [resolveQuantidade, setResolveQuantidade] = useState(null);
    const [showPinGerentePopUp, setShowPinGerentePopUp] = useState(false);
    
    // Estados para inserir desconto
    const [desconto, setDesconto] = useState('');
    
    // Estados compartilhados
    const [loading, setLoading] = useState(false);

    // ==================== EFFECTS ====================
    useEffect(() => {
        const handleKeyDown = (event) => {
            if(event.key === 'F1') {
                event.preventDefault();
                if(state === 'inputProdutos') {
                    document.getElementById('input-codigo-produto').focus();
                } else {
                    document.getElementById('input-desconto').focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [state]);

    // ==================== FUNÇÕES PARA CÓDIGO DE PRODUTO ====================
    
    const adicionarItem = async () => {
        console.log('adicionarItem called with:', { codigo: codigo.trim(), vendaAtual: vendaAtual?.id, loading });
        
        if (!codigo.trim()) {
            alert('Por favor, digite um código de produto.');
            return;
        }
        
        if (!vendaAtual?.id) {
            alert('Aguarde... A venda está sendo criada.');
            return;
        }
        
        if (loading) {
            console.log('Já está processando um item, aguarde...');
            return;
        }
        
        setLoading(true);

        const produtoItem = produtos.find(produto => produto.codigo.trim() === codigo.trim());
        
        if (!produtoItem) {
            alert('Produto não encontrado!');
            setLoading(false);
            return;
        }

        let quantidade = 1;

        if (produtoItem.unidade === 'KG') {
            setProdutoParaModal(produtoItem);
            setMostrarModalQuantidade(true);
            
            quantidade = await new Promise((resolve) => {
                setResolveQuantidade(() => resolve);
            });
            
            if (quantidade === null) {
                setLoading(false);
                return;
            }
        }

        try {
            // Dupla verificação antes de enviar para o backend
            if (!vendaAtual?.id) {
                alert('Erro: Venda não está disponível. Tente novamente em alguns segundos.');
                setLoading(false);
                return;
            }

            const response = await fetch('/pointOfSale/acoes/adicionar-item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    produto_id: codigo.trim(),
                    qtde: quantidade,
                    venda_id: vendaAtual.id
                })
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                console.log('Item processado com sucesso:', data);
                setCodigo('');
                recarregaItensAdicionados();
                
                // Mostrar mensagem personalizada do backend se disponível
                if (data.message && data.action === 'updated') {
                    // Para itens atualizados, mostrar toast/alert discreto
                    console.log(data.message);
                }
            } else {
                console.error('Erro ao adicionar item:', data);
                alert(data.message || 'Erro ao adicionar item. Verifique se o código está correto.');
            }
        } catch (error) {
            console.error('Erro ao adicionar item:', error);
            alert('Erro ao adicionar item. Verifique se o código está correto.');
        } finally {
            setLoading(false);
        }
    };

    const handleCodigoKeyDown = (event) => {
        console.log('Key pressed in codigo input:', event.key, 'State:', state);
        if (event.key === 'Enter') {
            event.preventDefault();
            if (state === 'inputProdutos') {
                console.log('Calling adicionarItem');
                adicionarItem();
            }
        }
    };

    // Funções do modal de quantidade (usado apenas para produtos)
    const handleConfirmarQuantidade = (qtde) => {
        setMostrarModalQuantidade(false);
        setProdutoParaModal(null);
        if (resolveQuantidade) {
            resolveQuantidade(qtde);
            setResolveQuantidade(null);
        }
    };

    const handleFecharModal = () => {
        setMostrarModalQuantidade(false);
        setProdutoParaModal(null);
        if (resolveQuantidade) {
            resolveQuantidade(null);
            setResolveQuantidade(null);
        }
    };

    // ==================== FUNÇÕES PARA DESCONTO ====================
    
    const handleConfirmaPin = async (pin) => {
        setLoading(true);
        
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
                console.log('PIN validado com sucesso:', data);
                aplicarDescontoComPin(parseFloat(desconto.trim()), pin);
                setShowPinGerentePopUp(false);
            } else {
                console.error('Erro ao validar PIN:', data);
                alert(data.message || 'Erro ao validar PIN.');
            }
        } catch (error) {
            console.error('Erro ao validar PIN:', error);
            alert('Erro ao validar PIN.');
        } finally {
            setLoading(false);
        }
    };

    const aplicarDescontoComPin = async (desconto, pin) => {
        setLoading(true);

        try {
            const response = await fetch('/pointOfSale/acoes/aplicar-desconto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    percentual_desconto: desconto,
                    id: vendaAtual.id,
                    pin: pin
                })
            });

            const data = await response.json();
            
            if (response.ok && data.success) {
                console.log('Desconto aplicado com sucesso:', data);
                setDesconto('');
                recarregaItensAdicionados();
            } else {
                console.error('Erro ao aplicar desconto:', data);
                alert(data.message || 'Erro ao aplicar desconto.');
            }
        } catch (error) {
            console.error('Erro ao aplicar desconto:', error);
            alert('Erro ao aplicar desconto.');
        } finally {
            setLoading(false);
        }
    };

    const handleDescontoKeyDown = (event) => {
        console.log('Key pressed in desconto input:', event.key, 'State:', state);
        if (event.key === 'Enter') {
            event.preventDefault();
            if (state === 'pagamento' && desconto.trim() !== '') {
                console.log('Calling aplicarDesconto');
                setShowPinGerentePopUp(true);
            }
        }
    };

    // ==================== RENDERIZAÇÃO ====================
    
    // Renderização para inserir código de produto
    if (state === 'inputProdutos') {
        const isVendaReady = vendaAtual?.id;
        const placeholderText = loading ? "Adicionando item..." : 
                               !isVendaReady ? "Aguardando venda..." : 
                               "F1 - Insira o código desejado...";
        
        return (
            <>
                <div className="cartao-escuro codigo-desconto">
                    <div className="titulo-cartao">Código do produto</div>
                        <div className="cartao-input-wrapper">
                            <input
                                id="input-codigo-produto"
                                placeholder={placeholderText}
                                value={codigo}
                                onChange={e => setCodigo(e.target.value)}
                                autoFocus
                                onKeyDown={handleCodigoKeyDown}
                                disabled={loading || !isVendaReady}
                                style={{
                                    opacity: (loading || !isVendaReady) ? 0.6 : 1,
                                    cursor: (loading || !isVendaReady) ? 'not-allowed' : 'text'
                                }}
                                maxLength={13}
                                inputMode="integer"
                                pattern="[0-9]*"
                            />
                    </div>
                </div>

                {/* Modal de quantidade (apenas para produtos em KG) */}
                {mostrarModalQuantidade && produtoParaModal && (
                    <QuantidadePopUp
                        aparecendo={true}
                        tipoItem={produtoParaModal.unidade}
                        aoConfirmar={handleConfirmarQuantidade}
                        aoFechar={handleFecharModal}
                        valorInicial={'1'}
                    />
                )}
            </>
        );
    }
    
    // Renderização para inserir desconto
    else {
        return (
            <>
                <div className="cartao-escuro desconto-input">
                    <div className="titulo-cartao">Desconto</div>
                        <div className="cartao-input-wrapper">
                            <input
                                id="input-desconto"
                                placeholder={loading ? "Aplicando desconto..." : "F1 - Insira o desconto desejado..."}
                                value={desconto}
                                onChange={e => setDesconto(e.target.value)}
                                autoFocus
                                onKeyDown={handleDescontoKeyDown}
                                disabled={loading}
                                style={{
                                    opacity: loading ? 0.6 : 1,
                                    cursor: loading ? 'not-allowed' : 'text'
                                }}
                                maxLength={3}
                                inputMode="numeric"
                                pattern="[0-9]*"
                            />
                        </div>
                    </div>
                    <PinGerentePopUp
                        aparecendo={showPinGerentePopUp}
                        aoConfirmar={handleConfirmaPin}
                        aoFechar={() => setShowPinGerentePopUp(false)}
                    />
            </>
        );
    }
}