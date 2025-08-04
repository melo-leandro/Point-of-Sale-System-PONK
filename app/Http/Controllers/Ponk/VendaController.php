<?php

namespace App\Http\Controllers;

use App\Http\Requests\VendaRequest;
use App\Http\Requests\ItemVendaRequest;
use App\Models\Venda;
use App\Models\ItemVenda;

class VendaController extends Controller
{
    public function index() {
        $vendas = Venda::all();
        return view('vendas.index', compact('vendas'));
    }

    public function store(Request $request) {
        Venda::create($request->all());
        return redirect()->route('vendas.index');
    }

    public function destroy($id) {
        Venda::destroy($id);
        return redirect()->route('vendas.index');
    }

    public function addicionarItem(Request $request, $id) {
        $venda = Venda::findOrFail($id);
        $itemVenda = new ItemVenda($request->all());
        $venda->itens()->save($itemVenda);
        return redirect()->route('vendas.show', $id);
    }
}
