<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\ItemVenda;

class CaixaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'aberto' => [
                'required',
                'boolean'
            ],
            
            'saldo_inicial' => [
                'required',
                'decimal:10,2',
                'min:0'
            ],

            'status_alterado_em' => [
                'nullable',
                'date'
            ],

            'user_id' => [
                'required',
                'exists:users,id'
            ]
        ];
    }
}
