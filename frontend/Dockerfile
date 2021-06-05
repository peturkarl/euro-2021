FROM node:latest

# Install node modules
RUN npm install -g nodemon

# Create app directory
RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app/

ONBUILD RUN npm install


ENV NODE_ENV production
ENV HOST 127.0.0.1

# Install app dependencies
CMD [ "npm", "run", "buildStart"]
# CMD [ "npm", "run", "dev"]