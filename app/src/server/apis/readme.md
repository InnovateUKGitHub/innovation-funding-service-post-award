# APIs #

The API layer is the HTTP/S gateway to our application. 
It defines the controllers for retrieving or inserting data through an HTTPS request.

## Base Class ##

Each Controller is a class that inherits from `ControllerBase` defining the standard DTOs that the controller returns

`ControllerBase` is a generic abstract class which exposes methods for GET/POST/DELETE/PUT.
Some example methods are:

* getItem
* deleteItem
* putItem
* etc

These methods handle returning the response or an error to the client.
Relevant API headers should be defined here (see <code>attachmentHandler</code> as an example).
Application level headers are set in [server.ts](./src/server/server.ts)

## Routing ##
Express is used for routing and serving up the APIs.
APIs routes are composed of { "/api" + namespace defined in controller constructor + method endpoint }.
See express documentation for route syntax.

Example route "Get Project":

`/api /controller-namespace /method endpoint`

`/api /projects /:projectId`

## Service Layer ##
Logic should be avoided in the API layer as there is no framework for testing the controllers aside from integration tests.
Instead, Queries and Commands should be used, see [features](./src/server/features)

## Registering a controller ##
To register a controller's APIs with the express router, the route must be added to the class constructor.
The method passed as the run delegate should be added to [IApiClient, serverApis](./src/server/apis/index.ts)
and [clientApi](./src/client/apiClient.ts:5).
This defines the interface for calling the api from the client or calling the method directly from the server.