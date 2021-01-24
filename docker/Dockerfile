FROM node:fermium-alpine as frontend

ENV NODE_PATH=/node_modules
ENV PATH="${PATH}:/node_modules/.bin"
RUN mkdir ${NODE_PATH}

COPY yarn.lock \
  package.json \
  /app/

WORKDIR /app

RUN NODE_ENV=development yarn install --network-timeout 1000000 --modules-folder $NODE_PATH

COPY . /app/

CMD ["yarn", "start", "--prefix", "/app"]