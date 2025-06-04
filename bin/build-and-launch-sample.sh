#!/bin/bash
set -euo pipefail

SCRIPT_DIR=$(dirname "$0")
cd $SCRIPT_DIR

STRATEGY_NAME="${1:-strategy-runner}"

printf "\n========================================\n"
printf "Building antworker-crypto-algo-trading"
printf "\n========================================\n"

cd ../
npm run build

printf "\n========================================\n"
printf "Building antworker‐sample $STRATEGY_NAME"
printf "\n========================================\n"

if [[ ! -d "./samples/$STRATEGY_NAME" ]]; then
  echo "Error: strategy sample './samples/$STRATEGY_NAME' not found."
  exit 1
fi

cd "./samples/$STRATEGY_NAME"
npm run build

printf "\n========================================\n"
printf "Launching antworker-sample $STRATEGY_NAME"
printf "\n========================================\n"

if [[ ! -f "dist/index.js" ]]; then
  echo "Error: 'dist/index.js' not found in './samples/$STRATEGY_NAME'. Did the build fail?"
  exit 1
fi

node ./dist/index.js
