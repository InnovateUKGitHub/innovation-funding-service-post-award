#!/bin/bash

docker exec acc-sonarqube-runner bash -c "cd app; ../sonarqube/scripts/addCredentialsAndRunSonarScan.sh $1 $2;"
