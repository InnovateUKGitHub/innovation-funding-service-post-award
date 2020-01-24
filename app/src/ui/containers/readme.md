# Containers #

Containers are effectively pages

They are usually made up 5 parts

### 1. Parameters

These are the parameters that are defined in the route, either in the url or query string, defined as an interface.

### 2. Data Props

This is the data required to render the container defined as an interface 

### 3. Component

This is a class that inherits from `ContainerBase<TParameters, TData, TCallbacks>` or `ContainerBaseWithState<TParameters, TData, TCallbacks, TState>` if state is required.

This is a standard react component and needs to implement the render method.

Generally the container will render a `<ACC.PageLoader/>` as the initial child component which will then call on to a `renderContents` method once data is loaded.

*The `TCallbacks` is a hangover from writing components for `react-redux` connect approach which is no longer used. It can be nice, however, to separate out the callbacks interface from the data interface if preferred. so has been left in for now.*

### 4. Container

This is a React `FunctionComponent` that takes as props the combined `TParams & BaseProps` where BaseProps are the props all container are passed and the TParams are the parameters defined for the component (see above.)

This then uses the `StoresConsumer` to get the data defined in `TData` (see above.) and renders the Component.

### 5. The Route

This is defined by calling `defineRoute` and exported from the file. `defineRoute` takes the following options

    routeName: string;
    routePath: string;
    container: React.FunctionComponent<TParams & BaseProps>;
    getParams: (route: RouteState) => TParams;
    accessControl?: (auth: Authorisation, params: TParams, config: IClientConfig) => boolean;
    getTitle: (store: RootState, params: TParams, stores: IStores) => {
        htmlTitle: string;
        displayTitle: string;
    };

eg

    export const ProjectDetailsRoute = defineRoute({    
	    routeName: "projectDetails",
	    routePath: "/projects/:id/details",
	    container: ProjectDetailsContainer,
	    getParams: (r) => ({ id: r.params.id }),
	    getTitle: () => ({
	        htmlTitle: "Project details",
	        displayTitle: "Project details"
	    }),
	    accessControl: (auth, { id }) => auth.forProject(id).hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer)
    });

`routeName` must be unique and identifies the route in router5.

`routePath` is defined as per the router5 spec ([https://router5.js.org/](https://router5.js.org/)) and the parameters must match the parameters defined in `TParams` (see above).

`container` is the container defined above

`getParams` maps the router5 params into the TParams object. This is generally the place to convert strings to numbers, booleans etc. as all values in the router5 params are strings.

`accessControl` allows the route to be restricted


`getTitle` is a method defining the `htmlTitle `that is in the html metadata and the `displayTitle` that is displayed on the page.

