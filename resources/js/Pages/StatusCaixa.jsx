import "../../css/statusCaixa.css";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect } from 'react';
import '../../css/statusCaixa.css';
export default function StatusCaixa({ vendas }) {
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
                <div className="wrapper">
                    <div className="container">
                        <div id="item-panel" className="item-panel">
                            <div className="sidebar">
                                <div className="status-box">
                                    <div className="title">STATUS DO CAIXA</div>
                                    <h2 className="status-value">ABERTO</h2>
                                    <div className="subtitle">
                                        abertura e data eu acho texto grande
                                    </div>
                                </div>

                                <div className="terminal-box">
                                    <div className="title">TERMINAL</div>
                                    <h2 className="terminal-value">CAIXA 1</h2>
                                </div>

                                <div className="actions-box">
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

                            <div className="main-panel">
                                <h2 className="mov-title">
                                    MOVIMENTAÇÃO DO CAIXA
                                </h2>
                                <div className="table-wrapper">
                                    <table>
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
                                            {vendas.map((venda) => (
                                                <tr key={venda.id}>
                                                    <td>
                                                        {new Date(
                                                            venda.created_at,
                                                        ).toLocaleString(
                                                            'pt-BR',
                                                            {
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            },
                                                        )}
                                                    </td>
                                                    <td>
                                                        {venda.forma_pagamento ===
                                                        'dinheiro'
                                                            ? 'Sim'
                                                            : 'Não'}
                                                    </td>
                                                    <td>
                                                        {venda.forma_pagamento ===
                                                        'cartao_credito'
                                                            ? 'Sim'
                                                            : 'Não'}
                                                    </td>
                                                    <td>
                                                        {venda.forma_pagamento ===
                                                        'cartao_debito'
                                                            ? 'Sim'
                                                            : 'Não'}
                                                    </td>
                                                    <td>
                                                        {venda.forma_pagamento ===
                                                        'pix'
                                                            ? 'Sim'
                                                            : 'Não'}
                                                    </td>
                                                    <td>{venda.valor_total}</td>
                                                    <td>{venda.id}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
