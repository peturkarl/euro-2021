FROM node:14.11-buster-slim

RUN apt-get update

ENV APP_ROOT /src
ENV HOST 0.0.0.0

WORKDIR ${APP_ROOT}
COPY . ${APP_ROOT}


RUN yarn
RUN yarn build

CMD [ "yarn", "start" ]
