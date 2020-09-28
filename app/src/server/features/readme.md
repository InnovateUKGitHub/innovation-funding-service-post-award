# Features #

Commands and queries provide methods for requesting data from the repository and sending updates.

They abstract from the repository layer through mapping to DTOs and can contain business and mapping logic.

Each command and feature should be unit tested.

## Queries ##

Retrieve data from a repository (or more) and map to a DTO.
Do not change the observable state of the system.
Queries should extend `QueryBase`.

## Commands ##

Send updates to our repositories.
They change the observable state of the system.
Commands should extend `CommandBase`.

### Context ###

The Context exposes methods for executing commands and queries, e.g:

Query:
```
const query = new GetClaim(partnerId, periodId);
context.runQuery(query);
```
Command:
```
const command = new UpdateClaimCommand(projectId, claim);
await context.runCommand(command);
```

### Methods ###

#### Run ####

Queries and Commands should extend `QueryBase` and `CommandBase` respectively and implement the `Run` method.
For queries, the `Run` method should return a DTO and for commands the `Run` method should receive a DTO with the required updates.

#### accessControl ####

Queries and Commands can optionally implement the `accessControl` method to restrict access to the feature.
If the method is not implemented then by default there are no restrictions.
Should return `true` for access or `false` to stop the execution of the feature.
