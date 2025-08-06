import { useState, useEffect } from 'react';
import '../../css/InserirCPFPopUp.css';

export default function InserirCPFPopUp({ aparecendo, aoConfirmar, aoFechar, titulo }) {
    const [cpf, setCpf] = useState('');

    // Limpa o campo quando o modal abre
    useEffect(() => {
        if (aparecendo) {
            setCpf('');
        }
    }, [aparecendo]);

    // Função para formatar CPF (000.000.000-00)
    const formatarCPF = (valor) => {
        // Remove tudo que não é dígito
        const apenasNumeros = valor.replace(/\D/g, '');
        
        // Aplica a formatação
        if (apenasNumeros.length <= 11) {
            return apenasNumeros
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }
        return apenasNumeros.slice(0, 11)
            .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const handleInputChange = (e) => {
        const valorFormatado = formatarCPF(e.target.value);
        setCpf(valorFormatado);
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
        // Remove formatação para enviar apenas números
        const cpfLimpo = cpf.replace(/\D/g, '');
        
        if (cpfLimpo.length === 11) {
            aoConfirmar(cpfLimpo);
        } else if (cpfLimpo.length === 0) {
            // CPF vazio - pode ser válido para venda sem CPF
            aoConfirmar('');
        } else {
            alert('Por favor, digite um CPF válido com 11 dígitos ou deixe em branco.');
        }
    };

    if (!aparecendo) return null;

    return (
        <div className="cpf-popup-overlay">
            <div className="cpf-popup-container">
                <h2 className="cpf-popup-title">{titulo || 'Inserir CPF do Cliente'}</h2>
                
                <div className="cpf-input-group">
                    <label htmlFor="cpf-input">CPF (opcional):</label>
                    <input
                        id="cpf-input"
                        type="text"
                        value={cpf}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="000.000.000-00"
                        maxLength={14}
                        autoFocus
                        className="cpf-popup-input"
                    />
                    <small>Deixe em branco para venda sem CPF</small>
                </div>

                <div className="cpf-popup-buttons">
                    <button 
                        className="cpf-popup-button cpf-popup-button-cancel"
                        onClick={aoFechar}
                    >
                        Cancelar
                    </button>
                    <button 
                        className="cpf-popup-button cpf-popup-button-confirm"
                        onClick={handleConfirmar}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}
