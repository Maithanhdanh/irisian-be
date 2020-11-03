FROM node:12

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./
COPY .env ./.env

RUN npm install

COPY . .

EXPOSE 5000

CMD [ "node","app.js" ]
