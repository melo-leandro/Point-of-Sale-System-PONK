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
            <div className="m-0 flex min-h-screen items-center justify-center bg-gray-100 p-0" style={{zIndex:1, position:'relative'}}>
                <div className="h-[80vh] w-full max-w-[1200px] px-6">
                    <div id="item-panel" className="flex gap-4">
                        <div className="2/5 flex w-1/3 flex-col gap-4">
                            <div className="flex h-32 flex-col items-center justify-center bg-green-200">
                                <div className="text-1xl flex items-start justify-center font-semibold">
                                    STATUS DO CAIXA
                                </div>
                                <div className="flex justify-center">
                                    <h2 className="text-5xl font-semibold">
                                        ABERTO
                                    </h2>
                                </div>
                                <div className="text-1xl flex items-start justify-center font-semibold">
                                    abertura e data eu acho texto grande
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

                        <div className="flex w-2/3 flex-col gap-4 bg-green-200">
                            {/* Lista de itens */}

                            <h2 className="items-start justify-center border-b-[3px] border-gray-300 p-[20px] text-2xl font-semibold">
                                MOVIMENTAÇÃO DO CAIXA
                            </h2>
                            <div className="max-h-[61vh] w-full overflow-y-scroll">
                                <table className="w-full table-auto border-collapse border border-gray-400 text-center">
                                    <thead>
                                        <tr>
                                            <th className="border border-gray-400 p-2 font-bold">
                                                Data e Hora
                                            </th>
                                            <th className="border border-gray-400 p-2 font-bold">
                                                Dinheiro
                                            </th>
                                            <th className="border border-gray-400 p-2 font-bold">
                                                Crédito
                                            </th>
                                            <th className="border border-gray-400 p-2 font-bold">
                                                Débito
                                            </th>
                                            <th className="border border-gray-400 p-2 font-bold">
                                                Pix
                                            </th>
                                            <th className="border border-gray-400 p-2 font-bold">
                                                Total
                                            </th>
                                            <th className="border border-gray-400 p-2 font-bold">
                                                N° Venda
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-gray-400 p-2">
                                                hora
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                por ai
                                            </td>
                                            <td className="border border-gray-400 p-2"></td>
                                            <td className="border border-gray-400 p-2"></td>
                                            <td className="border border-gray-400 p-2">
                                                um resto
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                muito
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                1
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-400 p-2">
                                                hora
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                por ai
                                            </td>
                                            <td className="border border-gray-400 p-2"></td>
                                            <td className="border border-gray-400 p-2"></td>
                                            <td className="border border-gray-400 p-2">
                                                um resto
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                muito
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                1
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-400 p-2">
                                                hora
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                por ai
                                            </td>
                                            <td className="border border-gray-400 p-2"></td>
                                            <td className="border border-gray-400 p-2"></td>
                                            <td className="border border-gray-400 p-2">
                                                um resto
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                muito
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                1
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-400 p-2">
                                                hora
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                por ai
                                            </td>
                                            <td className="border border-gray-400 p-2"></td>
                                            <td className="border border-gray-400 p-2"></td>
                                            <td className="border border-gray-400 p-2">
                                                um resto
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                muito
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                1
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-400 p-2">
                                                hora
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                por ai
                                            </td>
                                            <td className="border border-gray-400 p-2"></td>
                                            <td className="border border-gray-400 p-2"></td>
                                            <td className="border border-gray-400 p-2">
                                                um resto
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                muito
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                1
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-400 p-2">
                                                hora
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                por ai
                                            </td>
                                            <td className="border border-gray-400 p-2"></td>
                                            <td className="border border-gray-400 p-2"></td>
                                            <td className="border border-gray-400 p-2">
                                                um resto
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                muito
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                1
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-400 p-2">
                                                hora
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                por ai
                                            </td>
                                            <td className="border border-gray-400 p-2"></td>
                                            <td className="border border-gray-400 p-2"></td>
                                            <td className="border border-gray-400 p-2">
                                                um resto
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                muito
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                1
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-400 p-2">
                                                hora
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                por ai
                                            </td>
                                            <td className="border border-gray-400 p-2"></td>
                                            <td className="border border-gray-400 p-2"></td>
                                            <td className="border border-gray-400 p-2">
                                                um resto
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                muito
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                1
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-400 p-2">
                                                hora
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                por ai
                                            </td>
                                            <td className="border border-gray-400 p-2"></td>
                                            <td className="border border-gray-400 p-2"></td>
                                            <td className="border border-gray-400 p-2">
                                                um resto
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                muito
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                1
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-400 p-2">
                                                hora
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                por ai
                                            </td>
                                            <td className="border border-gray-400 p-2"></td>
                                            <td className="border border-gray-400 p-2"></td>
                                            <td className="border border-gray-400 p-2">
                                                um resto
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                muito
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                1
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-400 p-2">
                                                hora
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                por ai
                                            </td>
                                            <td className="border border-gray-400 p-2"></td>
                                            <td className="border border-gray-400 p-2"></td>
                                            <td className="border border-gray-400 p-2">
                                                um resto
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                muito
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                1
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-400 p-2">
                                                hora
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                por ai
                                            </td>
                                            <td className="border border-gray-400 p-2"></td>
                                            <td className="border border-gray-400 p-2"></td>
                                            <td className="border border-gray-400 p-2">
                                                um resto
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                muito
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                1
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-400 p-2">
                                                hora
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                por ai
                                            </td>
                                            <td className="border border-gray-400 p-2"></td>
                                            <td className="border border-gray-400 p-2"></td>
                                            <td className="border border-gray-400 p-2">
                                                um resto
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                muito
                                            </td>
                                            <td className="border border-gray-400 p-2">
                                                1
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
