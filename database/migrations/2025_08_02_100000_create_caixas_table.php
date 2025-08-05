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
        Schema::create('caixas', function (Blueprint $table) {
            $table->id('numeracao');
            $table->timestamps();
            $table->timestamp('aberto_em')->nullable()->comment('Data e hora em que o caixa foi aberto');
            $table->boolean('aberto')->default(true);
            $table->decimal('saldo_inicial', 10, 2)->default(0);
            $table->foreignId('user_id')->constrained('users')->onUpdate('cascade')->onDelete('restrict')->comment('ID do usuário associado ao caixa');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('caixas');
    }
};
