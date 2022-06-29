#!/bin/bash

# This should cause the script to exit immediately on error and the build to fail
set -e

export NODE_OPTIONS=--max_old_space_size=4096
echo "About to run node check script"
npm run script:check-node
echo "About to run ci"
npm ci --no-optional
echo "About to run build:server"
npm run build:server
echo "About to run build:client"
npm run build:client
echo "About to run lint"
npm run lint
echo "About to run test"
npm run test
echo "Completed steps in app/scripts/buildAppAndRunUnitTests.sh"
