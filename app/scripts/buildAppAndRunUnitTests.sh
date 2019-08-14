#!/bin/bash

# This should cause the script to exit immediately on error and the build to fail
set -e

npm ci
npm run build
npm run lint
npm run test
