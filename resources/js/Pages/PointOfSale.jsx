import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import '../../css/PointOfSale.css';
import CodigoOrDesconto from '@/Components/CodigoOrDesconto';

export default function PointOfSale() {

    const [state, setState] = useState('inputProdutos');

    useEffect(() => {
        const handleKeyDown = (event) => {
            switch (event.key) {
                case 'F1':
                    event.preventDefault();
                    // Implementar lógica para excluir item
                    break;
                case 'F2':
                    event.preventDefault();
                    // Implementar lógica para inserir quantidade/peso
                    break;
                case 'F3':
                    event.preventDefault();
                    // Implementar lógica para ir para o pagamento
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown); // limpeza
    }, []);

    return (
        <>
            <Head title="Ponto de Venda" />
            <AuthenticatedLayout>
                <div className="ponto-venda-container">
                    <div className="cabecalho-ponto-venda">
                        <h1>NOME DOS ITENS AQUI IMPLEMENTAR</h1>
                    </div>

                    <div id="painel-itens">
                        {/* Coluna lateral */}
                        <div className="barra-lateral">
                            <CodigoOrDesconto
                                state={state}
                            />

                            <div className="cartao-escuro valor-unitario">
                                <div className="titulo-cartao">Valor unitário</div>
                                <div className="valor-cartao">
                                    <h2>R$ 0,00</h2>
                                </div>
                            </div>

                            <div className="cartao-escuro total-item">
                                <div className="titulo-cartao">Total do item</div>
                                <div className="valor-cartao">
                                    <h2>R$ 0,00</h2>
                                </div>
                            </div>

                            <div className="cartao-atalhos">
                                <ul>
                                    <li>F1 - Excluir item</li>
                                    <li>F2 - Inserir quantidade/peso</li>
                                    <li>F3 - Ir para o pagamento</li>
                                </ul>
                            </div>
                        </div>

                        {/* Coluna principal */}
                        <div className="coluna-principal">
                            <div className="carrinho-wrapper">
                                <table className="carrinho">
                                    <thead>
                                        <tr>
                                            <th>Nº Item</th>
                                            <th>Código</th>
                                            <th>Descrição</th>
                                            <th>Quantidade</th>
                                            <th>Valor Unitário</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.from({ length: 24 }).map(
                                            (_, idx) => (
                                                <tr key={idx}>
                                                    <td>{idx + 1}</td>
                                                    <td>000{idx + 1}</td>
                                                    <td>
                                                        Produto Exemplo{' '}
                                                        {idx + 1}
                                                    </td>
                                                    <td>1</td>
                                                    <td>R$ 10,00</td>
                                                    <td>R$ 10,00</td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="cartao-total">
                                <div className="rotulo">
                                    <h2>Valor total</h2>
                                </div>
                                <div className="valor">
                                    <h2>R$ 0,00</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
