#!/bin/bash

./src/vortex.ts binance-pairs
./src/vortex.ts binance
git add .
git commit -m "data update $(date)"
git push
