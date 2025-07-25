<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Criar usuário admin padrão
        User::create([
            'name' => 'Administrador',
            'email' => 'admin@ponk.com',
            'password' => Hash::make('123456'),
        ]);

        // Criar usuário de teste
        User::create([
            'name' => 'Usuario Teste',
            'email' => 'usuario@ponk.com',
            'password' => Hash::make('123456'),
        ]);
    }
}
