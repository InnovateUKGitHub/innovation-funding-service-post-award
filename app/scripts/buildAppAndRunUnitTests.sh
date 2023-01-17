#!/bin/bash

# This should cause the script to exit immediately on error and the build to fail
set -e

export NODE_OPTIONS=--max_old_space_size=4096
export npm_config_cache=npm-cache

echo "About to run node check script"
npm run script:check-node
echo "About to update npm version"
npm i -g npm@8.19.2
echo "About to run ci"
npm ci --no-optional
echo "About to run patch-package"
npm run patch-package
echo "About to auto-generate Relay files"
npm run relay
echo "About to build with Webpack"
npm run build
echo "About to build with ESBuild"
npm run esbuild:tsc
echo "About to run lint"
npm run lint
echo "About to run test"
npm run test
echo "Completed steps in app/scripts/buildAppAndRunUnitTests.sh"
