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
use Illuminate\Validation\ValidationException;

class PointOfSaleController extends Controller
{
    public function index()
    {

        if (!auth()->check()) {
            return redirect()->route('login');
        }

        $user = auth()->user();
        try {
            $caixa = Caixa::where('user_id', $user->id)->firstOrFail();
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'Usuário não está associado a um caixa');
        }

        $vendas = Venda::where('caixa_id', $caixa->numeracao)->get();
        if ($vendas->isEmpty()) {
            $vendas = [];
        }

        return Inertia::render('PointOfSale', [  
            'user' => $user,
            'caixa_id' => $caixa->numeracao,
            'caixa_status' => $caixa->aberto ? 'Aberto' : 'Fechado',    
            'vendas' => $vendas
        ]);
    }

    public function acoesVenda(Request $request, $acao)
    {
        return match ($acao) {
            'itens-adicionados' => app('App\Http\Controllers\Ponk\VendaController')->itensAdicionados($request),
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
            'imprimir-cupom' => app('App\Http\Controllers\Ponk\CaixaController')->imprimeCupom(),
            default => response()->json(['erro' => 'Ação não encontrada'], 404)
        };
    }
}
