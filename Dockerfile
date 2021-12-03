FROM node:16-alpine3.12

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
COPY .env.example .env

# EXPOSE 3333

CMD ["npm", "run","dev"]
# STARTING THE APP
# docker-compose up -d
# docker-compose exec app node ace migration:run

# STOPING THE APP
# docker-compose down

#STOPING AND REMOVING THE EVERUTHING
# dokcer-compose down -v

