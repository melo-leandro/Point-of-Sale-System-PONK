<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Validation\ValidationException;

class Produto extends Model
{
    use HasFactory;

    protected $primaryKey = 'codigo';

    public $incrementing = false;

    protected $fillable = [
        'codigo',
        'nome',
        'unidade',
        'valor_unitario'
    ];

    protected function casts(): array
    {
        return [
            'valor_unitario' => 'decimal:2',
        ];
    }

    protected $hidden = [];
    
    public function setCodigoAttribute($value)
    {
        if (!preg_match('/^\d{13}$/', $value)) {
            throw ValidationException::withMessages([
                'valor_unitario' => 'O código deve ter exatamente 13 dígitos numéricos.'
            ]);
        }
        $this->attributes['codigo'] = $value;
    }

    public function setValorUnitarioAttribute($value)
    {
        if (!is_numeric($value)) {
            throw ValidationException::withMessages([
                'valor_unitario' => 'O valor unitário deve ser um número.'
            ]);
        }

        if($value < 0) {
            throw ValidationException::withMessages([
                'valor_unitario' => 'O valor unitário não pode ser negativo.'
            ]);
        }
        $this->attributes['valor_unitario'] = $value;
    }

    public function setUnidadeAttribute($value)
    {
        if (!in_array($value, ['UN', 'KG'])) {
            throw ValidationException::withMessages([
                'unidade' => 'A unidade deve ser "UN" ou "KG".'
            ]);
        }
        $this->attributes['unidade'] = $value;
    }
}
