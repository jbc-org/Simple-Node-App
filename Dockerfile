FROM node:alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5000

ENV EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=ec2-54-160-145-160.compute-1.amazonaws.com

CMD [ "node", "app.js" ]