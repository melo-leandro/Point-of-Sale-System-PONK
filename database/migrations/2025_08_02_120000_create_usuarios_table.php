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
        Schema::create('usuarios', function (Blueprint $table) {
            $table->string('CPF', 11)->comment('CPF sem formatação')->primary();
            $table->timestamps();
            $table->string('nome');
            $table->string('email')->unique();
            $table->string('senha');


            $table->unique('pin')->whereNotNull('pin');

            $table->string('pin', 4)->charset('ascii')->comment('PIN de 4 dígitos para autenticação de gerente e ascii para melhorar performance')->nullable();
            $table->rememberToken();
        });

        DB::statement("ALTER TABLE sua_tabela 
            ADD CONSTRAINT pin_valido_check 
            CHECK (pin IS NULL OR (pin ~ '^[0-9]{4}$' AND LENGTH(pin) = 4));"
        );

        Schema::create('senha_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->timestamps();
            $table->string('token');
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuarios');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
