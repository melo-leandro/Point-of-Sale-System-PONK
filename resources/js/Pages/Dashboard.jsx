import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Dashboard() {
    const { forceReload, user } = usePage().props;

    useEffect(() => {
        if (forceReload) {
            window.location.href = route('dashboard');
        }
    }, [forceReload]);

    const handleMenuClick = (type) => {
        if (type === 'pos') {
            router.visit(route('pointOfSale'));
        } else if (type === 'status') {
            router.visit(route('StatusCaixa'));
        } else if (type === 'register' && user?.admin) {
            router.visit(route('register'));
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
                case 'F3':
                    event.preventDefault();
                    handleMenuClick('register');
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown); // limpeza
    }, []);

    return (
        <>
        <Head title="Dashboard" />
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

                {user?.admin && (
                    <div 
                        className="menu-card"
                        onClick={() => handleMenuClick('register')}
                    >
                        <div className="menu-card-content">
                            <div className="menu-title">CADASTRAR USUÁRIO</div>
                            <div className="menu-icon">👤</div>
                        </div>
                        <div className="menu-key">F3</div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
        </>
    );
}
