import { useMemo } from 'react';

export default function TotalETroco({ screenState, valorTotal, valorPago }) {
    // Helper function to safely convert values to numbers
    const toNumber = (value) => {
        if (value === null || value === undefined || value === '') return 0;
        if (typeof value === 'number') return value;
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
    };

    // Calcula o troco diretamente no frontend
    const troco = useMemo(() => {
        const total = toNumber(valorTotal);
        const pago = toNumber(valorPago);
        return pago > total ? pago - total : 0;
    }, [valorTotal, valorPago]);

    if (screenState === 'inputProdutos') {
        // Tela de input de produtos - mostra apenas o valor total (design completo)
        return (
            <div className="cartao-total">
                <div className="rotulo">
                    <h2>Valor total</h2>
                </div>
                <div className="valor">
                    <h2>R$ {toNumber(valorTotal).toFixed(2).replace('.', ',')}</h2>
                </div>
            </div>
        );
    } else {
        // Tela de pagamento - mostra valor total e troco como dois cartões separados
        return (
            <div className="total-troco-wrapper">
                <div className="cartao-total cartao-troco">
                    <div className="rotulo">
                        <h2>Troco</h2>
                    </div>
                    <div className="valor">
                        <h2>R$ {toNumber(troco).toFixed(2).replace('.', ',')}</h2>
                    </div>
                </div>

                <div className="cartao-total">
                    <div className="rotulo">
                        <h2>Valor total</h2>
                    </div>
                    <div className="valor">
                        <h2>R$ {toNumber(valorTotal).toFixed(2).replace('.', ',')}</h2>
                    </div>
                </div>
            </div>
        );
    }
}
