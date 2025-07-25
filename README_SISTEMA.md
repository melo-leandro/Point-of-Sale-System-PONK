# Point-of-Sale-System-PONK

Sistema de Ponto de Venda com interface moderna e intuitiva desenvolvido em Laravel.

## 🚀 Funcionalidades

### ✅ Sistema Implementado
- **Tela de login** - Autenticação segura
- **Menu principal** - Interface com dois módulos principais
- **Ponto de Venda (F1)** - Módulo de vendas
- **Status do Caixa (F2)** - Relatórios e status
- **Atalhos de teclado** - Navegação rápida
- **Logout (F12)** - Saída segura do sistema

## 🛠️ Instalação e Configuração

### Pré-requisitos
- PHP 8.2+
- Composer

### Passos para execução

1. **Clone o repositório**
2. **Instale as dependências:**
   ```bash
   composer install
   ```

3. **Execute as migrations:**
   ```bash
   php artisan migrate
   ```

4. **Crie usuário de teste:**
   ```bash
   php artisan db:seed
   ```

5. **Inicie o servidor:**
   ```bash
   php artisan serve
   ```

6. **Acesse o sistema:**
   - URL: `http://localhost:8000`

## 👤 Usuário de Teste

Para fazer login use:
- **Email:** `teste@teste.com`
- **Senha:** `123456`

## 🎯 Fluxo do Sistema

1. **Login** - Autenticação obrigatória
2. **Menu Principal** - Dois módulos disponíveis:
   - **Ponto de Venda (F1)** - Sistema de vendas
   - **Status do Caixa (F2)** - Relatórios financeiros
3. **Navegação** - Via clique ou teclas de atalho
4. **Logout (F12)** - Retorna ao login

## ⌨️ Atalhos de Teclado

- **F1** - Acessar Ponto de Venda
- **F2** - Acessar Status do Caixa  
- **F12** - Fazer logout

## 🎨 Interface

### Login
- Design elegante com gradiente
- Validação em tempo real
- Mensagens de erro/sucesso

### Menu Principal
- Fundo com padrão diagonal
- Cards interativos com hover effects
- Logo Ponk no canto superior esquerdo
- Botão de saída no canto superior direito
- Design responsivo para mobile

## 🔐 Segurança

- Autenticação Laravel nativa
- Proteção de rotas
- Sessões seguras
- Proteção CSRF
- Logout automático

## 📱 Responsividade

- Funciona em desktop, tablet e mobile
- Layout adaptativo
- Touch-friendly para dispositivos móveis
