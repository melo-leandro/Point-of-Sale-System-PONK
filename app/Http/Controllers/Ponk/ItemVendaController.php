<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ItemVenda;

class ItemVendaController extends Controller
{
    public function index() {
        $itensVenda = ItemVenda::all();
        return view('itemVendas.index', compact('itemVendas'));
    }

    public function store(Request $request) {
        ItemVenda::create($request->all());
        return redirect()->route('itemVendas.index');
    }

    public function destroy($id) {
        ItemVenda::destroy($id);
        return redirect()->route('itemVendas.index');
    }
}
