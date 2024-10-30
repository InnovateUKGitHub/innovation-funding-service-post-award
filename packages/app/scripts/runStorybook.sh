#!/bin/bash

# This should cause the script to exit immediately on error and the build to fail
set -e

export NODE_OPTIONS=--max_old_space_size=4096
export npm_config_cache=npm-cache

echo "About to run node check script"
npm run script:check-node
echo "About to run ci"
npm ci
echo "About to run patch-package"
npm run patch-package
echo "About to build with Webpack"
npm run build-storybook

echo "Completed steps in app/scripts/runStorybook.sh"
