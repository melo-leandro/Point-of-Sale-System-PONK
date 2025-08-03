import "../../css/PointOfSale.css";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function PointOfSale() {
return (
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
                            <li>F12 - Voltar ao menu inicial</li>
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
                                {Array.from({ length: 24}).map((_, i) => (
                                    <tr key={i}>
                                        <td>{`cell1_${i + 1}`}</td>
                                        <td>{`cell2_${i + 1}`}</td>
                                        <td>{`cell3_${i + 1}`}</td>
                                        <td>{`cell4_${i + 1}`}</td>
                                        <td>{`cell5_${i + 1}`}</td>
                                        <td>{`cell6_${i + 1}`}</td>
                                    </tr>
                                ))}
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
);
}
