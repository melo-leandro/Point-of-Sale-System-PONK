<?php

namespace App\Http\Controllers;

use App\Http\Requests\VendaRequest;
use App\Http\Requests\ItemVendaRequest;
use App\Models\Venda;
use App\Models\ItemVenda;

class VendaController extends Controller
{
    public function index() {
        $vendas = Venda::all();
        return view('vendas.index', compact('vendas'));
    }

    public function store(VendaRequest $request) {
        Venda::create($request->all());
        return redirect()->route('vendas.index');
    }

    public function destroy($id) {
        Venda::destroy($id);
        return redirect()->route('vendas.index');
    }

    public function adicionarItem(VendaRequest $request, $id) {

        try{
            DB::beginTransaction();
            
            $venda = Venda::findOrFail($id);
            $itemVenda = new ItemVenda($request->all());
            $venda->itens()->save($itemVenda);

            if($venda->status === 'finalizada' || $venda->status === 'cancelada') {
                throw new \Exception('Operação não pode ser concluida!');
            }

            $produto = $itemVenda->find($itemVenda->produto_id);
            $valor = $produto->$valor_unitario * $itemVenda->qtd;
            $venda->update([
                'valor_total' => $venda->valor_total + $valor
            ]);
            
            DB::commit();
            
            return redirect()->route('vendas.show', $id);
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                        ->with('error', 'Erro ao adicionar item: ' . $e->getMessage());
        }
    }

    public function removerItem(Request $request) {
        $request->validate([
                'pin' => 'required|string',
                'venda_id' => 'required|integer|exists:vendas,id'
        ]);
        
        try{
            DB::beginTransaction();

            $venda = Venda::findOrFail($request->input('venda_id'));
            $usuario = auth()->user();

            if($venda->status === 'finalizada' || $venda->status === 'cancelada') {
                throw new \Exception('Operação não pode ser concluida!');
            }

            if (empty($request->pin)) {
                return redirect()->back()
                            ->with('error', 'Operação só pode ser realizada por um gerente!');
            }

            $item_id = $request->input('item_id');
            $item = $venda->itens()->findOrFail($item_id);
            $produto = $item->find($item->produto_id);
            $valor = $produto->valor_unitario * $item->qtd;
            $item->delete();

            $venda->update([
                'valor_total' => $venda->valor_total - $valor
            ]);

            DB::commit();

            return redirect()->route('vendas.show', $venda_id);
        }catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                        ->with('error', 'Erro ao remover item: ' . $e->getMessage());
        }
    } 

    public function aplicarDesconto(Request $request, $venda_id) {
        $request->validate([
            'pin' => 'required|string', 
            'percentual_desconto' => 'required|numeric|min:0|max:100'
        ]);

        try {
            DB::beginTransaction();

            $venda = Venda::findOrFail($id);
            $usuario = auth()->user();

            if($venda->status === 'finalizada' || $venda->status === 'cancelada') {
                throw new \Exception('Operação não pode ser concluida!');
            }   

            if (empty($request->pin)) {
                throw new \Exception('Somente um gerente pode aplicar desconto!');
            }

            $percentualDesconto = $request->input('percentual_desconto');
            $desconto = $venda->valor_total * ($percentualDesconto / 100);
            
            $venda->update([
                'valor_total' => $venda->valor_total - $desconto
            ]);

            DB::commit();
            
            return redirect()->route('vendas.show', $venda_id);
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                        ->with('error', 'Erro ao aplicar desconto: ' . $e->getMessage());
        }
    }

    public function calculaTroco(Request $request) {
        $request->validate([
            'valor_pago' => 'required|numeric|min:0'
        ]);

        try {
            DB::beginTransaction();

            $venda = Venda::findOrFail($venda_id);

            if($venda->status === 'finalizada' || $venda->status === 'cancelada') {
                throw new \Exception('Operação não pode ser concluida!');
            }

            if($venda->forma_pagamento !== 'dinheiro') {
                throw new \Exception('Venda só devolve troco se pagamento for realizado em dinheiro!');
            }

            $valorPago = $request->input('valor_pago');

            if ($valorPago < $venda->valor_total) {
                throw new \Exception('Valor pago é menor que o total da venda!');
            }

            $troco = $valorPago - $venda->valor_total;

            DB::commit();

            return number_format($troco, 2, ',', '.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                        ->with('error', 'Erro ao calcular troco ' . $e->getMessage());
        }
    }

    public function cancelarVenda($id){
        $request->validate([
            'pin' => 'required|string'
        ]);

        try {
            DB::beginTransaction();

            $venda = Venda::findOrFail($id);
            $usuario = auth()->user();

            if (empty($usuario->pin)) {
                throw new \Exception('Operação só pode ser realizada por um gerente!');
            }

            if ($venda->status === 'cancelada') {
                return redirect()->route('vendas.show', $id)
                            ->with('error', 'Esta venda já está cancelada.');
            }

            if ($venda->status === 'finalizada') {
                throw new \Exception('Vendas finalizadas não podem ser canceladas.');
            }

            $venda->update([
                'cancelada' => true
            ]);

            DB::commit();

            return redirect()->route('vendas.show', $id);
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                        ->with('error', 'Falha ao cancelar venda: ' . $e->getMessage());
        }
    }
}
