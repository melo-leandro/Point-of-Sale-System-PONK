<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Caixa extends Model
{
    use HasFactory;

    protected $fillable = [
        'aberto',
        'saldo_inicial',
        'user_id',
        'aberto_em'
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

        if(!$this->aberto) {
            throw ValidationException::withMessages([
                'saldo_inicial' => 'Não é possível definir o saldo inicial quando o caixa está fechado.'
            ]);
        }

        $this->attributes['saldo_inicial'] = $value;
    }

    public function vendas()
    {
        return $this->hasMany(Venda::class);
    }
    
}
