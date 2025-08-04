

export default function CodigoOrDesconto({ state }) {

    const handleCodigoKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            
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