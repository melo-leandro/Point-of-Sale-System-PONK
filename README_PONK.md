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
**_(não use bash se vc for alguem normal. so usa o terminal normal. Se você usa Windows você nao é normal. Abraços)_**

1. **Clone o repositório** (se ainda não foi feito)
2. **Instale as dependências:**
   ```bash
   composer install
   ```

3. **Crie uma key e ajuste o env**
   Renomeie o .env.example para .env
   Remova o comentário da linhas do .env
   php artisan key:generate

4. **Inicie o servidor:** (Sempre que precisar depois da primeira execução)
   ```bash
   php artisan serve
   ```

5. **Acesse o sistema:**
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
