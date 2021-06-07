FROM strapi/base

RUN mkdir -p /src/app

WORKDIR /src/app

COPY api/package.json ./
COPY api/yarn.lock ./

RUN yarn install

COPY api/ ./

# ENV NODE_ENV development
ENV PORT 3070
ENV HOST 0.0.0.0
EXPOSE 3070

# CMD ["yarn", "buildStart"]
CMD ["yarn", "develop"]