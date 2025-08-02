import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function PointOfSale() {
    return (
        <AuthenticatedLayout>
            <div className="ml-96 mr-96 mt-24">
                <div className="text-5xl font-bold text-center mt-10 bg-red-500 text-white pt-5 pb-5 rounded-lg">
                    <h1>temp</h1>
                </div>
                <div class="flex">
                    <div className="w-1/2 bg-red-200">Column 1</div>
                    <div className="w-1/2 bg-green-200">Column 2</div>
                </div>
            </div>  
        </AuthenticatedLayout>
    );
}