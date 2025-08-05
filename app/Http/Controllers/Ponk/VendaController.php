<?php

namespace App\Http\Controllers\Ponk;

use App\Http\Requests\VendaRequest;
use App\Http\Requests\ItemVendaRequest;
use App\Models\Venda;
use App\Models\ItemVenda;
use App\Models\Produto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class VendaController extends Controller
{
    public function index() {
        $vendas = Venda::all();
        return view('vendas.index', compact('vendas'));
    }

    public function store(VendaRequest $request) {
        $dadosVenda = $request->all();
        
        // Define o usuário automaticamente se não foi enviado
        if (!isset($dadosVenda['usuario_id'])) {
            $dadosVenda['usuario_id'] = auth()->id();
        }
        
        // Converte CPF vazio para null
        if (isset($dadosVenda['cpf_cliente']) && $dadosVenda['cpf_cliente'] === '') {
            $dadosVenda['cpf_cliente'] = null;
        }
        
        $venda = Venda::create($dadosVenda);
        
        // Para requisições Inertia (vindas do Point of Sale), redireciona de volta com os dados atualizados
        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Venda criada com sucesso');
        }
        
        // Se for uma requisição AJAX tradicional, retorna JSON
        if ($request->expectsJson()) {
            return response()->json(['venda' => $venda]);
        }
        
        return redirect()->route('vendas.index');
    }

    public function destroy($id) {
        Venda::destroy($id);
        return redirect()->route('vendas.index');
    }

    public function itensAdicionados(Request $request) {
        $vendaId = $request->input('venda_id');
        $venda = Venda::findOrFail($vendaId);

        
        if ($venda->status !== 'pendente') {
            return response()->json([
                'success' => false,
                'message' => 'Operação não pode ser concluida!'
            ], 422);
        }

        try {
            // Get items without eager loading first to avoid relationship errors
            $itens = $venda->itens()->get();
            
            // Garante que os valores sejam retornados como números
            $itensFormatados = $itens->map(function ($item) {
                return [
                    'id_item' => $item->id_item,
                    'produto_id' => $item->produto_id,
                    'qtde' => (float) $item->qtde,
                    'venda_id' => $item->venda_id,
                    'created_at' => $item->created_at,
                    'updated_at' => $item->updated_at,
                ];
            });
            
            // Get products separately to handle any data type issues
            $produtoIds = $itens->pluck('produto_id')->filter()->unique();
            $produtos = \App\Models\Produto::whereIn('codigo', $produtoIds)->get();
            
            $produtosFormatados = $produtos->map(function ($produto) {
                return [
                    'codigo' => $produto->codigo,
                    'nome' => $produto->nome,
                    'unidade' => $produto->unidade,
                    'valor_unitario' => (float) $produto->valor_unitario,
                    'created_at' => $produto->created_at,
                    'updated_at' => $produto->updated_at,
                ];
            });

            return response()->json([
                'success' => true,
                'itens' => $itensFormatados,
                'produtos' => $produtosFormatados
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Erro ao carregar itens da venda:', [
                'venda_id' => $vendaId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Erro ao carregar itens da venda'
            ], 500);
        }
    }

    public function adicionarItem(Request $request) {
        $request->validate([
            'produto_id' => 'required|string|exists:produtos,codigo',
            'qtde' => 'required|numeric|min:0.01',
            'venda_id' => 'required|integer|exists:vendas,id'
        ]);
        
        try{
            DB::beginTransaction();
            
            $venda_id = $request->input('venda_id');
            $venda = Venda::findOrFail($venda_id);

            if ($venda->status !== 'pendente') {
                throw new \Exception('Operação não pode ser concluida!');
            }
            
            // Log dos dados que estão sendo enviados
            \Log::info('Criando item com dados:', [
                'produto_id' => $request->input('produto_id'),
                'qtde' => $request->input('qtde'),
                'venda_id' => $venda_id
            ]);
            
            $itemVenda = ItemVenda::create([
                'produto_id' => $request->input('produto_id'),
                'qtde' => $request->input('qtde'),
                'venda_id' => $venda_id
            ]);
            
            \Log::info('Item criado:', ['item' => $itemVenda]);

            $produto = Produto::where('codigo', $itemVenda->produto_id)->firstOrFail();
            $valor = $produto->valor_unitario * $itemVenda->qtde;
            
            $venda->update([
                'valor_total' => $venda->valor_total + $valor
            ]);
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'item' => [
                    'id_item' => $itemVenda->id_item,
                    'produto_id' => $itemVenda->produto_id,
                    'qtde' => (float) $itemVenda->qtde,
                    'venda_id' => $itemVenda->venda_id,
                ],
                'produto' => [
                    'codigo' => $produto->codigo,
                    'nome' => $produto->nome,
                    'unidade' => $produto->unidade,
                    'valor_unitario' => (float) $produto->valor_unitario,
                ],
                'message' => 'Item adicionado com sucesso'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Erro ao adicionar item:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json([
                'success' => false,
                'message' => 'Erro ao adicionar item: ' . $e->getMessage()
            ], 422);
        }
    }

    public function removerItem(Request $request) {
        $request->validate([
                'pin' => 'required|string',
                'venda_id' => 'required|integer|exists:vendas,id',
                'item_id' => 'required|integer|exists:itens_venda,id_item'
        ]);
        
        try{
            DB::beginTransaction();
            $venda_id = $request->input('venda_id');
            $venda = Venda::findOrFail($venda_id);
            $usuario = auth()->user();

            if(!$venda) {
                throw new \Exception('Venda não encontrada');
            }

            if($venda->status !== 'pendente') {
                throw new \Exception('Operação não pode ser concluida!');
            }

            if (empty($request->pin)) {
                return redirect()->back()
                            ->with('error', 'Operação só pode ser realizada por um gerente!');
            }

            $item_id = $request->input('item_id');

            $item = $venda->itens()->where('id_item', $item_id)->firstOrFail();

            if (!$item) {
                throw new \Exception('Item não encontrado na venda');
            }

            $produto = Produto::where('codigo', $item->produto_id)->firstOrFail();

            $valor = $produto->valor_unitario * $item->qtde;
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

    public function aplicarDesconto(Request $request) {
        $request->validate([
            'pin' => 'required|string', 
            'percentual_desconto' => 'required|numeric|min:0|max:100',
            'id' => 'required|integer|exists:vendas,id'
        ]);

        try {
            DB::beginTransaction();

            $id = $request->input('id');
            $venda = Venda::findOrFail($id);
            $usuario = auth()->user();

            if(!$venda) {
                throw new \Exception('Venda não encontrada');
            }

            if($venda->status !== 'pendente') {
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
            
            return redirect()->route('vendas.show', $id);
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                        ->with('error', 'Erro ao aplicar desconto: ' . $e->getMessage());
        }
    }

    private function calculaTroco(Request $request) {
        $request->validate([
            'valor_pago' => 'required|numeric|min:0',
            'id' => 'required|integer|exists:vendas,id'
        ]);

        try {
            DB::beginTransaction();
            
            $id = $request->input('id');
            $venda = Venda::findOrFail($id);

            if(!$venda) {
                throw new \Exception('Venda não encontrada');
            }

            if($venda->status !== 'pendente') {
                throw new \Exception('Operação não pode ser concluida!');
            }

            $valorPago = $request->input('valor_pago');

            if ($valorPago < $venda->valor_total) {
                throw new \Exception('Valor pago é menor que o total da venda!');
            }

            $troco = $valorPago - $venda->valor_total;

            DB::commit();

            // Retorna o valor numerico do troco com duas casas
            return response()->json([
                'troco' => round($troco, 2)
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                        ->with('error', 'Erro ao calcular troco ' . $e->getMessage());
        }
    }

    public function cancelarVenda(Request $request) {
        $request->validate([
            'pin' => 'required|string',
            'id' => 'required|integer|exists:vendas,id'
        ]);

        try {
            DB::beginTransaction();
            
            $id = $request->input('id');
            $venda = Venda::findOrFail($id);
            $usuario = auth()->user();

            if(!$venda) {
                throw new \Exception('Venda não encontrada');
            }

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
                'status' => 'cancelada'
            ]);

            DB::commit();

            return redirect()->route('vendas.show', $id);
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                        ->with('error', 'Falha ao cancelar venda: ' . $e->getMessage());
        }
    }

    public function finalizarVenda(Request $request) {
        $request->validate([
            'id' => 'required|integer|exists:vendas,id'
        ]);

        try{
            DB::beginTransaction();
            
            $id = $request->input('id');
            $venda = Venda::findOrFail($id);

            if(!$venda) {
                throw new \Exception('Venda não encontrada');
            }

            if ($venda->status === 'finalizada') {
                return redirect()->route('vendas.show', $id)
                            ->with('error', 'Esta venda já está finalizada.');
            }

            if ($venda->status === 'cancelada') {
                return redirect()->route('vendas.show', $id)
                            ->with('error', 'Vendas canceladas não podem ser finalizadas.');
            }

            $venda->update(['status' => 'finalizada']);

            DB::commit();

            if ($venda->forma_pagamento === 'dinheiro') {
                $troco = $this->calculaTroco($request);

                app('App\Http\Controllers\Ponk\CaixaController')->abrirGaveta();

                return redirect()->route('vendas.show', $id)
                            ->with('success', 'Venda finalizada com sucesso! Troco: ' . $troco['troco']);
            }
            
            imprimeCupom();
            return redirect()->route('vendas.show', $id);
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                        ->with('error', 'Erro ao finalizar venda: ' . $e->getMessage());
        }
    }

    public function atualizaQuantidade(Request $request) {
        $request->validate([
            'nova_quantidade' => 'required|integer|min:1',
            'venda_id' => 'required|integer|exists:vendas,id'
        ], [
            'nova_quantidade.required' => 'A quantidade é obrigatória.',
            'nova_quantidade.integer' => 'A quantidade deve ser um número inteiro.',
            'nova_quantidade.min' => 'A quantidade deve ser maior que zero.'
        ]);

        try {
            DB::beginTransaction();
            
            $vendaId = $request->input('venda_id');
            $venda = Venda::findOrFail($vendaId);

            if ($venda->status !== 'pendente') {
                throw new \Exception('Operação não pode ser concluida!');
            }

            $novaQuantidade = $request->input('nova_quantidade');

            $item = $venda->itens()->orderBy('created_at', 'desc')->first();

            if (!$item) {
                throw new \Exception('Nenhum item encontrado na venda');
            }

            // Get the product to calculate the price difference
            $produto = Produto::where('codigo', $item->produto_id)->firstOrFail();
            
            // Calculate the difference in value
            $quantidadeAnterior = $item->qtde;
            $diferencaQuantidade = $novaQuantidade - $quantidadeAnterior;
            $diferencaValor = $produto->valor_unitario * $diferencaQuantidade;
            
            // Update the item quantity
            $item->update(['qtde' => $novaQuantidade]);
            
            // Update the sale total
            $venda->update([
                'valor_total' => $venda->valor_total + $diferencaValor
            ]);

            DB::commit();
            
            return response()->json(['success' => true, 'message' => 'Quantidade atualizada com sucesso']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Erro ao atualizar quantidade: ' . $e->getMessage()], 422);
        }
    }

    public function atualizaPeso(Request $request) {
        $request->validate([
            'novo_peso' => 'required|numeric|min:0.001|max:999.999',
            'venda_id' => 'required|integer|exists:vendas,id'
        ], [
            'novo_peso.required' => 'O peso é obrigatório.',
            'novo_peso.numeric' => 'O peso deve ser um número válido.',
            'novo_peso.min' => 'O peso deve ser maior que 0.001 kg.',
            'novo_peso.max' => 'O peso não pode exceder 999.999 kg.'
        ]);

        try {
            DB::beginTransaction();
            
            $vendaId = $request->input('venda_id');
            $venda = Venda::findOrFail($vendaId);

            if ($venda->status !== 'pendente') {
                throw new \Exception('Operação não pode ser concluida!');
            }

            $novoPeso = round($request->input('novo_peso'), 3); // Arredonda para 3 casas decimais

            $item = $venda->itens()->orderBy('created_at', 'desc')->first();

            if (!$item) {
                throw new \Exception('Nenhum item encontrado na venda');
            }

            // Get the product to verify if it's sold by weight
            $produto = Produto::where('codigo', $item->produto_id)->firstOrFail();
            
            // Check if product is sold by weight (unit should be 'kg', 'g', etc.)
            $unidadesPeso = ['kg', 'g', 'gramas', 'quilos', 'kilo'];
            if (!in_array(strtolower($produto->unidade), $unidadesPeso)) {
                throw new \Exception('Este produto não é vendido por peso. Use a função de quantidade.');
            }
            
            // Calculate the difference in value
            $pesoAnterior = $item->qtde;
            $diferencaPeso = $novoPeso - $pesoAnterior;
            $diferencaValor = $produto->valor_unitario * $diferencaPeso;
            
            // Update the item weight (stored in qtde field)
            $item->update(['qtde' => $novoPeso]);
            
            // Update the sale total
            $venda->update([
                'valor_total' => round($venda->valor_total + $diferencaValor, 2)
            ]);

            DB::commit();
            
            return response()->json([
                'success' => true, 
                'message' => 'Peso atualizado com sucesso',
                'novo_peso' => $novoPeso,
                'valor_item' => round($produto->valor_unitario * $novoPeso, 2),
                'valor_total_venda' => round($venda->valor_total, 2)
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Erro ao atualizar peso: ' . $e->getMessage()], 422);
        }
    }

    private function imprimeCupom() {
        // Integração com hardware (se aplicável)
        return app('App\Http\Controllers\Ponk\HardwareController')->imprimeCupomFiscal();
    }
}
