<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Produto;
use App\Models\Venda;
use App\Models\ItemVenda;
use App\Models\User;
use App\Models\Caixa;

class TestDataSeeder extends Seeder
{
    public function run()
    {
        // Criar produto de teste
        $produto = Produto::firstOrCreate(
            ['codigo' => '1234567890123'],
            [
                'nome' => 'Produto Teste',
                'valor_unitario' => 10.50,
                'unidade' => 'UN'
            ]
        );

        echo "Produto criado: {$produto->codigo} - {$produto->nome}\n";

        // Verificar se existe usuário
        $user = User::first();
        if (!$user) {
            echo "Nenhum usuário encontrado!\n";
            return;
        }

        // Verificar se existe caixa
        $caixa = Caixa::where('user_id', $user->id)->first();
        if (!$caixa) {
            echo "Nenhum caixa encontrado para o usuário!\n";
            return;
        }

        // Criar venda de teste
        $venda = Venda::create([
            'cpf_cliente' => null,
            'forma_pagamento' => 'dinheiro',
            'valor_total' => 0,
            'status' => 'pendente',
            'caixa_id' => $caixa->numeracao,
            'usuario_id' => $user->id
        ]);

        echo "Venda criada: ID {$venda->id}\n";

        // Tentar criar item
        try {
            $item = ItemVenda::create([
                'produto_id' => $produto->codigo,
                'qtde' => 2,
                'venda_id' => $venda->id
            ]);
            echo "Item criado com sucesso: ID {$item->id_item}\n";
        } catch (\Exception $e) {
            echo "Erro ao criar item: " . $e->getMessage() . "\n";
        }
    }
}
