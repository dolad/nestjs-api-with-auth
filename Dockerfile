FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 8080

RUN npm run build

CMD ["npm", "run", "start:prod"]