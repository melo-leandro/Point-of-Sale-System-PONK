import { useState } from 'react';

export default function CodigoOrDesconto({ state, vendaAtual, onItemAdded }) {

    const [codigo, setCodigo] = useState('');
    const [loading, setLoading] = useState(false);

    const adicionarItem = async () => {
        if (!codigo.trim() || !vendaAtual?.id || loading) return;
        
        setLoading(true);
        
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
                    qtde: 1,
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

    const handleCodigoKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            adicionarItem();
        }
    };

    if (state === 'inputProdutos') {
        return (
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
        );
    }
}