import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
export default function StatusCauxa() {

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
            <p>eh mole</p>
        </AuthenticatedLayout>
    );
}
