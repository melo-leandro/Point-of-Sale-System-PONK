<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        Schema::create('vendas', function (Blueprint $table) {
            $table->id()->comment('Identificador único da venda');
            
            $table->timestamps();

            $table->decimal('valor_total', 10, 2)->default(0);

            $table->char('cpf_cliente', 11)->nullable()->comment('CPF sem formatação');

            $table->enum('status', ['pendente', 'finalizada', 'cancelada'])->default('pendente');

            $table->foreignId('usuario_id')->constrained('users')->onUpdate('cascade')->onDelete('restrict');

            $table->integer('caixa_id');
            $table->foreign('caixa_id')->references('numeracao')->on('caixas')->onUpdate('cascade')->onDelete('restrict');

            $table->enum('forma_pagamento', ['dinheiro', 'cartao_credito', 'cartao_debito', 'pix'])->default('dinheiro');

        });

        DB::statement("ALTER TABLE vendas 
            ADD CONSTRAINT cpf_cliente_valido_check 
            CHECK (cpf_cliente IS NULL OR cpf_cliente ~ '^[0-9]{11}$')
        ");
        
    }
    public function down(): void
    {
        Schema::dropIfExists('vendas');
    }
};
