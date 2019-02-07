#!/usr/bin/env bash

# This can be used as a general purpose script to retrieve from SSM. 
# When we re-organise our file structure, we should move this to a folder where it can be accessed from anywhere

USAGE="Usage: <nexus_username> <nexus_password> <nexus_url> <ssm_parameter_name>"

if [[ "$#" -ne 4 ]]; then
  echo ${USAGE}
  exit 1
fi

docker login --username "${1}" --password "${2}" "${3}" > /dev/null 2>&1

OUTPUT=$(docker run --rm ${3}/aws-cli-ssm aws ssm get-parameter --name ${4} --with-decryption)

echo ${OUTPUT} | jq -r .Parameter.Value
