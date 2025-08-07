<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Criar usuário administrador se não existir
        User::firstOrCreate(
            ['email' => 'admin@ponk.com'],
            [
                'name' => 'Administrador',
                'cpf' => '12345678901',
                'password' => Hash::make('admin123'),
                'admin' => true,
            ]
        );
    }
}
