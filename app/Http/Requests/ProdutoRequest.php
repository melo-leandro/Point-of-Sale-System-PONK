<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\ItemVenda;

class Request extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'codigo'=>[
                'required',
                'string',
                'size:13',
                function ($attribute, $value, $fail) {
                    if (!preg_match('/^[0-9]{13}$/', $value)) {
                        $fail('O código do produto deve conter exatamente 13 dígitos numéricos.');
                    }
                }
            ],

            'nome'=>[
                'required',
                'string',
                'max:255'
            ],
            
            'unidade'=>[
                'required',
                'string',
                'in:UN,KG'
            ],

            'valor_unitario'=>[
                'required',
                'decimal:10,2',
                'min:0' 
            ]
        ];
    }
}
