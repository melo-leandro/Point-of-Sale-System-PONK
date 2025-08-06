import { useState, useEffect } from 'react';

export default function TotalItemDisplay({ screenState, totalUltimoItem, onFormaPagamentoChange, formaPagamento }) {
    
    const [formaPagamentoLocal, setFormaPagamentoLocal] = useState(formaPagamento || 'dinheiro');

    // Atualiza o estado local quando a prop muda
    useEffect(() => {
        if (formaPagamento) {
            setFormaPagamentoLocal(formaPagamento);
        }
    }, [formaPagamento]);

    useEffect(() => {
            const handleKeyDown = (event) => {
                if(event.key === 'F2') {
                    event.preventDefault();
                    if(screenState === 'pagamento') {
                        document.getElementById('forma-pagamento-select').focus();
                    }
                }
            };
    
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }, [screenState]);

    // Helper function to safely convert values to numbers
    const toNumber = (value) => {
        if (value === null || value === undefined || value === '') return 0;
        if (typeof value === 'number') return value;
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
    };

    const handleFormaPagamentoChange = (event) => {
        const novaForma = event.target.value;
        setFormaPagamentoLocal(novaForma);
        
        // Chama a função callback para enviar ao componente pai
        if (onFormaPagamentoChange) {
            onFormaPagamentoChange(novaForma);
        }
    };

    if (screenState === 'inputProdutos') {
        return (
            <div className="cartao-escuro total-item">
                <div className="titulo-cartao">Total do item</div>
                <div className="valor-cartao">
                    <h2>R$ {toNumber(totalUltimoItem).toFixed(2).replace('.', ',')}</h2>
                </div>
            </div>
        );
    } else {
        return (
            <div className="cartao-escuro forma-pagamento">
                <div className="titulo-cartao">F2 - Forma de pagamento</div>
                <div className="dropdown-wrapper">
                    <select 
                        value={formaPagamentoLocal}
                        onChange={handleFormaPagamentoChange}
                        id='forma-pagamento-select'
                        className="forma-pagamento-select"
                    >
                        <option value="dinheiro">Dinheiro</option>
                        <option value="pix">PIX</option>
                        <option value="cartao_debito">Cartão de Débito</option>
                        <option value="cartao_credito">Cartão de Crédito</option>
                    </select>
                </div>
            </div>
        );
    }
}
