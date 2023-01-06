This folder is for files that should be written into the openshift filesystem.

This folder has write permissions and in Openshift is accessed through the
`process.env.GQL_SCHEMA_DIR` environment variable.

For local development, you should add the following env var to your `.env` file
`GQL_SCHEMA_DIR=./ocdata`

Do not push the contents of this folder to bitbucket
