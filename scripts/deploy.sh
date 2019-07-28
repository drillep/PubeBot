#!/usr/bin/env bash

sudo useradd webapp

read -r -d '' SERVICE << SERVICE
[Unit]
Description=NodeJS Discord bot server
[Service]
Restart=always
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=webapp
User=webapp
Group=webapp
APPSYNC_API_KEY=$(aws ssm get-parameters --region eu-west-1 --names APPSYNC_API_KEY --query Parameters[0].Value)
APPSYNC_URL=$(aws ssm get-parameters --region eu-west-1 --names APPSYNC_URL --query Parameters[0].Value)
DISCORD_API_KEY=$(aws ssm get-parameters --region eu-west-1 --names DISCORD_API_KEY --query Parameters[0].Value)
ExecStart=node /opt/webapp/index.js
[Install]
WantedBy=multi-user.target
SERVICE

echo "$SERVICE" | sudo tee /etc/systemd/system/webapp.service
sudo systemctl enable webapp