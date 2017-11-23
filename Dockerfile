FROM node:carbon
LABEL MAINTAINER "Subash SN"

WORKDIR /app

RUN npm install -g nodemon

CMD npm install ; nodemon