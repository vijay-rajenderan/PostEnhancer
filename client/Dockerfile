FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

# Vite default port is 5173, we need to expose it to the network
CMD ["npm", "run", "dev", "--", "--host"]
