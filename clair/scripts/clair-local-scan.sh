#!/bin/sh

containers=$(docker images | awk '{print $1}' | grep innovateuk)

echo "------------------------------------------"
echo "--We will scan the following containers:--"
echo "------------------------------------------"
echo "${containers}"
echo "------------------------------------------"

for container in ${containers};
do
  echo "------------------------------------"
  echo "-- Scanning Container: ${container} "
  echo "------------------------------------"
  ./clair-container-scan.sh -v ${container}
  echo "---------------------------------------------------------------------------------------------"
  echo "If there is no JSON output above this line, the container ${container} has no vulnerabilities"
  echo "---------------------------------------------------------------------------------------------"
done

echo "------------------------------------------"
echo "-----------SCAN COMPLETE------------------"
echo "------------------------------------------"
