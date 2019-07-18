#!/usr/bin/env bash

sudo useradd webapp

read -r -d '' SERVICE << SERVICE
[Unit]
Description=NodeJS Discord bot server
[Service]
Restart=always
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=ec2-user
User=ec2-user
Group=ec2-user
ExecStart=/usr/bin/nodejs /opt/ec2-user/index.js
[Install]
WantedBy=multi-user.target
SERVICE

echo "$SERVICE" | sudo tee /etc/systemd/system/webapp.service
sudo systemctl enable webapp