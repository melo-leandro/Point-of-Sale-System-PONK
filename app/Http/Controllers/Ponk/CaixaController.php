<?php

namespace App\Http\Controllers;

use Illuminate\Http\Requests\CaixaRequest;
use App\Models\Caixa;

class CaixaController extends Controller
{
    public function index() {
        $caixas = Caixa::all();
        return view('caixas.index', compact('caixas'));
    }

    public function checkCaixaStatus($id) {
        $caixa = CaixaRequest::find($id);
        return $caixa?->aberto ?? false;
    }

    public function store(CaixaRequest $request) {
        Caixa::create($request->all());
        return redirect()->route('caixas.index');
    }

    public function destroy($id) {
        Caixa::destroy($id);
        return redirect()->route('caixas.index');
    }

    // Processa a abertura do caixa
    public function abrir(CaixaRequest $request)
    {
        $validated = $request->validated();

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
                'aberto_em' => now(),
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
    public function fechar(CaixaRequest $request)
    {
        $validated = $request->validated();

        try {
            DB::beginTransaction();
            $caixa = Caixa::where('user_id', Auth::id())->first();

            if (!$caixa) {
                return redirect()->route('caixa.show', $caixa->numeracao)
                            ->with('error', 'Nenhum caixa encontrado!');
            }

            if ($caixa->fechado) {
                return redirect()->route('caixa.show', $caixa->numeracao)
                                ->with('error', 'O caixa deste usuário já está fechado!');
            }

            $caixa->update([
                'aberto' => false,
                'aberto_em' =>null
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
}