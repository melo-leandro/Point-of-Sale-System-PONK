import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
export default function Dashboard() {
    const { forceReload } = usePage().props;

    useEffect(() => {
        if (forceReload) {
            window.location.href = route('dashboard');
        }
    }, [forceReload]);

    const handleMenuClick = (type) => {
        if (type === 'pos') {
            console.log('Ponto de Venda selecionado');
            router.visit(route('pointOfSale'));
        } else if (type === 'status') {
            console.log('Status do Caixa selecionado');
            // futura navegação aqui
        }
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            switch (event.key) {
                case 'F1':
                    event.preventDefault();
                    handleMenuClick('pos');
                    break;
                case 'F2':
                    event.preventDefault();
                    handleMenuClick('status');
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown); // limpeza
    }, []);

    return (
        <AuthenticatedLayout>
            <div className="main-container">
                <div
                    className="menu-card"
                    onClick={() => handleMenuClick('pos')}
                >
                    <div className="menu-card-content">
                        <div className="menu-title">PONTO DE VENDA</div>
                        <div className="menu-icon">🛍️</div>
                    </div>
                    <div className="menu-key">F1</div>
                </div>

                <div
                    className="menu-card"
                    onClick={() => handleMenuClick('status')}
                >
                    <div className="menu-card-content">
                        <div className="menu-title">STATUS DO CAIXA</div>
                        <div className="menu-icon">📈</div>
                    </div>
                    <div className="menu-key">F2</div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
