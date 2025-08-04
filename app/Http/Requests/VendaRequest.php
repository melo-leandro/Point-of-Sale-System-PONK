<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Caixa;

class VendaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'cpf_cliente' => [
                'nullable',
                'string',
                'size:11',
                function ($attribute, $value, $fail) {
                    if (!$this->validarCPF($value)) {
                        $fail('O CPF informado é inválido.');
                    }
                }
            ],
            'forma_pagamento' => [
                'required',
                'string',
                'in:dinheiro,cartao_credito,cartao_debito,pix'
            ],
            'valor_total' => [
                'required',
                'numeric',
                'min:0'
            ],
            'caixa_id' => [
                'required',
                'integer',
                'exists:caixas,numeracao',
                function ($attribute, $value, $fail) {
                    $caixa = Caixa::where('numeracao', $value)->first();
                    
                    if (!$caixa->esta_aberto) {
                        $fail('O caixa selecionado está fechado');
                    }
                    
                    if ($caixa->user_id !== auth()->id()) {
                        $fail('Este caixa está atribuído a outro usuário');
                    }
                }
            ],
            'usuario_id' => [
                'required',
                'exists:users,id',
                function ($attribute, $value, $fail) {
                    if ($value !== auth()->id()) {
                        $fail('O usuário selecionado deve ser o usuário autenticado.');
                    }
                }
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
