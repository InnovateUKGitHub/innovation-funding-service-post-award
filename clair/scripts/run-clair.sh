#!/bin/sh

PROJECTPATH=${bamboo_build_working_directory}

echo 'logging in to nexus'
docker login --username ${bamboo_nexusRepoUser} --password ${bamboo_nexusRepoPassword} ${bamboo_nexusRepoUrl} > /dev/null 2>&1 
docker pull arminc/clair-db:latest
docker pull arminc/clair-local-scan:v2.0.5
docker pull docker-ifs.devops.innovateuk.org/ifs-clair-scanner:v2

./clair-container-scan.sh > $PROJECTPATH/clair/output.json;

if $(grep -q "\"severity\": \"High\"," ../output.json);
then   
  echo "FAIL: Clair found severe container vulnerabilities"
  exit 1 
else   
  echo "PASS: Clair found no container vulnerabilities"
  exit 0 
fi

echo "Full results can be viewed in 'Clair report' in Bamboo artifacts"
