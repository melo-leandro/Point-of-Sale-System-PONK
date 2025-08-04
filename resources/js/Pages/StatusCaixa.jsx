import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import '../../css/statusCaixa.css';

export default function StatusCaixa({ vendas }) {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const baseWidth = 1400;
        const baseHeight = 800;

        function handleResize() {
            const widthScale = window.innerWidth / baseWidth;
            const heightScale = window.innerHeight / baseHeight;
            const finalScale = Math.min(widthScale, heightScale, 1); // limita para não aumentar
            setScale(finalScale);
        }

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
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
                <div className="painel-wrapper">
                    <div
                        className="painel-itens"
                        style={{ transform: `scale(${scale})` }}
                    >
                        <div className="barra-lateral">
                            <div className="cartao-escuro status">
                                <div className="titulo-cartao">
                                    Status do Caixa
                                </div>
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
                            <div className="mov-wrapper">
                                <table className="mov">
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
                                                    ).toLocaleString('pt-BR', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
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
            </AuthenticatedLayout>
        </>
    );
}
