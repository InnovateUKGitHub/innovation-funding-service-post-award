#!/bin/bash  

NEXUS_REPO=$bamboo_nexusRepoURL
WORKING_DIR=$bamboo_build_working_directory/owasp-zap
ZAP_LOGS_DIR=$WORKING_DIR/logs

docker login --username=${bamboo_nexusUser} --password=${bamboo_nexusPassword} $NEXUS_REPO;

mkdir $ZAP_LOGS_DIR
chmod 777 $ZAP_LOGS_DIR

cp $WORKING_DIR/config/zap-config.conf $ZAP_LOGS_DIR

docker run -v $ZAP_LOGS_DIR:/zap/wrk/:rw -t $NEXUS_REPO/acc-owasp-zap:latest zap-baseline.py -t $bamboo_devEnvURL -c zap-config.conf -r owaspzap$(date +%F_%R).html -x report.xml
EXIT_CODE=$?

echo "Exit code $EXIT_CODE"

if [[ $EXIT_CODE -ne 0 && ${bamboo_shouldFailOnBuildError} == 'true' ]]; then
  exit 1
else
  exit 0
fi
