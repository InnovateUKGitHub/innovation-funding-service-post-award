# Schema Files

This folder contains schema files that make up the GraphQL schema.

This folder should initially be empty.
All files are subsequently automatically generated.

## `fullSchema.gql`

This file is used by React Relay to generate automatically generated files.
These automatically generated files can be updated after you first run the application.

## `sfSchema.gql`

This file is a cached version of the Salesforce GraphQL schema.
This means the application loads faster compared to production,
as the schema does not need to be re-downloaded.
