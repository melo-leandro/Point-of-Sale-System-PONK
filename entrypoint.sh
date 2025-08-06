#!/bin/bash

# Aguarda o banco estar disponível (opcional — útil pra evitar erro de conexão imediata)
echo "Aguardando banco de dados..."
sleep 5

# Roda as migrações
php artisan migrate --force

# Inicia o servidor Laravel
php artisan serve --host=0.0.0.0 --port=8000
