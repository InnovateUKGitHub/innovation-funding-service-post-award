#!/bin/bash  

NEXUS_REPO=${bamboo_nexusRepoURL}

docker login --username=${bamboo_nexusUser} --password=${bamboo_nexusPassword} $NEXUS_REPO;

cp ${bamboo_build_working_directory}/owasp-zap/config/zap-config.conf /tmp

docker run -v /tmp:/zap/wrk/:rw -t $NEXUS_REPO/acc-owasp-zap:latest zap-baseline.py -t ${bamboo_devEnvURL} -c zap-config.conf -r owaspzap$(date +%F_%R).html -x report.xml
EXIT_CODE=$?

echo "Exit code $EXIT_CODE"

rm /tmp/zap-config.conf

if [[ $EXIT_CODE -ne 0 && ${bamboo_shouldFailOnBuildError} == 'true' ]]; then
  exit 1
else
  exit 0
fi
