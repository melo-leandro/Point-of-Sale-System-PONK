# Point-of-Sale-System-PONK

Sistema minimalista com apenas tela de login desenvolvido em Laravel.

## 🚀 Funcionalidades

### ✅ Sistema Simples
- **Apenas tela de login** - Interface única e limpa
- Validação de campos de entrada
- Design responsivo e moderno
- Mensagens de feedback ao usuário

## 🛠️ Instalação e Configuração

### Pré-requisitos
- PHP 8.2+
- Composer

### Passos para execução

1. **Clone o repositório** (se ainda não foi feito)
2. **Instale as dependências:**
   ```bash
   composer install
   ```

3. **Inicie o servidor:**
   ```bash
   php artisan serve
   ```

4. **Acesse o sistema:**
   - URL: `http://localhost:8000`
   - A página inicial redirecionará automaticamente para o login

## � Estrutura Simplificada

```
├── app/Http/Controllers/
│   └── AuthController.php          # Controller de login
├── resources/views/
│   └── auth/
│       └── login.blade.php         # Tela de login única
└── routes/
    └── web.php                     # Rotas simples
```

## 🎨 Interface

- Design responsivo com Bootstrap 5
- Tema moderno com gradientes azul/roxo
- Interface minimalista e elegante
- Validação visual de campos
- Mensagens de sucesso e erro

## 🔧 Funcionalidade

- **Página inicial:** Redireciona automaticamente para `/login`
- **Tela de login:** Formulário com validação de email e senha
- **Validação:** Campos obrigatórios com feedback visual
- **Responsividade:** Funciona em desktop, tablet e mobile

## 📝 Características Técnicas

- Framework Laravel 12.x
- Bootstrap 5.3.0 para UI
- Bootstrap Icons para ícones
- Validação server-side com Laravel Validator
- Proteção CSRF nos formulários
- Design mobile-first
