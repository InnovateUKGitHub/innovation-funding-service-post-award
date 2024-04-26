# cypress

To ensure you can run tests...

1. Ensure you have SOPS installed
2. Ensure submodules have been cloned and exist in the `/kustomize/acc-secrets` subrepo
3. Create a file called `cypress.env.json` with the following...
   - You can change the environment to any other, matching the file naming schema of the
     acc-secrets repo.

```
{
  "SALESFORCE_ENVIRONMENT": "dev"
}
```
