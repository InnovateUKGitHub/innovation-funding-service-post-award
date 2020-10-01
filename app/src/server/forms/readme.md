# Form Handlers #

Form handlers process form POSTs (sent from the client when JS is not enabled).
On success they will return a redirect response.
On error they will return a server rendered HTML (showing the user an error).

New form handlers should be added to formRouter.ts and extend `FormHandlerBase` or one of the following subclasses:

`StandardFormHandlerBase` is the most commonly used base class for simple forms.

`SingleFileFormHandlerBase` is the base class for handling forms containing multipart form data with a single document.

`MultipleFileFormHandlerBase` is the base class for handling forms containing multipart form data with multiple documents.

## StandardFormHandlerBase ##

###Constructor

The constructor accepts:

`routeInfo: RouteInfo<TParams>` the info for the route to which the form is posted

`buttons: string[]` an array of button names for which the form handler should be used

`store: TStore` Thee name of the redux store in which the dto is stored

###Methods

`getDto` Method to process the form body and return a dto.

`run` Method which takes the dto as a parameter and uses it to execute an update command and return a redirect.

`getStoreKey` Method to return the redux store key for the dto being processed. Used to construct a FormHandlerError in case of error.

`createValidationResult` Method to return a validation result for the dto being processed. Used to construct a FormHandlerError in case of error.
