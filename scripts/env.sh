#!/usr/bin/env bash

export APPSYNC_API_KEY=$(aws ssm get-parameters --region eu-west-1 --names "APPSYNC_API_KEY" --query Parameters[0].Value)
export APPSYNC_URL=$(aws ssm get-parameters --region eu-west-1 --names "APPSYNC_URL" --query Parameters[0].Value)
export DISCORD_API_KEY=$(aws ssm get-parameters --region eu-west-1 --names "DISCORD_API_KEY" --query Parameters[0].Value)