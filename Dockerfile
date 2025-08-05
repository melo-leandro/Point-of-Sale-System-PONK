FROM php:8.2-fpm

# Instala dependências do sistema
RUN apt-get update && apt-get install -y \
    git \
    curl \
    unzip \
    zip \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    libzip-dev \
    npm \
    nodejs \
    && docker-php-ext-install pdo pdo_pgsql zip

# Instala o Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Define o diretório de trabalho
WORKDIR /var/www

# Copia os arquivos para dentro do container
COPY . .

# Instala dependências do PHP
RUN composer install --no-dev --optimize-autoloader

# Instala dependências do Node e compila assets
RUN npm install && npm run build

# Gera a chave da aplicação (você pode fazer isso no Render se quiser também)
RUN php artisan key:generate

# Define a porta usada
EXPOSE 8000

# Comando para iniciar o servidor
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
