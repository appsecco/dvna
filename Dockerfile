# Damn Vulnerable NodeJS Application
# docker run --name dvna -p 9090:9090 -d appsecco/dvna:sqlite

FROM node:carbon-alpine
LABEL MAINTAINER "Subash SN"

WORKDIR /app

COPY . .

RUN apk --no-cache add sqlite && npm install

CMD ["npm", "start"]