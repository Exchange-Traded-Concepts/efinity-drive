FROM node:16-alpine3.12

WORKDIR /app

COPY package*.json .

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


#if you add a new a package.
#npm i moment --save =>this will add it ro package.json anf local nodemodule
#after that you need to do : docker-compose build app
#for the changes to be in the container app
#PS: this process is only if you add a new package, adding features or code chnages should be fine.

