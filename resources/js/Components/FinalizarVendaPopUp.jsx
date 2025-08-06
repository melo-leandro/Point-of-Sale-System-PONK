import {useEffect} from 'react';
import '../../css/FinalizarVendaPopUp.css';

const FinalizarVendaPopUp = ({ aparecendo, aoConfirmar, aoFechar, titulo, valorTotal, valorRecebido, troco }) => {
    if (!aparecendo) return null;

    // Formata valor para moeda brasileira
    const formatarMoeda = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(valor || 0);
    };

    const handleConfirmar = () => {
        aoConfirmar();
    };

    const handleCancelar = () => {
        aoFechar();
    };

    useEffect(() => {
        const handleKeyDownInternal = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                aoConfirmar();
            } else if (event.key === 'Escape') {
                event.preventDefault();
                aoFechar();
            }
        };

        if (aparecendo) {
            document.addEventListener('keydown', handleKeyDownInternal);
            return () => document.removeEventListener('keydown', handleKeyDownInternal);
        }
    }, [aparecendo, aoConfirmar, aoFechar]);

    return (
        <div className="finalizar-venda-popup-overlay">
            <div className="finalizar-venda-popup-container">
                <h2 className="finalizar-venda-popup-title">
                    {titulo || 'Finalizar Venda'}
                </h2>

                <div className="finalizar-venda-resumo">
                    <div className="resumo-item">
                        <span className="resumo-label">Valor Total:</span>
                        <span className="resumo-valor">{formatarMoeda(valorTotal)}</span>
                    </div>
                    
                    <div className="resumo-item">
                        <span className="resumo-label">Valor Recebido:</span>
                        <span className="resumo-valor">{formatarMoeda(valorRecebido)}</span>
                    </div>
                    
                    <div className="resumo-item destaque">
                        <span className="resumo-label">Troco:</span>
                        <span className="resumo-valor troco">{formatarMoeda(troco)}</span>
                    </div>
                </div>

                <div className="finalizar-venda-pergunta">
                    <p>Deseja finalizar esta venda?</p>
                </div>

                <div className="finalizar-venda-popup-buttons">
                    <button 
                        className="finalizar-venda-popup-button finalizar-venda-popup-button-cancel"
                        onClick={handleCancelar}
                        type="button"
                    >
                        Cancelar (ESC)
                    </button>
                    <button 
                        className="finalizar-venda-popup-button finalizar-venda-popup-button-confirm"
                        onClick={handleConfirmar}
                        type="button"
                        autoFocus
                    >
                        Finalizar Venda (ENTER)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FinalizarVendaPopUp;
