import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function PointOfSale() {
    return (
        <AuthenticatedLayout>
            {/* Essa div junta td */}
            <div className="ml-48 mr-48">
                {/* Painel do nome dos itens */}
                <div className="text-4xl font-bold text-center mt-5 mb-4 bg-red-500 text-white pt-3 pb-3 rounded-lg">
                    <h1>temp</h1>
                </div>

                <div id="item-panel" className="flex gap-4">

                    <div className="2/5 w-1/3 flex flex-col gap-4">
                        <div className="flex h-32 bg-red-200 flex-col">
                            <div className="self-start text-3xl font-semibold pt-2 pb-3 pl-7">Desconto</div>
                            <div className="flex justify-center pb-2">
                                <input className="w-[300px] h-12 resize-none overflow-hidden border text-xl font-semibold px-3" placeholder="Insira o valor desejado..." />
                            </div>
                        </div>

                        <div className="flex h-28 bg-red-200 flex-col">
                            <div className="self-start text-3xl font-semibold pt-2 pb-1 pl-7">Valor unitário</div>
                            <div className="flex justify-end pr-7 items-end flex-1 pb-2">
                                <h2 className="text-5xl font-semibold">R$ 0,00</h2>
                            </div>
                        </div>

                        <div className="flex h-28 bg-red-200 flex-col">
                            <div className="self-start text-3xl font-semibold pt-2 pb-1 pl-7">Total do item</div>
                            <div className="flex justify-end pr-7 items-end flex-1 pb-2">
                                <h2 className="text-5xl font-semibold">R$ 0,00</h2>
                            </div>
                        </div>

                        <div className="flex h-32 bg-red-200 flex-col p-2 justify-center">
                            <div className="flex h-full">
                                <ul className="space-y-0.5">
                                    <li className="text-lg font-semibold">F1 - Excluir item</li>
                                    <li className="text-lg font-semibold">F2 - Inserir quantidade/peso</li>
                                    <li className="text-lg font-semibold">F3 - Ir para o pagamento</li>
                                    <li className="text-lg font-semibold">F12 - Voltar ao menu inicial</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="flex w-2/3 flex-col gap-4">
                        {/* Lista de itens */}
                        <div className="flex h-[384px] bg-green-200 items-center justify-center rounded-lg">
                            <span className="text-2xl font-semibold">Lista de Itens</span>
                        </div>
                        {/* Valor total */}
                        <div className="flex h-32 bg-red-200 rounded-lg">
                            <div className="self-start text-3xl font-semibold pt-4 pl-6">
                                <h2 className="text-3xl font-semibold">Valor total</h2>
                            </div>
                            <div className="flex items-end justify-end pb-4 pr-8 flex-1">
                                <h2 className="text-5xl font-semibold">R$ 0,00</h2>
                            </div>
                        </div>
                    </div> 
                </div>
            </div>  
        </AuthenticatedLayout>
    );
}