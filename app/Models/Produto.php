<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Validation\ValidationException;

class Produto extends Model
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory;

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'codigo';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'codigo',
        'nome',
        'unidade',
        'valor_unitario'
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'valor_unitario' => 'decimal:2',
        ];
    }
    
    

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    
    public function setCodigoAttribute($value)
    {
        if (!is_numeric($value) && !preg_match('/^\d+$/', $value)) {
            throw ValidationException::withMessages([
                'codigo' => 'O código deve conter apenas números.'
            ]);
        }

        $cleaner = preg_replace('/[^0-9]/', '', $value); 

        if(strlen($cleaner) !== 13){
            throw ValidationException::withMessages([
                'codigo' => ('O código do produto deve conter exatamente 13 dígitos numéricos.')
            ]);
        }

        $this->attributes['codigo'] = $cleaner;
    }
}
