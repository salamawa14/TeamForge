FROM php:8.4-apache
RUN docker-php-ext-install pdo pdo_mysql
RUN a2enmod rewrite headers
COPY apache.conf /etc/apache2/conf-available/allow-access.conf
RUN a2enconf allow-access
WORKDIR /var/www/html
