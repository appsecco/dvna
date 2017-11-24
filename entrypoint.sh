#!/bin/bash

chmod +x /app/wait-for-it.sh

/bin/bash /app/wait-for-it.sh $MYSQL_HOST:$MYSQL_PORT -t 300 -- npm start