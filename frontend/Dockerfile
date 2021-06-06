FROM node:latest

# Install node modules
# RUN npm install -g nodemon
RUN npm install -g nuxt

# Create app directory
RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app/

RUN npm install
RUN npm run build

ENV NODE_ENV production
ENV HOST 0.0.0.0
