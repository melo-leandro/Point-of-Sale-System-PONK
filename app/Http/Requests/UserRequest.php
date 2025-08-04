<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'nome' => [
                'required',
                'string',
                'max:255'
            ],
            'cpf' => [
                'required',
                'string',
                'size:11',
                'unique:users',
                function ($attribute, $value, $fail) {
                    if (!$this->validarCPF($value)) {
                        $fail('O CPF informado é inválido.');
                    }
                }
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users',
                function ($attribute, $value, $fail) {
                    if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                        $fail('O e-mail informado é inválido.');
                    }
                }
            ],
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed'
            ],
            'pin' => [
                'nullable',
                'string',
                'size:4'
            ]
        ];
    }

    private function validarCPF($cpf)
    {
        $cpf = preg_replace('/[^0-9]/', '', $cpf);
        
        if (preg_match('/(\d)\1{10}/', $cpf)) {
            return false;
        }
        
        for ($t = 9; $t < 11; $t++) {
            for ($d = 0, $c = 0; $c < $t; $c++) {
                $d += $cpf[$c] * (($t + 1) - $c);
            }
            $d = ((10 * $d) % 11) % 10;
            if ($cpf[$c] != $d) {
                return false;
            }
        }
        
        return true;
    }
}