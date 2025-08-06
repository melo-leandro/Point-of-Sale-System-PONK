# Ponk - Point of Sale System
**_Trabalho feito para a Disciplina Modelagem de Sistemas na UFJF, semestre 2025.1_**


## Equipe
Caio Nascimento Reis da Silva – 202335004
Cauã Moreno Lopes Castro – 202335019
Estêvão Barbosa Fiorilo da Rocha – 202335030
João Pedro Ferreira Srbek - 202335034
Leandro Carlos de Melo Filho – 202335013

## Documento de Requisitos com diagramas
Link: https://docs.google.com/document/d/1RUX3vCUBMlPscSnEYFjlK9HSmPr1vptSqkfNyd7X8EY/edit?usp=sharing

## Como compilar
Para compilar o código, é necessário possuir npm e composer instalados. Com estes prontos, basta seguir o passo-a-passo:

1. Executar composer install
2. Executar npm install
3. Agora com as dependências corretas, copie e cole o .env.example. Renomeie a cópia para apenas .env
4. Remova todas as linhas comentadas
5. Troque a linha DB_PASSWORD = para DB_PASSWORD = Ponk2025Fabricio
6. Execute php artisan key:generate
7. Execute php artisan migrate

**Pronto!** Agora sempre que quiser executar, basta rodar, em duas janelas de terminal, "php artisan serve" e "npm run dev"! O app ira rodar no localhost:8000
