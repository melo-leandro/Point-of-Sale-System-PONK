import '../../css/confirmarCancelamentoPopUp.css';

const ConfirmarCancelamentoPopUp = ({
    aparecendo,
    aoConfirmar,
    aoFechar,
    titulo = 'Confirmar cancelamento',
    mensagem = 'Tem certeza que deseja cancelar a venda atual? Todos os itens serão removidos.',
    textoBotaoConfirmar = 'Sim, cancelar',
    textoBotaoCancelar = 'Não, voltar',
}) => {
    if (!aparecendo) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            aoFechar();
        }
    };

    const handleConfirmar = () => {
        aoConfirmar();
    };

    const handleCancelar = () => {
        aoFechar();
    };

    return (
        <div
            className="confirmar-cancelamento-popup-overlay"
            onClick={handleOverlayClick}
        >
            <div className="confirmar-cancelamento-popup-container">
                <h2 className="confirmar-cancelamento-popup-title">{titulo}</h2>

                <div className="confirmar-cancelamento-popup-content">
                    <p className="confirmar-cancelamento-popup-message">
                        {mensagem}
                    </p>

                    <div className="confirmar-cancelamento-popup-icon">
                        <svg
                            width="64"
                            height="64"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="#dc3545"
                                strokeWidth="2"
                            />
                            <path
                                d="M15 9l-6 6"
                                stroke="#dc3545"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <path
                                d="M9 9l6 6"
                                stroke="#dc3545"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>
                </div>

                <div className="confirmar-cancelamento-popup-buttons">
                    <button
                        className="confirmar-cancelamento-popup-button confirmar-cancelamento-popup-button-cancel"
                        onClick={handleCancelar}
                        type="button"
                    >
                        {textoBotaoCancelar}
                    </button>

                    <button
                        className="confirmar-cancelamento-popup-button confirmar-cancelamento-popup-button-confirm"
                        onClick={handleConfirmar}
                        type="button"
                    >
                        {textoBotaoConfirmar}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmarCancelamentoPopUp;
