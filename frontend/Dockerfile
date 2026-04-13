FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Use Vite build and preview or just dev for now
CMD ["npm", "run", "dev", "--", "--host"]
