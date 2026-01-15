FROM node:25.3.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

EXPOSE 5173

CMD [ "npm", "run", "dev" ]
