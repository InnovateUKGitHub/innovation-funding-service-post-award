# Repositories #

The repository layer retrieves from and updates data in the data stores,currently salesforce. Although efforts have been made to make it more agnostic, due to the data structures has it is still fairly specific.
	
### All ###

Define the interface of the repository, eg `IProjectRepository`, to allow easy mocking in the unit tests.

### Salesforce ###

These are generally mapped to a single object in salesforce.

A simple salesforce repository is a class that implements the relevant interface, eg `IProjectRepository`,   inherits from `SalesforceRepositoryBase<T>` where `T` is the typed definition of the fields returned by salesforce normally `ISalesforceXXX` eg `ISalesforceProject`.

A more complex repository is inherited from `SalesforceRepositoryBaseWithMapping<T, TEntity>` where `T` is again the typed definition of the fields returned by salesforce and `TEntity` is the class that is mapped to before exposing to other layers. This is implemented by defining a mapper class that implements `ISalesforceMapper<TSalesforce, TEntity>` in the property `mapper`.

There are a number of protected methods on the base class to retrieve salesforce i.e. `retrieve`, `all`, `where`, `filterOne` etc. These are typed to return data as `TEntity` or `T` if its a `SalesforceRepositoryBase<T>`.

There are a number of protected methods on the base class to update salesforce i.e. `insertItem`, `insertAll`, `updateAll`, etc. These are currently typed to the salesforce type `Partial<T>`. This has proved fine for now, however theoretically, the update create types may require different structures that the gets so the base class may require extending to allow different types to be inserted.

Salesforce fields that are queried are defined in `salesforceFieldNames` property. Simple fields are the field name as it is set up  for example `Acc_CompetitionType__c` and relationships `Acc_ProjectId__r.Acc_CompetitionType__c`. Pick list values are reference as properties and their display name is car be retrieved using `toLabel(Acc_ProjectStatus__c) ProjectStatus` which is aliased as `ProjectStatus`.

Relationships return objects in the result. eg

fields 

	[
		"ID", 
		"Acc_PartnerName__c", 
		"Acc_ProjectId__r.Id", 
		"Acc_ProjectId__r.Acc_CompetitionType__c"
	]

returns the object

    {
    	ID:string,
    	Acc_PartnerName__c: string,
    	Acc_ProjectId__r: {
    		Id: string, 
    		Acc_CompetitionType__c: string
    	}
    }

Date Times are returned by salesforce as ISO dates.

Dates are returned in the format `yyyy-MM-dd`

There is a clock helper to convert dates in the base mapper or in the context for commands an queries to use so should not be done by code in the repository.

### Mappers ###

Mappers for use in the salesforce repositories inherit from SalesforceBaseMapper<TSalesforce, TEntity> and allow for salesforce specific shapes to be mapped to more general entity shapes.

### Connection ###

Salesforce calls are made using the library `jsforce` [https://jsforce.github.io/](https://jsforce.github.io/)
Security provided using JWT Token exchange. See confluence for details.
