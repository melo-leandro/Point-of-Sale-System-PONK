<?php

namespace App\Http\Controllers;
use App\Models\Venda;
use App\Models\Caixa;
use Inertia\Inertia;
use Illuminate\Http\Request;

class StatusCaixaController extends Controller
{
    public function index()
    {
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        $caixa_numeracao = auth()->user()->caixa_id;

        $vendas = Venda::where('caixa_id' === $caixa_numeracao)->get();

        $caixa = Caixa::where('numeracao', $caixa_numeracao)->first();

        if (!$caixa) {
            throw new \Illuminate\Database\Eloquent\ModelNotFoundException('Caixa not found for the current user.');
        }

        return Inertia::render('StatusCaixa', [
            'vendas' => $vendas,
            'caixa_id' => $caixa->id,
            'aberto' => $caixa->aberto,
        ]);
    }
}
