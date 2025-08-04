<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Validation\ValidationException;

class ItemVenda extends Model
{
    use HasFactory;
    
    protected $table = 'itens_venda';
    
    protected $fillable = [
        'qtde',
        'produto_id',
        'venda_id'
    ];

    protected function casts(): array
    {
        return [
            'qtde' => 'decimal:3',
        ];
    }
    
    protected $hidden = [];
    
    public function setQtdeAttribute($value)
    {
        if(!is_numeric($value)) {
            throw ValidationException::withMessages([
                'qtde' => 'A quantidade deve ser um número.'
            ]);
        }

        if($value < 0) {
            throw ValidationException::withMessages([
                'qtde' => 'A quantidade não pode ser negativa.'
            ]);
        }

        if ($this->produto_id && $this->produto) {
            if ($this->produto->unidade === 'UN' && fmod($value, 1) !== 0.0) {
                throw ValidationException::withMessages([
                    'qtde' => 'Para produtos com unidade "UN", a quantidade deve ser um número inteiro.'
                ]);
            }

            $this->attributes['qtde'] = $value;
        }
    }

    public function produto()
    {
        return $this->belongsTo(Produto::class, 'produto_id', 'codigo');
    }

    public function venda()
    {
        return $this->belongsTo(Venda::class, 'venda_id', 'id');
    }

}
