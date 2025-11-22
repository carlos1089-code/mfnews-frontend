# Usamos Node para construir
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Exponemos el puerto de Vite (normalmente 5173)
EXPOSE 5173

# Importante: --host permite que Docker exponga la IP
CMD ["npm", "run", "dev", "--", "--host"]