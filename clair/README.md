# Clair
Clair is a security tool used to scan Docker images and containers for vulnerabilities.

## About
This folder is used for the Bamboo plan acc-clair-scan, which runs nightly. The plan contains a job which will pull any images that need to be scanned before executing run-clair.sh

The scan is itself is performed by the Docker containers defined in docker-compose.yaml, and executed in clair-container-scan.sh. It will scan any image that contain the pattern 'innovateuk' in its name.

clair-local-scan.sh can be invoked to run a Clair scan locally. You will need Docker to be installed on your machine for this to work. 

The Bamboo build will fail if at least one vulnerability with high severity is found in any of the images scanned.

## Artifacts
Once the scan is complete, a json file (output.json) is written to the Clair folder which contains the full results of the scan. The index.html uses this to format the results into a human readable report. This can be viewed in the 'Artifacts' tab of the Bamboo build.
