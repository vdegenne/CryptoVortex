#!/bin/bash

rm ./data/*
./src/vortex.ts binance -u h -w 49
#./src/vortex.ts binance -u d -w 60
git add .
git commit -m "data update $(date)"
git push
