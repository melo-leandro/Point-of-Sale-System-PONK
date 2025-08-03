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
        // DB::statement("CREATE TYPE forma_pagamento_tipo AS ENUM (
        //     'dinheiro', 
        //     'cartao_credito', 
        //     'cartao_debito', 
        //     'pix'
        // )");

        Schema::create('vendas', function (Blueprint $table) {
            $table->id()->comment('Identificador único da venda');
            $table->timestamps();

            $table->decimal('valor_total', 10, 2)->default(0);

            $table->char('cpf_cliente', 11)->nullable()->comment('CPF sem formatação');

            $table->foreignId('usuario_id')->constrained('users')->onUpdate('cascade')->onDelete('restrict');

            $table->integer('caixa_id');
            $table->foreign('caixa_id')->references('numeracao')->on('caixas')->onUpdate('cascade')->onDelete('restrict');

        });

        DB::statement("ALTER TABLE vendas
            ADD COLUMN forma_pagamento forma_pagamento_tipo");


        DB::statement("ALTER TABLE vendas 
            ADD CONSTRAINT cpf_cliente_valido_check 
            CHECK (cpf_cliente IS NULL OR cpf_cliente ~ '^[0-9]{11}$')
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
