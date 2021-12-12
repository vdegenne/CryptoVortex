#!/bin/bash

rm ./data/*
./src/vortex.ts binance -u h -w 48
git add .
git commit -m "data update $(date)"
git push
