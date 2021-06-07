FROM node:latest

# Install node modules
# RUN npm install -g nodemon
# RUN npm install -g nuxt

# Create app directory
RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app/

RUN yarn install
RUN yarn build

ENV NODE_ENV development
ENV HOST 0.0.0.0
