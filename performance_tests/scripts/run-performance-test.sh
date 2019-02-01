#!/bin/bash

WORKING_DIR=$PWD/performance_tests
GIT_BRANCH=`git rev-parse --abbrev-ref HEAD`

echo "Dev URL is: $bamboo_devEnvUrl"

sed -i "s@envURL@$bamboo_devEnvUrl@g" $WORKING_DIR/config/testConfig.yml

mkdir $WORKING_DIR/artifacts

echo "Running performance test on Openshift environment"

docker run --rm -v $WORKING_DIR/config:/bzt-configs -v $WORKING_DIR/artifacts:/tmp/artifacts -v $WORKING_DIR/artifacts/TaurusReport:/TaurusReport docker-acc.devops.innovateuk.org/acc-blazemeter-taurus:v1 testConfig.yml

