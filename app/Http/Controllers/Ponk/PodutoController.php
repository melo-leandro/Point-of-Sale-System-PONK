<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Produto;

class ProdutoController extends Controller
{
    public function index() {
        $produtos = Produto::all();
        return view('produtos.index', compact('produtos'));
    }

    public function store(Request $request) {
        Produto::create($request->all());
        return redirect()->route('produtos.index');
    }

    public function destroy($id) {
        Produto::destroy($id);
        return redirect()->route('produtos.index');
    }
}
