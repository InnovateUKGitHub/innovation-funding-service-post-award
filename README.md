# Installation
## Prerequisites
Ensure you have node.js and npm installed on your machine.

[Windows](https://blog.teamtreehouse.com/install-node-js-npm-windows)

[Mac](https://blog.teamtreehouse.com/install-node-js-npm-mac)

Check out the repository on the `develop` branch.

## Secrets
In order to build the node.js service, you'll need to get a secret created on your openshift project.
You will need to do this manually and once only. You run it as follows:
`oc create secret generic shibsigningkey --from-file=signing.key=<path-to-shib-signing-key.key>`
`oc create secret generic sfsigningkey --from-file=signing.key=<path-to-sf-signing-key.key>`
The path is to the file containing your key so will need to change accordingly. Leave the rest as it is.

## Site
 1. Navigate to `/app` from repository root
 2. Run `npm install` to install dependencies
 3. Run `npm run build`
 4. Run `npm run start:server` to start the web server Site is now available at `http://localhost:8080`

You will only need to execute step 4 in future, unless code updates require you to install new dependencies - ask a developer.

### SSO Development
Developing locally for single sign-on (SSO) requires a HTTPS server to be run on local host. You will need the certificate and private key stored under `/security` as `AccLocalDevCert.crt` and `AccLocalDevKey.key` respectively.

The following key-values will need to be set in your .env file.
```
USE_SSO=true
SERVER_URL=http://localhost:8080
SSO_PROVIDER_URL=https://auth-acc-ifsdev.apps.org-env-0.org.innovateuk.ukri.org/idp/profile/SAML2/Redirect/SSO
SSO_SIGNOUT_URL=https://acc-ifsdev.apps.org-env-0.org.innovateuk.ukri.org/Logout
IFS_ROOT=https://acc-ifsdev.apps.org-env-0.org.innovateuk.ukri.org
```
Then run `npm run start:dev -- --secure`. The site will be available on `https://localhost:8080` with SSO enabled.

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

Please note there is further documentation about the application in relevant subfolders, such as /testframework.
