import { router } from "@inertiajs/react";
import { useState } from 'react';

export default function CodigoOrDesconto({ state, vendaAtual }) {

    const [codigo, setCodigo] = useState('');

    const handleCodigoKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            router.post(`/pointOfSale/acoes/adicionar-item`, {
                produto_id: codigo,
                qtde: 1,
                id: vendaAtual.id
            });
            console.log('Código digitado:', codigo);
        }
    };

    if (state === 'inputProdutos') {
        return (
            <div className="cartao-escuro codigo-desconto">
                <div className="titulo-cartao">Código do produto</div>
                    <div className="cartao-input-wrapper">
                        <input
                            placeholder="Insira o código desejado..."
                            value={codigo}
                            onChange={e => setCodigo(e.target.value)}
                            onKeyDown={handleCodigoKeyDown}
                        />
                </div>
            </div>
        );
    }
}