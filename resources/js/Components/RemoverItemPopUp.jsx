import { useState, useRef, useEffect } from 'react';
import '../../css/removerItemPopUp.css';

export default function RemoverItemPopUp({ 
            aparecendo, 
            aoConfirmar, 
            aoFechar, 
            titulo = "Insira o ID do item a remover:",
            mapeamento
    }) {

    const [id, setId] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (aparecendo && inputRef.current) {
            // Foca no input quando o modal aparece
            setTimeout(() => {
                inputRef.current.focus();
                inputRef.current.value = '';
            }, 100);
        }
    }, [aparecendo]);

    const handleConfirm = () => {
        aoConfirmar(mapeamento[id - 1]?.id_item);
        setId('');
    };

    const handleCancel = () => {
        aoFechar();
        setId('');
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleConfirm();
        } else if (event.key === 'Escape') {
            event.preventDefault();
            handleCancel();
        }
    };

    const handleInputChange = (e) => {
        // Permite apenas números para o id
        const value = e.target.value.replace(/\D/g, '');
        console.log('Input value:', value); // Debug
        setId(value);
    };

    if (!aparecendo) return null;

    return (
        <div className="remover-item-popup-overlay">
            <div className="remover-item-popup-container">
                <h2 className="remover-item-popup-title">{titulo}</h2>
                
                <input
                    ref={inputRef}
                    className="remover-item-popup-input"
                    value={id}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Digite o id (números apenas)"
                    maxLength={4}
                />
                
                <div className="remover-item-popup-buttons">
                    <button 
                        className="remover-item-popup-button remover-item-popup-button-cancel"
                        onClick={handleCancel}
                    >
                        Cancelar (ESC)
                    </button>
                    <button 
                        className="remover-item-popup-button remover-item-popup-button-confirm"
                        onClick={handleConfirm}
                        disabled={!id.trim()}
                    >
                        Confirmar (ENTER)
                    </button>
                </div>
            </div>
        </div>
    );
}
