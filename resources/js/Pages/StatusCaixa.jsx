import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect } from 'react';
import '../../css/statusCaixa.css';

export default function StatusCaixa() {
    const handleMenuClick = (type) => {
        if (type === 'inicio') {
            router.visit(route('dashboard'));
        }
        // else if (type === 'status') {
        //     console.log('Status do Caixa selecionado');
        //     // futura navegação aqui
        // }
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            switch (event.key) {
                case 'F1':
                    event.preventDefault();
                    handleMenuClick('inicio');
                    break;
                case 'F5':
                    event.preventDefault();
                    window.location.reload();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown); // limpeza
    }, []);

    return (
        <>
            <Head title="Status do Caixa" />
            <AuthenticatedLayout>
                <div className="painel-itens">
                    <div className="barra-lateral">
                        <div className="cartao-escuro status">
                            <div className="titulo-cartao">Status do Caixa</div>
                            <div className="valor-status">
                                <h2>ABERTO</h2>
                            </div>
                            <div className="subtitulo-status">
                                <h2>aberto na hora tal e no dia tal</h2>
                            </div>
                        </div>

                        <div className="cartao-escuro terminal">
                            <div className="titulo-cartao">Terminal</div>
                            <div className="valor-cartao">
                                <h2>000</h2>
                            </div>
                        </div>

                        <div className="cartao-atalhos">
                            <ul>
                                <li>F1 – Voltar ao Menu</li>
                                <li>F2 – Abrir caixa</li>
                                <li>F3 – Gerar relatório PDF</li>
                                <li>F4 – Mudar Terminal</li>
                                <li>F5 – Atualizar</li>
                                <li>F6 – Fechar caixa</li>
                            </ul>
                        </div>
                    </div>

                    {/* Coluna principal */}
                    <div className="coluna-principal">
                        <div className="carrinho-wrapper">
                            <table className="carrinho">
                                <thead>
                                    <tr>
                                        <th>Data e Hora</th>
                                        <th>Dinheiro</th>
                                        <th>Crédito</th>
                                        <th>Débito</th>
                                        <th>Pix</th>
                                        <th>Total</th>
                                        <th>N° Venda</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.from({ length: 36 }).map(
                                        (_, idx) => (
                                            <tr key={idx}>
                                                <td>{idx + 1}</td>
                                                <td>{idx + 1}</td>
                                                <td>{idx + 1}</td>
                                                <td>{idx + 1}</td>
                                                <td>{idx + 1}</td>
                                                <td>{idx + 1}</td>
                                                <td>{idx + 1}</td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
