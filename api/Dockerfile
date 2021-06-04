FROM strapi/base

RUN mkdir -p /src/app

WORKDIR /src/app

COPY api/package.json ./
COPY api/yarn.lock ./

RUN yarn install

COPY api/ ./

ENV NODE_ENV production

EXPOSE 3069

# CMD ["yarn", "buildStart"]
CMD ["yarn", "develop"]