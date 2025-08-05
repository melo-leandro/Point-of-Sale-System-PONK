import { useState } from 'react';
import QuantidadePopUp from '@/Components/QuantidadePopUp';

export default function CodigoOrDesconto({ state, vendaAtual, onItemAdded, produtos }) {

    const [codigo, setCodigo] = useState('');
    const [loading, setLoading] = useState(false);
    const [mostrarModalQuantidade, setMostrarModalQuantidade] = useState(false);
    const [produtoParaModal, setProdutoParaModal] = useState(null);
    const [resolveQuantidade, setResolveQuantidade] = useState(null);

    const adicionarItem = async () => {
        if (!codigo.trim() || !vendaAtual?.id || loading) return;
        
        setLoading(true);

        const produtoItem = produtos.find(produto => produto.codigo.trim() === codigo.trim());
        
        if (!produtoItem) {
            alert('Produto não encontrado!');
            setLoading(false);
            return;
        }

        let quantidade = 1;

        if (produtoItem.unidade === 'KG') {
            // Mostrar modal e aguardar resposta
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
                console.log('Item adicionado com sucesso:', data);
                setCodigo('');
                onItemAdded?.();
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

    const handleCodigoKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            adicionarItem();
        }
    };

    if (state === 'inputProdutos') {
        return (
            <>
                <div className="cartao-escuro codigo-desconto">
                    <div className="titulo-cartao">Código do produto</div>
                        <div className="cartao-input-wrapper">
                            <input
                                placeholder={loading ? "Adicionando item..." : "Insira o código desejado..."}
                                value={codigo}
                                onChange={e => setCodigo(e.target.value)}
                                onKeyDown={handleCodigoKeyDown}
                                disabled={loading}
                                style={{
                                    opacity: loading ? 0.6 : 1,
                                    cursor: loading ? 'not-allowed' : 'text'
                                }}
                            />
                    </div>
                </div>

                {mostrarModalQuantidade && produtoParaModal && (
                    <QuantidadePopUp
                        aparecendo={true}
                        tipoItem={produtoParaModal.unidade}
                        aoConfirmar={handleConfirmarQuantidade}
                        aoFechar={handleFecharModal}
                        valorInicial={'1'}
                        titulo={`Insira o peso do produto ${produtoParaModal.nome}:`}
                    />
                )}
            </>
        );
    }
}