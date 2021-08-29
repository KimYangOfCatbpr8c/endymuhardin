PeriodicSunburst
------------------------------------------------------------------------------
Using the Sunburst control and a CollectionView to reorganize the periodic table.

The sample is a follow-up to the original PeriodicSunburst sample which used
a custom implementation of a data access layer (DAL) and multiple view
adapters to load periodic table element data and prepare it for display on
the Sunburst chart. This sample will utilize the Wijmo CollectionView
component instead of a custom implementation for data loading and conversion.

Please note that this is almost a total rewrite from the original sample (which
can be found here: http://demos.wijmo.com/5/PureJS/PeriodicSunburst/PeriodicSunburst/).
The HTML and CSS have been left mainly intact, but the JavaScript has been almost
completely rewritten to avoid polluting the global namespace and to be more
consistent overall. Lastly, the JavaScript was written without Browserify (or
any other module pattern, for that matter) from the beginning, making it more
clear to read from a pure JS perspective. I hope you enjoy!
