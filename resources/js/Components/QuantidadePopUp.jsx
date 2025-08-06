import { useState, useEffect, useRef } from 'react';
import '../../css/quantidadePopUp.css';

export default function QuantidadePopUp({ 
    aparecendo, 
    tipoItem,
    aoFechar, 
    aoConfirmar, 
    valorInicial = '1',
    titulo = tipoItem === 'UN' ? 'Insira a quantidade do último item:' : 'Insira o peso do último item (em quilogramas):' 

}) {

    const [quantidade, setQuantidade] = useState(valorInicial);
    
    // Auto-seleciona o texto quando o modal abre
    const inputRef = useRef(null);
    useEffect(() => {
        if (aparecendo && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [aparecendo]);

    if (!aparecendo) return null;

    const quandoConfirmar = () => {
        aoConfirmar(quantidade);
        setQuantidade(valorInicial);
    };

    const quandoCancelar = () => {
        aoFechar();
        setQuantidade(valorInicial);
    };



    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            quandoConfirmar();
        } else if (event.key === 'Escape') {
            quandoCancelar();
        }
    };

    if( tipoItem === 'UN' ) {
    return (
        <div className="quantidade-popup-overlay">
            <div className="quantidade-popup-container">
                <h2 className="quantidade-popup-titulo">
                    {titulo}
                </h2>
                
                <input
                    ref={inputRef}
                    type="number"
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="quantidade-popup-input"
                />
                
                <div className="quantidade-popup-botoes">
                    <button
                        onClick={quandoConfirmar}
                        className="quantidade-popup-botao quantidade-popup-botao-confirmar"
                    >
                        Confirmar (ENTER)
                    </button>
                    <button
                        onClick={quandoCancelar}
                        className="quantidade-popup-botao quantidade-popup-botao-cancelar"
                    >
                        Cancelar (ESC)
                    </button>
                </div>
            </div>
        </div>
    );
    }
    else if( tipoItem === 'KG' ) {
        return (
        <div className="quantidade-popup-overlay">
            <div className="quantidade-popup-container">
                <h2 className="quantidade-popup-titulo">
                    {titulo}
                </h2>
                
                <input
                    ref={inputRef}
                    type="number"
                    step="0.001"
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="quantidade-popup-input"
                />
                
                <div className="quantidade-popup-botoes">
                    <button
                        onClick={quandoConfirmar}
                        className="quantidade-popup-botao quantidade-popup-botao-confirmar"
                    >
                        Confirmar (ENTER)
                    </button>
                    <button
                        onClick={quandoCancelar}
                        className="quantidade-popup-botao quantidade-popup-botao-cancelar"
                    >
                        Cancelar (ESC)
                    </button>
                </div>
            </div>
        </div>
    );  
    }
    else {
        // useEffect para adicionar listener de teclado no caso de erro
        useEffect(() => {
            const handleErrorKeyDown = (event) => {
                if (event.key === 'Escape' || event.key === 'Enter') {
                    event.preventDefault();
                    quandoCancelar();
                }
            };

            if (aparecendo) {
                document.addEventListener('keydown', handleErrorKeyDown);
                return () => document.removeEventListener('keydown', handleErrorKeyDown);
            }
        }, [aparecendo]);

        return (
        <div className="quantidade-popup-overlay">
            <div className="quantidade-popup-container">
                <h2 className="quantidade-popup-titulo">
                    Tipo de item inválido
                </h2>
                
                <p>O tipo de item deve ser 'UN' ou 'KG'.</p>
                
                <button
                    onClick={quandoCancelar}
                    className="quantidade-popup-botao quantidade-popup-botao-cancelar"
                >
                    Fechar (ESC/ENTER)
                </button>
            </div>
        </div>
    );
    }
}
