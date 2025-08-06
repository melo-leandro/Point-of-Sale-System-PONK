<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model; 
use Illuminate\Validation\ValidationException;
class Venda extends Model
{
    use HasFactory;
    
    protected $primaryKey = 'id';

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

    public function setCpf_clienteAttribute($value)
    {
        // Se o valor for null ou vazio, permite (venda sem CPF)
        if ($value === null || $value === '') {
            $this->attributes['cpf_cliente'] = $value;
            return;
        }

        $valido = true;
        $cpf = preg_replace('/[^0-9]/', '', $value);

        // Verifica se tem 11 dígitos
        if (strlen($cpf) !== 11) {
            $valido = false;
        }

        // Verifica se não são todos dígitos iguais
        if (preg_match('/(\d)\1{10}/', $cpf)) {
            $valido = false;
        }
        
        // Validação dos dígitos verificadores
        if ($valido) {
            for ($t = 9; $t < 11; $t++) {
                for ($d = 0, $c = 0; $c < $t; $c++) {
                    $d += $cpf[$c] * (($t + 1) - $c);
                }
                $d = ((10 * $d) % 11) % 10;
                if ($cpf[$c] != $d) {
                    $valido = false;
                    break;
                }
            }
        }

        if (!$valido) {
            throw ValidationException::withMessages([
                'cpf_cliente' => 'O CPF é inválido.'
            ]);
        }

        $this->attributes['cpf_cliente'] = $value;
    }

    public function itens()
    {
        return $this->hasMany(ItemVenda::class, 'venda_id', 'id');
    }

    public function caixa()
    {
        return $this->belongsTo(Caixa::class, 'caixa_id', 'numeracao');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id', 'id');
    }
}
