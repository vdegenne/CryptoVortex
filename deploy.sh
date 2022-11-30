#!/bin/bash

rm ./data/*
#./src/vortex.ts binance -u h -w 100
./src/vortex.ts binance -u d -w 120
git add data/*
git add dumps/*
git commit -m "data update $(date)"
git push
