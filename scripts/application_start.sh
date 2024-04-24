#!/bin/bash

echo 'run application_start.sh: ' >> /home/ec2-user/PW_API/deploy.log

echo 'pm2 restart nodejs-express-app' >> /home/ec2-user/PW_API/deploy.log
pm2 restart nodejs-express-app >> /home/ec2-user/PW_API/deploy.log