<?php

namespace App\Http\Controllers;

use App\Http\Requests\CaixaRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Caixa;

class HardwareController extends Controller {
    public function abrirGavetaDoCaixa() {
        // Lógica para abrir a gaveta do caixa caso houvesse um hardware integrado ao nosso software
        // Que existiria se fosse vendido a um mercado real
        
        return response()->json(['message' => 'Gaveta do caixa aberta com sucesso!']);
    }

    public function imprimeCupomFiscal() {

        // Lógica para imprimir cupom fiscal caso houvesse um hardware integrado ao nosso software
        // Que existiria se fosse vendido a um mercado real

        return response()->json(['message' => 'Cupom fiscal impresso com sucesso!']);
    }
}