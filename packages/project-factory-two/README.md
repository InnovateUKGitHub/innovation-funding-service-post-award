# `@innovateuk/project-factory-two`

The second iteration of the Project Factory(TM), which generates Innovate UK IFS Post Award projects
and loads them onto Salesforce.

## Comparison

| Comparison                                    | Project Factory 1 | Project Factory 2 |
| --------------------------------------------- | ----------------- | ----------------- |
| Supports Playwright                           | Yes               | Yes               |
| Can run anonymous apex                        | Yes               | Yes               |
| Supports being executed outside of playwright | No                | Yes               |
| Can create projects with two partners         | No                | Yes               |
| Limited to 100 SOQL calls and 200 DML calls   | Limited           | Unlimited         |
| Better                                        | No                | Yes               |
| Not hacky                                     | No                | Yes               |

## Architecture

```sh
src/
  database/    # A set of files that help create a wrapper similar to the Salesforce Database class
  exceptions/  # Errors errors errors
  helpers/     # Files that help clean up the look of scripts
  scripts/
    AbstractProjectFactoryScript.ts       # Base script - Extend and enter your own Apex-style script
    AbstractApexScript.ts                 # Script that only executes anonymous apex
    HelloWorldApexScript.ts               # Hello world!
    TwoParticipantProjectFactoryScript.ts # Script that creates a project with two participants
  sobjects/
    AbstractProjectFactory.ts  # Base Data Object
    factories.ts               # List of all data objects
    [otherfiles].ts            # Objects that mirror their Salesforce SObject counterparts
```
