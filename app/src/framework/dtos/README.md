# DTOs #

DTOs (Data Transfer Objects) are interfaces of the expected shapes returned by the CQRS (Command Query Responsibility Segregation) layer. 
Their purpose is to be used on the API layer and Client. They help decouple data domain objects from the API and the Client layer, by mapping/state-manipulating the data retrieved from the CQRS layer into data-types required by the consumers of these queries.
The DTOs layer should not contain any logic.

## Creating a DTO

To create a new DTO, create a new typescript file, and define the data fields and their expected types required in a new named interface.

### Example

`/framework/dtos/FooBarDto.ts`:
            interface FooBarDto {
                id: string;
                description: string;
                active: boolean;
            }

## Mapping an Entity into a DTO 

Once you have defined your interface, you can map the entity containing Salesforce(repository) data (from the CQRS layer) into a DTO object, by defining a new mapper method.  

### Example 

(assumes `FooBarEntity` exists): 
`/server/features/newInfo/mapFooBarToDto.ts`:
            export default () => (item: FooBarEntity): FooBarDto => ({
                id: item.Id,
                description: item.Acc_FooBarDescription__c,
                active: item.Acc_FooBarActive__c,
            });

!!! It is important to note that if Salesforce returns a different data type then the one required by the DTO (e.g. Salesforce stores Dates as strings), that field needs to be mapped to the appropriate data type. 

### Example 

(assumes `FooBarEntity` exists):  
`/framework/dtos/FooBarDto.ts`:
            interface FooBarDto {
                periodStart: Date | null
            }

`/server/features/newInfo/mapFooBarToDto.ts`:
            export default () => (item: FooBarEntity): FooBarDto => ({
                periodStart: context.clock.parse(forecastDetail.Acc_ProjectPeriodStartDate__c, SALESFORCE_DATE_FORMAT),
            });

### Using DTOs in the CQRS layer

After a mapper is created, it can be used in a query to return a DTO needed by the application layer. A query class extends the [QueryBase<T>](/app/src/server/features/common/queryBase.ts) class, and contains an async 'Run' method that is context reliant. This class filters the repository layer by set parameter, and maps the results into DTOs of similar shapes.
Query files (as well as any other DTO logic) should live in the CQRS layer. 

### Example 

(assumes `fooBars` exists at the repository level):
`/server/features/fooBars/getAllFooBarsQuery.ts` :
            import mapFooBar from './mapFooBarToDto'

            export class GetAllFooBarsQuery extends QueryBase<FooBarDto[]> {
                constructor() {
                    super();
                }
                
                protected async Run(context: IContext): Promise<FooBarDto[]> {
                    const results = await context.repositories.fooBars.getAll();
                    return results.map(mapFooBar(context));
                }
            }

## Using DTOs in the API layer

The API layer makes use of queries that return our DTOs by implementing the Model-View-Controller pattern. To create a new Controller for a new data object, design a class that extends any [ControllerBase<T>](/app/src/server/apis/controllerBase.ts) class, and define the implemented methods making use of the queries designed for the specific data object. Once the controller has been defined, it needs to be added in the [`index.ts`](/app/src/server/apis/index.ts) file to the serverApis object. This can then be used to create a store for all the DTOs of the new data object, which can be accessed by the application layer via React containers and components.

### Example

`/server/api/fooBars.ts`
            import contextProvider from "@server/features/common/contextProvider";
            import { ApiParams, ControllerBaseWithSummary } from "./controllerBase";
            import { GetAllFooBarsQuery } from "@server/features/pcrs/getAllFooBarsQuery";

            export interface IFooBarsApi {
                getAll: (params: ApiParams<{ id: string }>) => Promise<FooBarDto[]>;
            }

            class Controller extends ControllerBase<FooBarDto> implements IFooBarsApi {
                constructor() {
                    super("fooBars");

                    super.getItems("/", (p, q) => ({ id: q.id }), (p) => this.getAll(p));
                }

                getAll(params: ApiParams<{ id: string }>): Promise<FooBarDto[]> {
                    const query = new GetAllFooBarsQuery(params.id);
                    return contextProvider.start(params).runQuery(query);
                }
            }

            export const controller = new Controller();
