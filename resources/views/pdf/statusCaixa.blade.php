<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Status do Caixa</title>
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
        }
        th, td {
            border: 1px solid #444;
            padding: 4px;
            text-align: center;
        }
    </style>
</head>
<body>
    <h1>Status do Caixa - Terminal {{ $caixa_numeracao }}</h1>
    <p>Status: {{ $aberto ? 'ABERTO' : 'FECHADO' }}</p>
    <p>Última atualização: {{ \Carbon\Carbon::parse($statusAlteradoData)->format('d/m/Y H:i') }}</p>

    <table>
        <thead>
            <tr>
                <th>Data e Hora</th>
                <th>Dinheiro</th>
                <th>Crédito</th>
                <th>Débito</th>
                <th>Pix</th>
                <th>Total</th>
                <th>N° Venda</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($vendas as $venda)
                <tr>
                    <td>{{ \Carbon\Carbon::parse($venda->created_at)->format('d/m/Y H:i') }}</td>
                    <td>{{ $venda->forma_pagamento === 'dinheiro' ? 'Sim' : 'Não' }}</td>
                    <td>{{ $venda->forma_pagamento === 'cartao_credito' ? 'Sim' : 'Não' }}</td>
                    <td>{{ $venda->forma_pagamento === 'cartao_debito' ? 'Sim' : 'Não' }}</td>
                    <td>{{ $venda->forma_pagamento === 'pix' ? 'Sim' : 'Não' }}</td>
                    <td>{{ number_format($venda->valor_total, 2, ',', '.') }}</td>
                    <td>{{ $venda->id }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
