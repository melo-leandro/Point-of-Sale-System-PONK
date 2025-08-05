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

        $user = auth()->user();

        $user = auth()->user();
        $caixa = Caixa::where('user_id', $user->id)->first();

        $vendas = Venda::where('caixa_id', $caixa->numeracao)->get();
        if ($vendas->isEmpty()) {
            $vendas = [];
        }

        if (!$caixa) {
            throw new \Illuminate\Database\Eloquent\ModelNotFoundException('Caixa not found for the current user.');
        }

        return Inertia::render('StatusCaixa', [
            'user' => $user,
            'vendas' => $vendas,
            'caixa_numeracao' => $caixa->numeracao,
            'statusAlteradoData' => $caixa->status_alterado_em,
            'aberto' => $caixa->aberto,
        ]);
    }
    public function acoesCaixa(Request $request, $acao)
    {
        return match ($acao) {
            'abrir' => app('App\Http\Controllers\Ponk\CaixaController')->abrir(),
            'fechar' => app('App\Http\Controllers\Ponk\CaixaController')->fechar(),
            default => response()->json(['erro' => 'Ação não encontrada'], 404)
        };
    }
}
