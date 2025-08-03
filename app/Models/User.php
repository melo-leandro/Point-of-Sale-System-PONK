<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'cpf',
        'name',
        'email',
        'password',
        'pin'
    ];

    protected $hidden = [
        'cpf',
        'password',
        'remember_token',
        'pin'
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'pin' => 'encrypted',
        ];
    }
    
    public function setCpfAttribute($value)
    {
        $cleaned = preg_replace('/[^0-9]/', '', $value);
        
        if (strlen($cleaned) !== 11) {
            throw ValidationException::withMessages([
                'cpf' => __('CPF deve conter exatamente 11 dígitos')
            ]);
        }
        
        $this->attributes['cpf'] = $cleaned;
    }

    public function getCpfFormatadoAttribute()
    {
        if (empty($this->cpf)) return null;
        
        return substr($this->cpf, 0, 3) . '.' . 
               substr($this->cpf, 3, 3) . '.' . 
               substr($this->cpf, 6, 3) . '-' . 
               substr($this->cpf, 9, 2);
    }        
}
