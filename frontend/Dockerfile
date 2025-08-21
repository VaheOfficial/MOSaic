FROM node:20-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm install --no-audit --prefer-offline
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
