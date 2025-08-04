<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\ItemVendaRequest;
use App\Models\Venda;
use App\Models\Produto;
use App\Models\Caixa;
use Illuminate\Support\Facades\DB;

class PointOfSaleController extends Controller
{
    public function index()
    {

        if (!auth()->check()) {
            return redirect()->route('login');
        }

        $user = auth()->user()->load(['caixa', 'vendas.produtos']);

        if (!$user->caixa_id) {
            return redirect()->back()
                ->with('error', 'Usuário não está associado a um caixa');
        }

        return Inertia::render('PointOfSale', [  
            'user' => $user,
            'caixa_id' => $user->caixa_id,
            'caixa_status' => $user->caixa->aberto ? 'Aberto' : 'Fechado',    
            'vendas' => $user->vendas()->with('produtos')->get(),
        ]);
    }

    public function acoesVenda(Request $request, $acao)
    {
        return match ($acao) {
            'adicionar-item' => app('App\Http\Controllers\Ponk\VendaController')->adicionarItem($request),
            'remover-item' => app('App\Http\Controllers\Ponk\VendaController')->removerItem($request),
            'aplicar-desconto' => app('App\Http\Controllers\Ponk\VendaController')->aplicarDesconto($request),
            'cancelar' => app('App\Http\Controllers\Ponk\VendaController')->cancelarVenda($request),
            'finalizar' => app('App\Http\Controllers\Ponk\VendaController')->finalizarVenda($request),
            default => response()->json(['erro' => 'Ação não encontrada'], 404)
        };
    }
    
    public function acoesCaixa(Request $request, $acao)
    {
        return match ($acao) {
            'abrir' => app('App\Http\Controllers\Ponk\CaixaController')->abrir(),
            'fechar' => app('App\Http\Controllers\Ponk\CaixaController')->fechar(),
            'verificar-status' => app('App\Http\Controllers\Ponk\CaixaController')->checkCaixaStatus($request),
            'abrir-gaveta' => app('App\Http\Controllers\Ponk\CaixaController')->abrirGaveta(),
            default => response()->json(['erro' => 'Ação não encontrada'], 404)
        };
    }
}
