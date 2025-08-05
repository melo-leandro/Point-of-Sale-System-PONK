import { router } from "@inertiajs/react";
import { useState } from 'react';

export default function CodigoOrDesconto({ state, vendaAtual, onItemAdded }) {

    const [codigo, setCodigo] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCodigoKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            
            if (!codigo.trim()) {
                console.log('Código vazio');
                return;
            }
            
            if (!vendaAtual || !vendaAtual.id) {
                console.error('Venda atual não encontrada');
                return;
            }
            
            if (loading) {
                return;
            }
            
            setLoading(true);
            
            fetch('/pointOfSale/acoes/adicionar-item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({
                    produto_id: codigo.trim(),
                    qtde: 1,
                    venda_id: vendaAtual.id
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    console.log('Item adicionado com sucesso:', data);
                    setCodigo(''); // Limpa o campo após sucesso
                    
                    // Chama a função callback para recarregar os itens
                    if (onItemAdded) {
                        onItemAdded();
                    }
                } else {
                    console.error('Erro na resposta:', data.message);
                    alert('Erro ao adicionar item: ' + (data.message || 'Erro desconhecido'));
                }
            })
            .catch(error => {
                console.error('Erro ao adicionar item:', error);
                alert('Erro ao adicionar item. Verifique se o código do produto está correto.');
            })
            .finally(() => {
                setLoading(false);
            });
            
            console.log('Código digitado:', codigo);
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