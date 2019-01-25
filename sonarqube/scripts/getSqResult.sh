#!/bin/bash 
CURL='/usr/bin/curl' 
SQAPI=${bamboo_sonarqubeStatusAPI} 
ARGS="-u ${bamboo_sonarqubeUser}:${bamboo_sonarqubeUserPassword}"  

echo "CHECKING RESULTS OF SONARQUBE SCAN..."

raw="$($CURL $ARGS $SQAPI)"
if [[ $raw = *"\"status\":\"ERROR\""* ]]; 
then   
  echo "ERROR: Critical or major violations found in Sonarqube analysis"
  echo "Results at ${bamboo_sonarqubeServerUrl}"
  exit 1 
else   
  echo "SUCCESS: No major or critical violations found in Sonarqube analysis"
  echo "Results at ${bamboo_sonarqubeServerUrl}"
  exit 0 
fi
