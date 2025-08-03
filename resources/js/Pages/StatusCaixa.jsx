import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';
import { useEffect } from 'react';
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
        <AuthenticatedLayout>
            {/* Essa div junta td */}
            <div className="flex min-h-screen items-center justify-center p-0 m-0 bg-gray-100">
                <div className="w-full max-w-[1200px] h-[80vh] px-6">
                    <div id="item-panel" className="flex gap-4">
                        <div className="2/5 flex w-1/3 flex-col gap-4">
                            <div className="flex h-32 flex-col bg-red-200">
                                <div className="self-start pb-3 pl-7 pt-2 text-3xl font-semibold">
                                    Desconto
                                </div>
                                <div className="flex justify-center pb-2">
                                    <input
                                        className="h-12 w-[300px] resize-none overflow-hidden border px-3 text-xl font-semibold"
                                        placeholder="Insira o valor desejado..."
                                    />
                                </div>
                            </div>

                            <div className="flex h-28 flex-col justify-between bg-red-200 p-4">
                                <div className="text-1xl flex items-start justify-center font-semibold">
                                    TERMINAL
                                </div>
                                <div className="flex justify-center">
                                    <h2 className="text-5xl font-semibold">
                                        CAIXA 1
                                    </h2>
                                </div>
                            </div>

                            <div className="flex h-60 flex-col justify-center bg-red-200 p-2">
                                <div className="flex h-full items-center">
                                    <ul className="space-y-0.5">
                                        <li className="text-lg font-semibold">
                                            F1 - Voltar ao Menu
                                        </li>
                                        <li className="text-lg font-semibold">
                                            F2 - Abrir caixa
                                        </li>
                                        <li className="text-lg font-semibold">
                                            F3 - Gerar relatório PDF
                                        </li>
                                        <li className="text-lg font-semibold">
                                            F4 - Mudar Terminal
                                        </li>
                                        <li className="text-lg font-semibold">
                                            F5 - Atualizar
                                        </li>
                                        <li className="text-lg font-semibold">
                                            F6 - Fechar caixa
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="flex w-2/3 flex-col gap-4">
                            {/* Lista de itens */}
                            <div className="flex h-full items-center justify-center rounded-lg bg-green-200">
                                <span className="text-2xl font-semibold">
                                    Lista de Itens
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
