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
        Schema::create('itens_venda', function (Blueprint $table) {
            $table->id('id_item');
            $table->timestamps();

            $table->decimal('qtde', 10, 2)->default(0);
            
            $table->string('id_produto');
            $table->foreign('id_produto')->references('codigo')->on('produtos')->onUpdate('cascade');
            
            $table->foreignId('venda_id')->constrained('vendas')->onUpdate('cascade')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('itens_venda');
    }
};
