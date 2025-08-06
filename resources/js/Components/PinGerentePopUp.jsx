import { useEffect, useRef, useState } from 'react';
import '@/Components/cssHotfix/PinGerentePopUp.css';

export default function PinGerentePopUp({
    aparecendo,
    aoConfirmar,
    aoFechar,
    titulo = 'Insira o PIN do gerente:',
}) {
    const [pin, setPin] = useState('');
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
        aoConfirmar(pin);
        setPin('');
    };

    const handleCancel = () => {
        aoFechar();
        setPin('');
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
        // Permite apenas números para o PIN
        const value = e.target.value.replace(/\D/g, '');
        console.log('Input value:', value); // Debug
        setPin(value);
    };

    if (!aparecendo) return null;

    return (
        <div className="pin-gerente-popup-overlay">
            <div className="pin-gerente-popup-container">
                <h2 className="pin-gerente-popup-title">{titulo}</h2>

                <input
                    ref={inputRef}
                    className="pin-gerente-popup-input"
                    value={pin}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Digite o PIN (números apenas)"
                    maxLength={4}
                />

                <div className="pin-gerente-popup-buttons">
                    <button
                        className="pin-gerente-popup-button pin-gerente-popup-button-cancel"
                        onClick={handleCancel}
                    >
                        Cancelar (ESC)
                    </button>
                    <button
                        className="pin-gerente-popup-button pin-gerente-popup-button-confirm"
                        onClick={handleConfirm}
                        disabled={!pin.trim()}
                    >
                        Confirmar (ENTER)
                    </button>
                </div>
            </div>
        </div>
    );
}
