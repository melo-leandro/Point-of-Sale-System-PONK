import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function PointOfSale() {
    return (
        <AuthenticatedLayout>
            <div className="ml-96 mr-96 mt-24">
                <div className="text-5xl font-bold text-center mt-10 bg-red-500 text-white pt-5 pb-5 rounded-lg">
                    <h1>temp</h1>
                </div>
                <div className="flex">
                    {/* put the text at the bottom of the div */}
                    <div>
                        <div className="self-end">Column 1</div>
                    </div>
                    <div className="flex w-1/2 h-96 bg-green-200 text-5xl font-semibold items-center justify-center">Column 2</div>
                </div>
            </div>  
        </AuthenticatedLayout>
    );
}