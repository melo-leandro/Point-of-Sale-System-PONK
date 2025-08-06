export default function Atalhos({ screenState }){
    if (screenState == 'inputProdutos'){
    return (<div className="cartao-atalhos">
                                <ul>
                                    <li>F2 - Alterar quantidade/peso</li>
                                    <li>F3 - Excluir item</li>
                                    <li>F4 - Ir para o pagamento</li>
                                    <li>F10 - Cancelar venda</li>
                                </ul>
                            </div>);
    } else {
        return (<div className="cartao-atalhos">
                                <ul>
                                    <li>F3 - Insira CPF do cliente</li>
                                    <li>F4 - Finalizar venda</li>
                                    <li>F6 - Imprimir nota fiscal</li>
                                </ul>
                                
                                <hr className="atalhos-divider" />
                                
                                <ul>
                                    <li>F7 - Inserir valor recebido</li>
                                    <li>F8 - Abrir gaveta</li>
                                    <li>F10 - Cancelar venda</li>
                                </ul>
                            </div>);
    }
}