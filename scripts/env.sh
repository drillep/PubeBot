#!/usr/bin/env bash

APPSYNC_API_KEY=$(aws ssm get-parameters --region eu-west-1 --names APPSYNC_API_KEY --query Parameters[0].Value)
APPSYNC_URL=$(aws ssm get-parameters --region eu-west-1 --names APPSYNC_URL --query Parameters[0].Value)
DISCORD_API_KEY=$(aws ssm get-parameters --region eu-west-1 --names DISCORD_API_KEY --query Parameters[0].Value)