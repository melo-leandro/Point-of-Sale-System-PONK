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
        DB::statement("CREATE TYPE forma_pagamento_tipo AS ENUM (
            'dinheiro', 
            'cartao_credito', 
            'cartao_debito', 
            'pix'
        )");

        Schema::create('vendas', function (Blueprint $table) {
            $table->id()->comment('Identificador único da venda');
            $table->timestamps();

            $table->unsignedDecimal('valor_total', 10, 2)->default(0);
            $table->addColumn('forma_pagamento_tipo', 'forma_pagamento')->comment('Forma de pagamento utilizada');

            $table->char('cpf_cliente', 11)->nullable()->comment('CPF sem formatação');
            $table->char('CPF_operador', 11)->comment('CPF sem formatação');

            $table->foreign('cpf_operador')->references('cpf')->on('usuarios')->onUpdate('cascade')->onDelete('restrict');
            $table->foreignId('caixa_id')->constrained('caixas')->onUpdate('cascade')->onDelete('restrict');

        });

        DB::statement("ALTER TABLE vendas 
            ADD CONSTRAINT cpf_cliente_valido_check 
            CHECK (cpf_cliente IS NULL OR cpf_cliente ~ '^[0-9]{11}$')
        ");
        
        DB::statement("ALTER TABLE vendas 
            ADD CONSTRAINT cpf_operador_valido_check 
            CHECK (cpf_operador ~ '^[0-9]{11}$')
        ");
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendas');
    }
};
