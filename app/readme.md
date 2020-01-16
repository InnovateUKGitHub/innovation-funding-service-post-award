## Layers

Starting at the back

### Repositories

`./server/repositories/`

These make the relevant api calls to data stores
- Salesforce - inherit from `SalesforceRepositoryBase<T>` where T is the `ISalesforceXXX` definition of the fields

### DTOs

`./models/`

These are the intefaces of the shapes returned from the CQRS layer and are used in the Api layer and on the client. As we are expected to be the only consumer of the Api it is safe to share the dtos between the client and api layer with the results of the CQRS layer. If this changes the CQRS layer will need to return result objects that are mapped to api classes to allow for versioning of the api. This layer should only ever contain interfaces - it is important that there is no logic at this layer even mapping.

### CQRS

`./server/features/`

This is where application logic sits. They are run against a context (see below) and are asynchronous. Queries and commands can use other queries and commands as they have access to the context they are running against.

- `Query<T>` - implements `common/IQuery<T>`

A query returns an item or array of items usually a DTO

- `Command` - implements `ICommand`
- `Command<T>` - implements `ICommand`

A command updates some state for example in Salesforce and can either return an item or array or not return anything.

### Context

`./server/features/common`

This is a unit of work pattern against which commands and queries are executed. It also acts as a composable dependency (i.e. you can access the dependencies of the CQRS layer e.g. salesforce repositories and sharepoint file store)

It is constructed using a `contextProvider`

### Api

`./server/apis`

This is where rest endpoints are exposed. Defined as a class and exported as `controller`. Each api should generally return a single type of dto or maybe a summary dto and a full dto. They inherit from `ControllerBase<TDto>` or `ControllerBaseSummary<TFullDto, TSummaryDto>` *(todo when first required)*.

In order to support the isomorphic rendering it is important to define an interface which is also implemented by the `apiClient` that runs on the client side using `fetch` (see below).

In the constructor these methods which match the interface are bound to express using protected methods in the base that separate extracting and typing parameters from the url and calling on to the methods in the class.

New contollers interfaces are added to the `IApiClient` are registered with the server by adding to the `serverApis` const in `./server/apis/index.ts`

	export interface IProjectContactsApi {
	    getAllByProjectId: (projectId: string) => Promise<ProjectContactDto[]>
	}
	
	class Controller extends ControllerBase<ProjectContactDto> implements IProjectContactsApi {
	    constructor() {
	        super();
	
	        this.getItems("/", (p, q) => ({ projectId: q.projectId }), p => this.getAllByProjectId(p.projectId));
	    }
	
	    public async getAllByProjectId(projectId: string) {
	        const query = new GetAllForProjectQuery(projectId);
	        return await contextProvider.start().runQuery(query);
	    }
	
	}
	
	export const controller = new Controller();

### Routing

`./routing`

Routes are defined and used on the server to do initial rendering and on the client when javascript is enabled. `Router5` is used to match the routes.

Routes are objects that inherit from `AsyncRoute<T>` and provide the following properties
 
- `name` - used by router5 to identify route
- `path` - used by router5 to match the route and define params
- `fromPrams<T>` - used to extract strongly typed params from the route
- `component` - used to define the container to render
- `title` - method to get the title
- `loadData` - method that returns actions that are dispatched when the component first loads


### Containers

[./src/ui/containers](./src/ui/containers)

Containers are the page level react components.

### Components

Reusable React components. No redux dependencies.

### Debugging `server` in Visual Studio Code

Ensure that `app` directory is at the top level of VS Studio workspace and the project is built. Then press `F5` or `Debug -> Start Debugging`
