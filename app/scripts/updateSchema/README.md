# Graph QL Schema

there are multiple steps to updating the graphql schema.

The sfSchema type is generated through introspection of salesforce API

The schema is reduced in size by matching with the typeWhitelist. Only objects that are matched will be included in the schema.

If things stop working because of an API upgrade, then this whitelist may need editing.

# GraphQL Update Schema

To update the GraphQL schema file...

1. Modify the whitelist to pick extra fields you may wish to use
2. Build the update software, with `npm run updateSchema:build` to generate the js files from the typescript.
3. Run the software, with `npm run updateSchema` which will create a new salesforce schema
4. To generate the `fullSchema.gql` you will need to start the app with `npm start`.
5. To check everything is working, you should try `npm run relay`.
6. If errors are shown, then fields will need to be added to the whitelist if it is complaining that something is not found. Likely a new API has changed an object type to something that is not in the whitelist
