# 1. Usamos Node 20
FROM node:20-alpine

# 2. Carpeta de trabajo
WORKDIR /app

# 3. Dependencias
COPY package*.json ./
RUN npm install

# 4. Copiamos el código
COPY . .

# 5. Exponemos el puerto de Vite (5173)
EXPOSE 5173

# 6. Arrancamos Vite exponiendo la IP (necesario para Docker)
CMD ["npm", "run", "dev", "--", "--host"]