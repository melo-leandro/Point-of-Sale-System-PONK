FROM php:8.2-fpm

# Instala dependências do sistema e Node.js 18
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
    gnupg \
    ca-certificates \
    && docker-php-ext-install pdo pdo_pgsql zip \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Instala Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Define diretório de trabalho
WORKDIR /var/www

# Copia o projeto para dentro do container
COPY . .

# Instala dependências do PHP
RUN composer install --no-dev --optimize-autoloader

# Instala dependências do Node e compila frontend
RUN npm install && npm run build

# Permissões necessárias
RUN chown -R www-data:www-data storage bootstrap/cache

# Expõe a porta
EXPOSE 8000

# Torna o script executável
RUN chmod +x /var/www/entrypoint.sh

# Executa o entrypoint
CMD ["./entrypoint.sh"]
