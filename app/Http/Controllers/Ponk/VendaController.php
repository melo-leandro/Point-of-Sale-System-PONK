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
use App\Models\User;

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
            
            // Pega todos os produtos separadamente e retorna
            $produtos = \App\Models\Produto::all();

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
                'produtos' => $produtosFormatados,
                'novo_valor_total' => (float) $venda->valor_total,
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
            $venda = Venda::find($venda_id);

            // Verificações adicionais para garantir que a venda existe e está válida
            if (!$venda) {
                return response()->json([
                    'success' => false,
                    'message' => 'Venda não encontrada. Por favor, aguarde alguns segundos e tente novamente.'
                ], 404);
            }

            if ($venda->status !== 'pendente') {
                return response()->json([
                    'success' => false,
                    'message' => 'Operação não pode ser concluída! A venda não está em estado pendente.'
                ], 422);
            }
            
            // Log dos dados que estão sendo enviados
            \Log::info('Adicionando item com dados:', [
                'produto_id' => $request->input('produto_id'),
                'qtde' => $request->input('qtde'),
                'venda_id' => $venda_id,
                'venda_status' => $venda->status
            ]);

            $produto_id = $request->input('produto_id');
            $nova_qtde = $request->input('qtde');

            // Buscar o produto para verificar a unidade
            $produto = Produto::where('codigo', $produto_id)->firstOrFail();

            // Para produtos em KG, sempre criar nova entrada (produtos pesáveis)
            // Para produtos em UN, verificar se já existe e somar
            $itemExistente = null;
            if ($produto->unidade === 'UN') {
                $itemExistente = ItemVenda::where('venda_id', $venda_id)
                                         ->where('produto_id', $produto_id)
                                         ->first();
            }

            if ($itemExistente) {
                // Se o item já existe (apenas para produtos UN), somar a quantidade
                $qtde_anterior = $itemExistente->qtde;
                $qtde_nova = $qtde_anterior + $nova_qtde;
                
                $itemExistente->update(['qtde' => $qtde_nova]);
                
                \Log::info('Item existente atualizado:', [
                    'item_id' => $itemExistente->id_item,
                    'produto' => $produto->nome,
                    'unidade' => $produto->unidade,
                    'qtde_anterior' => $qtde_anterior,
                    'qtde_adicionada' => $nova_qtde,
                    'qtde_nova' => $qtde_nova
                ]);

                $itemVenda = $itemExistente;
            } else {
                // Se o item não existe ou é produto KG, criar um novo
                $itemVenda = ItemVenda::create([
                    'produto_id' => $produto_id,
                    'qtde' => $nova_qtde,
                    'venda_id' => $venda_id
                ]);
                
                \Log::info('Novo item criado:', [
                    'item' => $itemVenda,
                    'produto' => $produto->nome,
                    'unidade' => $produto->unidade,
                    'motivo' => $produto->unidade === 'KG' ? 'produto_pesavel' : 'item_novo'
                ]);
            }

            if ($itemExistente) {
                // Se foi atualização, somar apenas o valor da quantidade adicional
                $valor_adicional = $produto->valor_unitario * $nova_qtde;
                $venda->update([
                    'valor_total' => $venda->valor_total + $valor_adicional
                ]);
                
                \Log::info('Valor da venda atualizado:', [
                    'valor_adicional' => $valor_adicional,
                    'novo_valor_total' => $venda->valor_total + $valor_adicional
                ]);
            } else {
                // Se foi criação, calcular o valor total do item
                $valor = $produto->valor_unitario * $itemVenda->qtde;
                $venda->update([
                    'valor_total' => $venda->valor_total + $valor
                ]);
                
                \Log::info('Valor da venda atualizado:', [
                    'valor_item' => $valor,
                    'novo_valor_total' => $venda->valor_total + $valor
                ]);
            }
            
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
                'action' => $itemExistente ? 'updated' : 'created',
                'qtde_adicionada' => (float) $nova_qtde,
                'message' => $itemExistente ? 
                    "Quantidade do item '{$produto->nome}' atualizada para {$itemVenda->qtde} UN" : 
                    ($produto->unidade === 'KG' ? 
                        "Item '{$produto->nome}' adicionado ({$nova_qtde} kg)" :
                        "Item '{$produto->nome}' adicionado com sucesso"
                    )
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


            $encontrado = User::where('pin', $request->input('pin'))
                ->whereNotNull('pin')
                ->first();

            if (!$encontrado || empty($request->input('pin'))) {
                return redirect()
                    ->back()
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
            $venda = Venda::where('id', $id)->lockForUpdate()->firstOrFail();

            if(!$venda) {
                throw new \Exception('Venda não encontrada');
            }

            if($venda->status !== 'pendente') {
                throw new \Exception('Operação não pode ser concluida!');
            }   

            // Validação do PIN do gerente
            $encontrado = User::where('pin', $request->input('pin'))
                ->whereNotNull('pin')
                ->first();

            if (!$encontrado || empty($request->input('pin'))) {
                throw new \Exception('PIN inválido. Somente um gerente pode aplicar desconto!');
            }

            $percentualDesconto = $request->input('percentual_desconto');
            $desconto = $venda->valor_total * ($percentualDesconto / 100);
            
            $venda->update([
                'valor_total' => $venda->valor_total - $desconto
            ]);

            DB::commit();
            
            \Log::info('Desconto aplicado com sucesso:', [
                'venda_id' => $id,
                'percentual' => $percentualDesconto,
                'valor_desconto' => $desconto,
                'usuario_aplicacao' => auth()->id()
            ]);

            // Para requisições AJAX/Inertia, retorna JSON
            if ($request->expectsJson() || $request->header('X-Inertia')) {
                return response()->json([
                    'success' => true,
                    'message' => "Desconto de {$percentualDesconto}% aplicado com sucesso!"
                ]);
            }
            
            return redirect()->route('vendas.show', $id)
                        ->with('success', "Desconto de {$percentualDesconto}% aplicado com sucesso!");
        } catch (\Exception $e) {
            DB::rollBack();
            
            \Log::error('Erro ao aplicar desconto:', [
                'venda_id' => $request->input('id'),
                'error' => $e->getMessage()
            ]);

            // Para requisições AJAX/Inertia, retorna JSON de erro
            if ($request->expectsJson() || $request->header('X-Inertia')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erro ao aplicar desconto: ' . $e->getMessage()
                ], 422);
            }
            
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
            'venda_id' => 'required|integer|exists:vendas,id'
        ]);

        try {
            DB::beginTransaction();
            
            $id = $request->input('venda_id');
            
            // Use lockForUpdate para prevenir condições de corrida
            $venda = Venda::where('id', $id)->lockForUpdate()->firstOrFail();
            
            // Log para debug
            \Log::info('Tentativa de cancelamento de venda:', [
                'venda_id' => $id,
                'status_atual' => $venda->status,
                'usuario_id' => auth()->id(),
                'pin_fornecido' => !empty($request->input('pin'))
            ]);

            // Verificação de status primeiro (antes da validação do PIN)
            if ($venda->status === 'cancelada') {
                DB::rollBack();
                if ($request->header('X-Inertia')) {
                    return redirect()->back()
                                ->with('error', 'Esta venda já está cancelada.');
                }
                if ($request->expectsJson()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Esta venda já está cancelada.'
                    ], 422);
                }
                return redirect()->back()
                            ->with('error', 'Esta venda já está cancelada.');
            }

            if ($venda->status === 'finalizada') {
                DB::rollBack();
                throw new \Exception('Vendas finalizadas não podem ser canceladas.');
            }

            // Validação do PIN apenas se a venda pode ser cancelada
            $encontrado = User::where('pin', $request->input('pin'))
                ->whereNotNull('pin')
                ->first();

            if (!$encontrado || empty($request->input('pin'))) {
                DB::rollBack();
                throw new \Exception('PIN inválido ou não encontrado.');
            }

            // Atualiza o status apenas se ainda estiver pendente
            $resultado = $venda->update([
                'status' => 'cancelada'
            ]);

            if (!$resultado) {
                throw new \Exception('Falha ao atualizar o status da venda.');
            }

            DB::commit();
            
            \Log::info('Venda cancelada com sucesso:', [
                'venda_id' => $id,
                'usuario_cancelamento' => auth()->id()
            ]);

            // Para requisições Inertia, retorna redirect com mensagem de sucesso
            if ($request->header('X-Inertia')) {
                return redirect()->route('dashboard')
                            ->with('success', 'Venda cancelada com sucesso.');
            }

            // Para requisições AJAX puras, retorna JSON
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Venda cancelada com sucesso.'
                ]);
            }

            return redirect()->route('vendas.show', $id)
                        ->with('success', 'Venda cancelada com sucesso.');
                        
        } catch (\Exception $e) {
            DB::rollBack();
            
            \Log::error('Erro ao cancelar venda:', [
                'venda_id' => $request->input('venda_id'),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Para requisições Inertia, retorna redirect com erro
            if ($request->header('X-Inertia')) {
                return redirect()->back()
                            ->with('error', 'Falha ao cancelar venda: ' . $e->getMessage());
            }
            
            // Para requisições AJAX puras, retorna JSON
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Falha ao cancelar venda: ' . $e->getMessage()
                ], 422);
            }
            
            return redirect()->back()
                        ->with('error', 'Falha ao cancelar venda: ' . $e->getMessage());
        }
    }

    public function finalizarVenda(Request $request) {
        $request->validate([
            'id' => 'required|integer|exists:vendas,id',
            'valor_pago' => 'required|numeric|min:0'
        ]);

        try{
            DB::beginTransaction();
            
            $id = $request->input('id');
            $valorPago = $request->input('valor_pago');
            $venda = Venda::findOrFail($id);

            if(!$venda) {
                throw new \Exception('Venda não encontrada');
            }

            if ($venda->status === 'finalizada') {
                DB::rollBack();
                return redirect()->back()
                            ->with('error', 'Esta venda já está finalizada.');
            }

            if ($venda->status === 'cancelada') {
                DB::rollBack();
                return redirect()->back()
                            ->with('error', 'Vendas canceladas não podem ser finalizadas.');
            }

            if ($valorPago < $venda->valor_total) {
                DB::rollBack();
                
                // Para requisições AJAX/Inertia, retorna JSON de erro
                if ($request->expectsJson() || $request->header('X-Inertia')) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Valor pago é menor que o total da venda!'
                    ], 422);
                }
                
                return redirect()->back()
                            ->with('error', 'Valor pago é menor que o total da venda!');
            }

            $venda->update(['status' => 'finalizada']);

            DB::commit();
            
            \Log::info('Venda finalizada com sucesso:', [
                'venda_id' => $id,
                'valor_total' => $venda->valor_total,
                'valor_pago' => $valorPago,
                'usuario_finalizacao' => auth()->id()
            ]);

            // Para requisições AJAX/Inertia, retorna redirect via Inertia
            if ($request->expectsJson() || $request->header('X-Inertia')) {
                return redirect()->route('pointOfSale');
            }

            return redirect()->route('pointOfSale')
                        ->with('success', 'Venda finalizada com sucesso!');
        } catch (\Exception $e) {
            DB::rollBack();
            
            \Log::error('Erro ao finalizar venda:', [
                'venda_id' => $request->input('id'),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
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

    public function validarPinGerente(Request $request) {
        $request->validate([
            'pin' => 'required|string|size:4'
        ], [
            'pin.required' => 'O PIN é obrigatório.',
            'pin.size' => 'O PIN deve ter exatamente 4 caracteres.'
        ]);

        try {
            $pin = $request->input('pin');
            
            // Se o usuário atual não tem PIN ou não confere, verifica outros usuários com permissão de gerente
            $gerente = \App\Models\User::where('pin', $pin)
                                      ->whereNotNull('pin')
                                      ->first();

            if ($gerente) {
                return response()->json([
                    'success' => true,
                    'message' => 'PIN de gerente validado com sucesso',
                    ]
                );
            }

            return response()->json([
                'success' => false,
                'message' => 'PIN inválido ou usuário sem permissão de gerente'
            ], 401);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao validar PIN: ' . $e->getMessage()
            ], 422);
        }
    }

    public function atualizarFormaPagamento(Request $request) {
        $request->validate([
            'forma_pagamento' => 'required|string|in:dinheiro,cartao_credito,cartao_debito,pix',
            'id' => 'required|integer|exists:vendas,id'
        ], [
            'forma_pagamento.required' => 'A forma de pagamento é obrigatória.',
            'forma_pagamento.in' => 'Forma de pagamento inválida. Opções válidas: dinheiro, cartao_credito, cartao_debito, pix.'
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

            $novaForma = $request->input('forma_pagamento');
            $venda->update(['forma_pagamento' => $novaForma]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Forma de pagamento atualizada para ' . ucfirst($novaForma)
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar forma de pagamento: ' . $e->getMessage()
            ], 422);
        }
    }

    public function atualizarCPFCliente($request) {
        $request->validate([
            'cpf_cliente' => 'nullable|string|size:11',
            'id' => 'required|integer|exists:vendas,id'
        ], [
            'cpf_cliente.size' => 'O CPF deve ter exatamente 11 dígitos (apenas números).'
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

            $cpfCliente = $request->input('cpf_cliente');
            $venda->update(['cpf_cliente' => $cpfCliente]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'CPF do cliente atualizado com sucesso'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar CPF do cliente: ' . $e->getMessage()
            ], 422);
        }
    }

    private function imprimeCupom() {
        // Integração com hardware (se aplicável)
        return app('App\Http\Controllers\Ponk\HardwareController')->imprimeCupomFiscal();
    }
}
