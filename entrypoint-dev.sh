#!/bin/bash

chmod +x /app/wait-for-it.sh

/bin/bash /app/wait-for-it.sh mysql-db:3306 -t 300 -- bash startup.sh