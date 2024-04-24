#!/bin/bash
echo 'run after_install.sh: ' >> /home/ec2-user/PW_API/deploy.log

echo 'cd /home/ec2-user/PW_API' >> /home/ec2-user/PW_API/deploy.log
cd /home/ec2-user/PW_API >> /home/ec2-user/PW_API/deploy.log

echo 'npm install' >> /home/ec2-user/PW_API/deploy.log 
npm install >> /home/ec2-user/PW_API/deploy.log