FROM node:carbon
LABEL MAINTAINER "Subash SN"

WORKDIR /app

COPY . .

RUN npm install

CMD ["npm", "start"]