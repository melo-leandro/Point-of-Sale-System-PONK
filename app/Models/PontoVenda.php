<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class PontoVenda extends Model
{
    use HasFactory;

    protected $fillable = [
        'cpf_cliente',
        'forma_pagamento',
        'valor_total',
    ];

    protected $hidden = [];

    protected function casts(): array
    {
        return [
            'saldo_inicial' => 'decimal:2'
        ];
    }
    
    public function setSaldoInicialAttribute($value)
    {
        if (!is_numeric($value)) {
            throw ValidationException::withMessages([
                'saldo_inicial' => 'O saldo inicial deve ser um número.'
            ]);
        }

        if($value < 0) {
            throw ValidationException::withMessages([
                'saldo_inicial' => 'O saldo inicial não pode ser negativo.'
            ]);
        }

        $this->attributes['saldo_inicial'] = $value;
    }

    public function vendas()
    {
        return $this->hasMany(Venda::class);
    }
    
}
