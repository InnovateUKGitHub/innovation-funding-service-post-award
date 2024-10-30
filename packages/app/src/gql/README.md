# GraphQL

https://graphql.org/

This folder contains files relevant to the processing of GraphQL,
and is split up into the following categories.

| Folder Name      | Description                                                                                                |
| ---------------- | ---------------------------------------------------------------------------------------------------------- |
| @gql/fragment    | Fragments that are automatically parsed and utilised by Relay.                                             |
| @gql/hooks       | Pre-packaged, reusable React Hooks that call Relay.                                                        |
| @gql/query       | Queries that are not associated with a specific page or component                                          |
| @gql/resolvers   | Additional resolvers that are "glued" onto the official Salesforce GraphQL API.                            |
| @gql/sf          | Connection to Salesforce                                                                                   |
| @gql/transforms  | Transformers to transform Salesforce GraphQL fields, types and results to a format that our system enjoys. |
| @gql/typegraphql | Non-Salesforce related GraphQL schema, such as client configuration                                        |
