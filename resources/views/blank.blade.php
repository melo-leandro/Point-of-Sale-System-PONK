<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PONK - Point of Sale System</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: white;
            font-family: Arial, sans-serif;
        }
        .logout-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
        }
        .logout-btn:hover {
            background: #c82333;
        }
    </style>
</head>
<body>
    <!-- Página em branco -->
    
    <!-- Botão de logout opcional (discreto) -->
    <form method="POST" action="{{ route('logout') }}" style="display: inline;">
        @csrf
        <button type="submit" class="logout-btn">Sair</button>
    </form>
</body>
</html>
