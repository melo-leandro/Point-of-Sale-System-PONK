import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Dashboard() {
    

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    PONK - Point of Sale System
                </h2>
            }
        >
            <Head title="Ponk" />
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
