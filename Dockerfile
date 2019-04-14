FROM node:alpine

WORKDIR /server

# RUN apk add curl

COPY ./package.json /server/

RUN yarn install --prod=false

COPY . /server/

CMD ["yarn", "start"]
