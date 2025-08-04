import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import '../../css/PointOfSale.css';

export default function PointOfSale() {
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
                <div className="point-of-sale-container">
                    <div className="point-of-sale-header">
                        <h1>NOME DOS ITENS AQUI IMPLEMENTAR</h1>
                    </div>

                    <div id="item-panel">
                        {/* Coluna lateral */}
                        <div className="sidebar-column">
                            <div className="dark-card discount">
                                <div className="card-title">Desconto</div>
                                <div className="card-input-wrapper">
                                    <input placeholder="Insira o valor desejado..." />
                                </div>
                            </div>

                            <div className="dark-card unit-price">
                                <div className="card-title">Valor unitário</div>
                                <div className="card-value">
                                    <h2>R$ 0,00</h2>
                                </div>
                            </div>

                            <div className="dark-card item-total">
                                <div className="card-title">Total do item</div>
                                <div className="card-value">
                                    <h2>R$ 0,00</h2>
                                </div>
                            </div>

                            <div className="shortcuts-card">
                                <ul>
                                    <li>F1 - Excluir item</li>
                                    <li>F2 - Inserir quantidade/peso</li>
                                    <li>F3 - Ir para o pagamento</li>
                                </ul>
                            </div>
                        </div>

                        {/* Coluna principal */}
                        <div className="main-column">
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
                            <div className="total-card">
                                <div className="label">
                                    <h2>Valor total</h2>
                                </div>
                                <div className="value">
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
