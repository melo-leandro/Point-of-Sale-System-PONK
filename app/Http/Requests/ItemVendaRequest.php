<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\ItemVenda;

class ItemVendaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'qtd' => [
                'required',
                'numeric',
                'min:0.001',
                function ($attribute, $value, $fail) {
                    $produto = Produto::where('codigo', $this->produto_id)->first();
                    if (!$produto) {
                        $fail('Produto não encontrado.');
                        return;
                    }

                    if ($produto->unidade === 'UN' && fmod($value, 1) !== 0.0) {
                        $fail('Para produtos unitários, a quantidade deve ser inteira');
                    }
                }
            ],
            'venda_id' => [
                'required',
                'numeric',
                'exists:vendas,id'
            ],
            'produto_id' => [
                'required',
                'string',
                'exists:produtos,codigo'
            ]
        ];
    }
}
