<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Caixa;

class CaixaController extends Controller
{
    public function index() {
        $caixas = Caixa::all();
        return view('caixas.index', compact('caixas'));
    }

    public function store(Request $request) {
        Caixa::create($request->all());
        return redirect()->route('caixas.index');
    }

    public function destroy($id) {
        Caixa::destroy($id);
        return redirect()->route('caixas.index');
    }
}