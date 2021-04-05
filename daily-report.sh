#!/usr/bin/env bash

./src/monitoring.ts volumes
echo
./src/monitoring.ts newests -v
echo
./src/monitoring.ts ascendings 7
echo
./src/monitoring.ts ascendingScores 150 150
echo