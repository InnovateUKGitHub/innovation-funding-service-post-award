## Overview
These performance tests are run with Blazemeter Taurus, an open-source load testing tool which uses JMeter.

The test is run in the *acc-performance-test* CI plan in Bamboo. The plan is run in the blazemeter/taurus:latest Docker image (built from the Dockerfile in the docker/ folder). The *run-performance-test.sh* script builds the URL for the environment to be tested, creates an artifacts directory for dumping test logs and other artifacts, and runs the performance test inside the Docker container.

## Configuring tests
All configuration for the performance tests, including requests, criteria and reporting is written in config/testConfig.yml. For full documentation, see https://gettaurus.org/docs/Index/.
