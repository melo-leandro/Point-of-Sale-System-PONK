<?php

namespace App\Http\Controllers\Ponk;

use App\Http\Requests\CaixaRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\Caixa;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class CaixaController extends Controller
{
    public function index() {
        $caixas = Caixa::all();
        return Inertia::render('Caixas/Index', [
            'caixas' => $caixas
        ]);
    }

    public function show($numeracao = null) {
        $user = auth()->user();
        
        if ($numeracao) {
            $caixa = Caixa::where('numeracao', $numeracao)->first();
        } else {
            $caixa = Caixa::where('user_id', $user->id)->first();
        }
        
        if (!$caixa) {
            return redirect()->route('caixas.index')->with('error', 'Caixa não encontrado');
        }
        
        return Inertia::render('Caixas/Show', [
            'caixa' => $caixa,
            'user' => $user
        ]);
    }
    
    public function store(CaixaRequest $request) {
        Caixa::create($request->all());
        return redirect()->route('caixas.index');
    }
    
    public function destroy($id) {
        Caixa::destroy($id);
        return redirect()->route('caixas.index');
    }
    
    public function checkCaixaStatus(Request $request) {
        validate($request, [
            'id' => 'required|exists:caixas,id',
        ]);

        $id = request()->input('id');
        $caixa = Caixa::find($id);
        return $caixa?->aberto ?? false;
    }

    // Processa a abertura do caixa
    public function abrir() {
        try {
            DB::beginTransaction();
            $caixa = Caixa::where('user_id', Auth::id())->first();

            if(!$caixa) {
                return redirect()->route('caixa.show', $caixa->numeracao)
                                ->with('error', 'Nenhum caixa encontrado para este usuário!');
            }

            if ($caixa->aberto) {
                return redirect()->route('caixa.show', $caixa->numeracao)
                                ->with('error', 'O caixa já está aberto!');
            }

            $caixa->update([
                'aberto' => true,
                'saldo_inicial' => $validated['saldo_inicial'],
                'status_alterado_em' => now('GMT-3'),
            ]);
            
            DB::commit(); 

            return redirect()->route('caixa.show', $caixa->numeracao)
                             ->with('success', 'Caixa aberto com sucesso!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('caixa.show', $caixa->numeracao)
                             ->with('error', 'Erro ao abrir o caixa: ' . $e->getMessage());
        }
    }

    // Processa o fechamento do caixa
    public function fechar() {
        try {
            DB::beginTransaction();
            $caixa = Caixa::where('user_id', Auth::id())->first();

            if (!$caixa) {
                return redirect()->route('caixa.index')
                            ->with('error', 'Nenhum caixa encontrado!');
            }

            if (!$caixa->aberto) {
                return redirect()->route('caixa.show', $caixa->numeracao)
                                ->with('error', 'O caixa deste usuário já está fechado!');
            }

            $caixa->update([
                'aberto' => false,
                'status_alterado_em' => now('GMT-3')
            ]);

            DB::commit();
            return redirect()->route('caixa.show', $caixa->numeracao)
                             ->with('success', 'Caixa fechado com sucesso!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('caixa.show', $caixa->numeracao)
                             ->with('error', 'Erro ao fechar o caixa: ' . $e->getMessage());
        }

    }
    
    public function abrirGaveta() {
        // Integração com hardware (se aplicável)
        return app('App\Http\Controllers\Ponk\HardwareController')->abrirGavetaDoCaixa();
    }

}
