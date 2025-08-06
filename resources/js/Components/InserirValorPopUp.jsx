import { useState, useEffect } from 'react';
import '../../css/InserirValorPopUp.css';

export default function InserirValorPopUp({ aparecendo, aoConfirmar, aoFechar, titulo }) {
    const [valor, setValor] = useState('');

    // Limpa o campo quando o modal abre
    useEffect(() => {
        if (aparecendo) {
            setValor('');
        }
    }, [aparecendo]);

    // Função para formatar valor monetário (R$ 0,00)
    const formatarValor = (valorInput) => {
        // Remove tudo que não é dígito
        const apenasNumeros = valorInput.replace(/\D/g, '');
        
        // Converte para centavos
        const centavos = parseInt(apenasNumeros) || 0;
        
        // Converte para reais (divide por 100)
        const reais = centavos / 100;
        
        // Formata como moeda brasileira
        return reais.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const handleInputChange = (e) => {
        const valorFormatado = formatarValor(e.target.value);
        setValor(valorFormatado);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleConfirmar();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            aoFechar();
        }
    };

    const handleConfirmar = () => {
        // Converte o valor formatado de volta para número
        const valorNumerico = parseFloat(valor.replace(/\./g, '').replace(',', '.')) || 0;
        
        if (valorNumerico > 0) {
            aoConfirmar(valorNumerico);
        } else {
            alert('Por favor, digite um valor válido maior que zero.');
        }
    };

    if (!aparecendo) return null;

    return (
        <div className="valor-popup-overlay">
            <div className="valor-popup-container">
                <h2 className="valor-popup-title">{titulo || 'Inserir Valor Recebido'}</h2>
                
                <div className="valor-input-group">
                    <label htmlFor="valor-input">Valor recebido:</label>
                    <input
                        id="valor-input"
                        type="text"
                        value={valor}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="0,00"
                        autoFocus
                        className="valor-popup-input"
                    />
                    <small>Digite o valor em reais</small>
                </div>

                <div className="valor-popup-buttons">
                    <button 
                        className="valor-popup-button valor-popup-button-cancel"
                        onClick={aoFechar}
                    >
                        Cancelar
                    </button>
                    <button 
                        className="valor-popup-button valor-popup-button-confirm"
                        onClick={handleConfirmar}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}
