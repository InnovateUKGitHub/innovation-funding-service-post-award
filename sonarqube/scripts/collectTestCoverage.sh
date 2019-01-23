#!/bin/bash

docker exec acc-sonarqube-runner bash -c "set -e; cd app; npm install; npm run tests:coverage"
