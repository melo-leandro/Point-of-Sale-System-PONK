import { useEffect, useState } from 'react';

export default function ValorDisplay({ screenState, ultimoItem, produtos, valorTotal, itens }) {
    
    const [valorDescontado, setValorDescontado] = useState(0);

    // Helper function to safely convert values to numbers
    const toNumber = (value) => {
        if (value === null || value === undefined || value === '') return 0;
        if (typeof value === 'number') return value;
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
    };

    const produtoDoItem = (item) => {
        if (!item || !item.produto_id) return {};
        return produtos.find(p => p.codigo === item.produto_id) || {};
    };

    // Calcula o valor descontado baseado no valor total dos itens
    useEffect(() => {
        if (itens && itens.length > 0 && produtos && produtos.length > 0) {
            // Calcula o valor total sem desconto
            const valorSemDesconto = itens.reduce((acc, item) => {
                const produto = produtos.find(p => p.codigo === item.produto_id);
                if (produto && produto.valor_unitario) {
                    const valorUnitario = toNumber(produto.valor_unitario);
                    const quantidade = toNumber(item.qtde);
                    return acc + (valorUnitario * quantidade);
                }
                return acc;
            }, 0);

            // Calcula o desconto aplicado
            const desconto = valorSemDesconto - toNumber(valorTotal);
            setValorDescontado(desconto > 0 ? desconto : 0);
        } else {
            setValorDescontado(0);
        }
    }, [itens, produtos, valorTotal]);

    if (screenState === 'inputProdutos') {
        return (
            <div className="cartao-escuro valor-unitario">
                <div className="titulo-cartao">Valor unitário</div>
                <div className="valor-cartao">
                    <h2>R$ {ultimoItem ? toNumber(produtoDoItem(ultimoItem)?.valor_unitario || 0).toFixed(2).replace('.', ',') : '0,00'}</h2>
                </div>
            </div>
        );
    } else {
        return (
            <div className="cartao-escuro valor-descontado">
                <div className="titulo-cartao">Valor descontado</div>
                <div className="valor-cartao">
                    <h2>R$ {valorDescontado.toFixed(2).replace('.', ',')}</h2>
                </div>
            </div>
        );
    }
}
