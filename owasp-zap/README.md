# OWASP ZAP
OWASP ZAP is a tool which runs a simulated 'attack' on an environment to detect security issues.

OWASP is currently configured to run on the ACC develop environment. **Never run it against production** because there is potential for it to break something.

## About
This folder is used for the Bamboo plan 'acc-owasp-zap' which runs nightly. The job contained in the plan runs run-owasp-zap.sh. 

The scan is run by a Docker container pulled from the ACC Nexus repository. This is a copy of the OWASP ZAP public image with a different name, so that it conforms to our naming convention. Further details on this container can be found at https://github.com/zaproxy/zaproxy/wiki/ZAP-Baseline-Scan.

OWASP will run a baseline scan against our develop environment and log any vulnerabilities it finds. As a baseline scan, it runs a spider against the target, then waits for the passive scanning to complete before reporting the result. This means it is not simulating an actual 'attack' and should be safe to target our environments without the risk of any issues or alarms being triggered.

A report will be generated to the artifacts tab of the Bamboo job. The script collect-owasp-zap-logs.sh executes a Python script which prints the results to the Bamboo console.

The job will fail if OWASP detects any issues and returns them as failures. This condition can be switched off by setting the Bamboo variable 'shouldFailOnBuildError' to false.

## Configuration
The config file (config/zap-config.conf) can be used to set up how OWASP should treat any rules that are violated. Currently, all rules are set to FAIL. They can be changed to either be WARNings or to be IGNORED.
