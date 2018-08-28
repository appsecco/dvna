# Damn Vulnerable NodeJS Application
# https://github.com/appsecco/dvna

FROM node:carbon-slim
LABEL MAINTAINER "Subash SN"

WORKDIR /app

RUN npm install -g nodemon

CMD ["/bin/bash", "/app/entrypoint.sh"]
