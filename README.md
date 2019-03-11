# Installation
## Prerequisites
Ensure you have node.js and npm installed on your machine.

[Windows](https://blog.teamtreehouse.com/install-node-js-npm-windows)

[Mac](https://blog.teamtreehouse.com/install-node-js-npm-mac)

Check out the repository on the `develop` branch.

## Secrets
In order to build the node.js service, you'll need to get a secret created on your openshift project.
You will need to do this manually and once only. You run it as follows:
`oc create secret generic signingkey --from-file=signing.key=app/security/AccPrivateKey.key`
The path is to the file containing your key so will need to change accordingly. Leave the rest as it is.

## Site
 1. Navigate to `/app` from repository root
 2. Run `npm install` to install dependencies
 3. Run `npm run build`
 4. Run `npm run start:server` to start the web server Site is now available at `http://localhost:8080`

You will only need to execute step 4 in future, unless code updates require you to install new dependencies - ask a developer.

## Run unit tests
 1. Ensure the server is running with `npm run start:server`
 2. Run `npm run tests`
 3. After the tests complete will give you the output location of your report

## Run API & UI tests
1. Ensure the server is running with `npm run start:server` from `/app` directory
2. Navigate to `test-framework` from repository root
3. Run `npm install` to install dependencies
4. Run `npm run build`
5. Run `npm run test`
6. After tests have completed the process will give you output location of the report

Please note there is further documentation in the /testframework README.
