<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model; 
class Venda extends Model
{
    use HasFactory;

    protected $fillable = [
        'cpf_cliente',
        'forma_pagamento',
        'valor_total',
        'status',
        'caixa_id',
        'usuario_id'
    ];

    protected $hidden = [];

    protected function casts(): array
    {
        return [
            'valor_total' => 'decimal:2'
        ];
    }
    
    // essa função não é da venda, é do caixa (nao faz sentido cada venda ter um saldo inicial) eu acho
    public function setSaldoInicialAttribute($value)
    {
        if (!is_numeric($value)) {
            throw ValidationException::withMessages([
                'valor_total' => 'O saldo inicial deve ser um número.'
            ]);
        }

        if($value < 0) {
            throw ValidationException::withMessages([
                'valor_total' => 'O saldo inicial não pode ser negativo.'
            ]);
        }

        $this->attributes['valor_total'] = $value;
    }

    public function setStatusAttribute($value)
    {
        $validStatuses = ['pendente', 'finalizada', 'cancelada'];
        if (!in_array($value, $validStatuses)) {
            throw ValidationException::withMessages([
                'status' => 'Status inválido. Deve ser um dos seguintes: ' . implode(', ', $validStatuses)
            ]);
        }

        $this->attributes['status'] = $value;
    }

    public function itens()
    {
        return $this->hasMany(ItemVenda::class, 'venda_id', 'id');
    }
}
