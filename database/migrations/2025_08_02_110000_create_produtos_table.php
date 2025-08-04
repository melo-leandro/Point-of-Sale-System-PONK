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
        Schema::create('produtos', function (Blueprint $table) {
            $table->char('codigo', 13)->comment('Código no Padrão EAN-13')->primary();
            $table->timestamps();
            $table->string('nome');
            $table->enum('unidade', ['UN', 'KG'])->default('UN');
            $table->decimal('valor_unitario', 10, 2)->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produtos');
    }
};
