FROM node:alpine

WORKDIR /server

RUN apk update && apk add gcc \
                          python3 \
                          py-pip \
                          py3-pillow

RUN apk add make automake g++ subversion python3-dev

RUN pip3 install numpy glob3

COPY ./package.json /server/

RUN yarn install --prod=false

COPY . /server/

CMD ["yarn", "start"]
