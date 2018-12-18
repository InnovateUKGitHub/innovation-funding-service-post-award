## SonarQube
SonarQube is used to analyze and report statistics on our source code. These include test coverage, code smells, bugs and vulnerabilities. Reports on our code can be viewed at https://devops.innovateuk.org/code-quality under 'ACC External UI'. 

By default, your credentials are the same as those used for Bitbucket and Jira. If you cannot login, you may have to speak to someone at Innovate UK to reset them.

## Overview
The contents of this folder include a Dockerfile and a script. The Dockerfile (located in the /docker folder) is the config for a Docker image which contains the Sonar Scanner executable used to run the scan. The image itself is stored in IUK's Nexus repository. 

The image is then pulled into the nightly CI job so the exectuable can be used there. The CI job executes the script located in the /scripts folder, which injects the credentials for the SonarQube server and runs the executable. The information is then published to IUK's SonarQube server.

## Properties file
sonar-project.properties is located in the /app folder in the project's root directory. It contains the configuration needed for the scan, including the address,of the server credentials, how to collect test coverage and what files to analyse. 

For the scan to run successfully, the Sonar Scanner executable must be run from the same directory as the properties file.

## Docker
The Dockerfile is used to build a Docker image which comes packaged with the Sonar Scanner executable. This image is used in the nightly CI job to run the analysis.

The Docker image can be changed and built locally, but to publish it, you must have credentials for InnovateUK's Nexus repository. Instructions on publishing to Nexus can be found here at the bottom of the page. (you may need permissions to view). https://devops.innovateuk.org/documentation/pages/viewpage.action?spaceKey=IUDT&title=Nexus
