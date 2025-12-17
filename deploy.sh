#!/bin/bash

set -e

rm -f data/*
#npx ts-node-esm ./src/vortex.ts binance -u h -w 100
npx ts-node ./src/vortex.ts binance -u d -w 120
git add data/* 
git add dumps/*
git commit -m "data update $(date)"
git push
