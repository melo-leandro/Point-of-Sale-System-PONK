<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'CPF' => $this->generateValidCPF(),
            'nome' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => static::$password ??= Hash::make('password123'), // Senha padrão alterada
            'pin' => rand(0, 1) ? sprintf('%04d', rand(0, 9999)) : null, // 50% chance de ter PIN
            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    /**
     * Generate a valid Brazilian CPF for testing.
     */
    protected function generateValidCPF(): string
    {
        $cpf = rand(100000000, 999999999); // Gera os 9 primeiros dígitos
        $cpf = strval($cpf);
        
        // Calcula os dígitos verificadores
        for ($t = 9; $t < 11; $t++) {
            $d = 0;
            for ($c = 0; $c < $t; $c++) {
                $d += $cpf[$c] * (($t + 1) - $c);
            }
            $d = ((10 * $d) % 11) % 10;
            $cpf .= $d;
        }
        
        return $cpf;
    }

    /**
     * Indicate that the user should have a PIN.
     */
    public function withPin(): static
    {
        return $this->state(fn (array $attributes) => [
            'pin' => sprintf('%04d', rand(0, 9999))
        ]);
    }

    /**
     * Indicate that the user should not have a PIN.
     */
    public function withoutPin(): static
    {
        return $this->state(fn (array $attributes) => [
            'pin' => null,
        ]);
    }
}