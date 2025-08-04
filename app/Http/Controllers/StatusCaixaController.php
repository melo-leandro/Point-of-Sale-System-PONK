<?php

namespace App\Http\Controllers;
use App\Models\Venda;
use Inertia\Inertia;
use Illuminate\Http\Request;

class StatusCaixaController extends Controller
{
    public function index()
    {
        $vendas = Venda::all();

        return Inertia::render('StatusCaixa', [
            'vendas' => $vendas,
        ]);
    }
}
