#!/bin/bash

# This should cause the script to exit immediately on error and the build to fail
set -e

export NODE_OPTIONS=--max_old_space_size=4096

npm ci
npm run build
npm run lint
npm run test
