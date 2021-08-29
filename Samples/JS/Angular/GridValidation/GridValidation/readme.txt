GridValidation
---------------------------------------------------------------------
Shows how to add validation to the FlexGrid.

To support validation in non-form elements, such as the FlexGrid and
other controls, we added a "getError" property to the CollectionView
class. This is conceptually similar to .NET's INotifyDataErrorInfo
interface.

To add validation support to a CollectionView, set the getError 
property to a callback function that takes a data item and a property 
name as parameters, and returns a string with an error description 
(or null if there are no errors).

Once you define the getError callback on a CollectionView, any control 
bound to the collection may use it to validate items being loaded or edited.

The FlexGrid uses the validation logic in the data source to:

- Automatically highlight errors by adding the ‘wj-state-invalid’ 
pseudo-class to row headers and to any cells that contain errors, and

- Keeps the grid in edit mode when users enter invalid data into cells.


