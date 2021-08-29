ServerCollectionView
------------------------------------------------------------------------------
Shows how to implement a CollectionView class that retrieves data from a server.

The sample implements a simple data service and a ServerCollectionView class 
that runs on the client.

The data service supports paging, sorting, and filtering on the server.
The sorting and filtering are implemented using the System.Data.DataTable 
class on the server.

The data service also provides CRUD support via a REST API similar to 
the one defined by the OData protocol.

The ServerCollectionView exposes this data service as a CollectionView
that can be used with all Wijmo controls.
