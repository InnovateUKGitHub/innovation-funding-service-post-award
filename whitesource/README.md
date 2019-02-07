# Whitesource
Whitesource is a security tool for finding and reporting vulnerabilities in project dependencies. As a Typescript project, the dependencies used by the ACC External UI are primarily NPM libraries (stored in the node_modules folder).

The script ws.sh is executed in Bamboo on a nightly basis and publishes a report of the ACC project dependencies, any vulnerabilities found and their severity to IUK's Whitesource web console.

## Script
Authentication with IUK's Whitesource account is done using an API key, a product token and a project token. These are base-64 encoded and stored in AWS SSM. They are retrieved by running ssm-key.sh, which runs an IFS built Docker container to retrieve and decode them.

Six arguments (detailed in the next section) are taken which are used to configure the Whitesource scan. They are passed into a generated configuration file. The full list of parameters for configuring Whitesource can be found at https://whitesource.atlassian.net/wiki/spaces/WD/pages/489160834/Unified+Agent+Configuration+File+Parameters

The Whitsource .jar executable is downloaded from Github and run with the generated config file. 

## Arguments
ws.sh takes six arguments which are used configure the Whitesource scan. 

### LIB_PATHS
Comma seperated list specifying the path(s) to the project(s) to analyze dependencies for, in our case acc-ui/app.

### INCL_EXT
Comma seperated list of file extensions to check where dependencies are being used.

### RESOLVE_ALL
A boolean flag to determine whether to include non-NPM dependencies in analysis. N.B. the property **npm.resolveDependencies** is fixed to 'true', so NPM dependencies will always be resolved. Can be configured in the plan variable **resolveAllDependencies**.

### FORCE_CHECK_ALL
A boolean flag. Setting to 'true' will cause all dependencies used in the project to be analyzed on each scan. Setting to 'false' will only set any newly introduced dependencies to be analyzed. Can be configured in the plan variable **forceCheckAllDependencies**.

### INCL_DEV_DEPS
Boolean flag to determine whether to include the NPM dev dependencies in analysis. Can be configured in the Bamboo plan variable **inclDevDependencies**.

### FAIL_ON_VIOLATION
Boolean flag to determine whether to fail the Bamboo plan if a Whitesource policy violation is found, i.e. if there is at least one dependency with a severe vulnerability. Can be included in the Bamboo plan variable **failOnPolicyViolation**.
