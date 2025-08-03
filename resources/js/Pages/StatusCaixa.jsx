import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';
import { useEffect } from 'react';
export default function StatusCauxa() {
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
        <AuthenticatedLayout>
            <p>eh mole</p>
        </AuthenticatedLayout>
    );
}
