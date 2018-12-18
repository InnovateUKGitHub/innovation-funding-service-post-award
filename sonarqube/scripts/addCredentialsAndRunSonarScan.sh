#!/bin/bash

SONARQUBE_PROPERTIES_FILE="sonar-project.properties"

sed -i "s@sonarqubeServerUrl@$1@g" $SONARQUBE_PROPERTIES_FILE 
sed -i "s/sonarqubePassword/$2/g" $SONARQUBE_PROPERTIES_FILE

/opt/sonar-scanner-3.2.0.1227-linux/bin/sonar-scanner
