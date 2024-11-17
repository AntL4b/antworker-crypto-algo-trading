#!/bin/bash

SCRIPT_DIR=$(dirname "$0")

cd $SCRIPT_DIR

printf "\n========================================\n"
printf "Building antworker-crypto-algo-trading"
printf "\n========================================\n"

cd ../
npm run build

printf "\n========================================\n"
printf "Building antworker-sample-strategy-runner"
printf "\n========================================\n"

cd ./samples/strategy-runner
npm run build

printf "\n========================================\n"
printf "Launching antworker-sample-strategy-runner"
printf "\n========================================\n"

node ./dist/index.js
