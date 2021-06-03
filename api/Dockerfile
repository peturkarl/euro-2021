FROM strapi/base

RUN mkdir -p /src/app

WORKDIR /src/app

COPY api/package.json ./
COPY api/yarn.lock ./

RUN yarn install

COPY api/ ./

ENV NODE_ENV production

EXPOSE 1337

CMD ["yarn", "develop"]