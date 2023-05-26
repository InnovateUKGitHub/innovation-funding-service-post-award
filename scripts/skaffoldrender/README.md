# skaffoldrender

To use...

1. Be in the root of the repository
2. Call `python3 scripts/skaffoldrender --help`
3. Adjust arguments and call again.

> Ensure you are logged into Nexus! Do `docker login` to begin.

## Example

```bash
# Build Docker image, and render all environments
python3.11 scripts/skaffoldrender --env custom --env demo --env dev --env perf --env preprod --env prod --env sysint --env uat

# Build Docker image with a specific tag, and render all environments
python3.11 scripts/skaffoldrender --tag ACC-SKAFFOLDDEV0-BUILD-3 --env custom --env demo --env dev --env perf --env preprod --env prod --env sysint --env uat
```

## Version

Python 3.6.9, to match the Python 3 that is available within our existing Docker images.
