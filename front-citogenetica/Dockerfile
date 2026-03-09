# ---- Estágio 1: Build ----
# Usa uma versão específica do Node.js para builds consistentes.
FROM node:18.20.3-alpine AS builder

# Define o diretório de trabalho.
WORKDIR /app

ARG VITE_APP_API_URL
ENV VITE_APP_API_URL=${VITE_APP_API_URL}

# Copia apenas os arquivos de dependência para aproveitar o cache do Docker.
# A instalação só será refeita se estes arquivos mudarem.
COPY package.json package-lock.json ./

# Instala as dependências.
RUN npm install

# Copia o restante dos arquivos da aplicação.
# Use um arquivo .dockerignore para evitar copiar arquivos desnecessários.
COPY . .

# Executa o build da aplicação.
RUN npm run build


# ---- Estágio 2: Produção ----
# Usa uma imagem leve e estável do Nginx.
FROM nginx:1.27-alpine-slim


# Remove a configuração padrão do Nginx.
RUN rm /etc/nginx/conf.d/default.conf

# Copia a configuração personalizada do Nginx.
# É crucial ter um arquivo de configuração para SPAs (Single Page Applications).
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos estáticos gerados no estágio de build.
COPY --from=builder /app/dist /usr/share/nginx/html

# Define o usuário não-root como proprietário dos arquivos e pastas do Nginx.
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && chown -R nginx:nginx /var/run/nginx.pid

# Muda para o usuário não-root.
USER nginx

# Expõe a porta 80.
EXPOSE 80

# Inicia o Nginx em modo "foreground".
CMD ["nginx", "-g", "daemon off;"]
