// application view model
function viewModel1() {

    // Save this pointer
    var self = this;

    // generate some random data
    function getData(count) {
        var countries = 'US,Germany,UK,Japan,Italy,Greece'.split(','),
            data = new wijmo.collections.ObservableArray();
        for (var i = 0; i < count; i++) {
            data.push({
                id: i,
                country: countries[i % countries.length],
                date: new Date(2014, i % 12, i % 28),
                amount: Math.random() * 10000,
                active: i % 4 == 0
            });
        }
        return data;
    }

    // expose data as a CollectionView (to get updates on changes)
    this.data = new wijmo.collections.CollectionView(getData(100));

    // initialize selection mode
    this.selectionMode = ko.observable('CellRange');

    // expose the data as a CollectionView to show grouping
    this.cvGroup = new wijmo.collections.CollectionView(getData(100));
    this.groupBy = ko.observable('');

    // update CollectionView group descriptions when groupBy changes
    this.groupBy.subscribe(function(oldValue) {
        var cv = self.cvGroup;
        cv.groupDescriptions.clear();
        if (self.groupBy()) {
            var groupNames = self.groupBy().split(',');
            for (var i = 0; i < groupNames.length; i++) {
                var groupName = groupNames[i];
                if (groupName == 'date') { // group dates by year
                    var groupDesc = new wijmo.collections.PropertyGroupDescription(groupName, function (item, prop) {
                        return item.date.getFullYear();
                    });
                    cv.groupDescriptions.push(groupDesc);
                } else if (groupName == 'amount') { // group amounts in ranges
                    var groupDesc = new wijmo.collections.PropertyGroupDescription(groupName, function (item, prop) {
                        return item.amount >= 5000 ? '> 5,000' : item.amount >= 500 ? '500 to 5,000' : '< 500';
                    });
                    cv.groupDescriptions.push(groupDesc);
                } else { // group everything else by value
                    var groupDesc = new wijmo.collections.PropertyGroupDescription(groupName);
                    cv.groupDescriptions.push(groupDesc);
                }
            }
        }
    });

    // expose the data as a CollectionView to show filtering
    this.filter = ko.observable('');
    var toFilter, lcFilter;
    this.cvFilter = new wijmo.collections.CollectionView(getData(100));

    // holds the cvFilter.currentItem 
    this.cvFilterCurrentItem = ko.observable(this.cvFilter.currentItem);

    // updates the cvFilterCurrentItem observable
    this.cvFilter.currentChanged.addHandler(function () {
        self.cvFilterCurrentItem(self.cvFilter.currentItem)
    });
    this.cvFilter.filter = function (item) { // ** filter function
        if (self.filter()) {
            return item.country.toLowerCase().indexOf(lcFilter) > -1;
        }
        return true;
    };
    this.filter.subscribe(function (oldValue) { // ** refresh view when filter changes
        if (toFilter) {
            clearTimeout(toFilter);
        }
        toFilter = setTimeout(function () {
            lcFilter = self.filter().toLowerCase();
            self.cvFilter.refresh();
        }, 500);
    });

    // expose the data as a CollectionView to show paging
    var cvPaging = new wijmo.collections.CollectionView(getData(100));

    // expose it as an observable to allow chnge notificasions forcing
    // re-read of the child properties by consumers
    this.cvPaging = ko.observable(cvPaging);

    // set page size
    cvPaging.pageSize = 10;

    // on any collection change, send a change notification for the cvPaging 
    // observable to force re-reading of the child properties by consumers
    function notifyCvPagingUpdated () {
        self.cvPaging.valueHasMutated();
    }
    cvPaging.collectionChanged.addHandler(notifyCvPagingUpdated);
    cvPaging.currentChanged.addHandler(notifyCvPagingUpdated);
    cvPaging.pageChanged.addHandler(notifyCvPagingUpdated);


    // get the color to be used for displaying an amount
    this.getAmountColor = function (amount) {
        if (amount < 4000) return 'darkred';
        if (amount < 6000) return 'black';
        return 'darkgreen';
    }

    // Format the specified value using according to the specified format.
    this.format = function (value, format) {
        return wijmo.Globalize.format(ko.unwrap(value), format);
    }


    // hierarchical data
    this.treeData = [
        { name: '\u266B Adriane Simione', items: [
            { name: '\u266A Intelligible Sky', items: [
                { name: 'Theories', length: '2:02' },
                { name: 'Giant Eyes', length: '3:29' },
                { name: 'Jovian Moons', length: '1:02' },
                { name: 'Open Minds', length: '2:41' },
                { name: 'Spacetronic Eyes', length: '3:41' }]
            }
        ]},
        { name: '\u266B Amy Winehouse', items: [
            { name: '\u266A Back to Black', items: [
                { name: 'Addicted', length: '1:34' },
                { name: 'He Can Only Hold Her', length: '2:22' },
                { name: 'Some Unholy War', length: '2:21' },
                { name: 'Wake Up Alone', length: '3:43' },
                { name: 'Tears Dry On Their Own', length: '1:25' }]
            },
            { name: '\u266A Live in Paradiso', items: [
                { name: "You Know That I'm No Good", length: '2:32' },
                { name: 'Wake Up Alone', length: '1:04' },
                { name: 'Valerie', length: '1:22' },
                { name: 'Tears Dry On Their Own', length: '3:15' },
                { name: 'Rehab', length: '3:40' }]
            }]
        },
        { name: '\u266B Black Sabbath', items: [
            { name: '\u266A Heaven and Hell', items: [
                { name: 'Neon Knights', length: '3:03' },
                { name: 'Children of the Sea', length: '2:54' },
                { name: 'Lady Evil', length: '1:43' },
                { name: 'Heaven and Hell', length: '2:23' },
                { name: 'Wishing Well', length: '3:22' },
                { name: 'Die Young', length: '2:21' }]
            },
            { name: '\u266A Never Say Die!', items: [
                { name: 'Swinging The Chain', length: '4:32' },
                { name: 'Breakout', length: '3:54' },
                { name: 'Over To You', length: '2:43' },
                { name: 'Air Dance', length: '1:34' },
                { name: 'Johnny Blade', length: '1:02' },
                { name: 'Never Say Die', length: '2:11' }]
            },
            { name: '\u266A Paranoid', items: [
                { name: 'Rat Salad', length: '3:44' },
                { name: 'Hand Of Doom', length: '4:21' },
                { name: 'Electric Funeral', length: '2:12' },
                { name: 'Iron Man', length: '3:22' },
                { name: 'War Pigs', length: '3:13' }]
            }]
        },
        { name: '\u266B Brand X', items: [
            { name: '\u266A Unorthodox Behaviour', items: [
                { name: 'Touch Wood', length: '2:54' },
                { name: 'Running of Three', length: '1:34' },
                { name: 'Unorthodox Behaviour', length: '2:23' },
                { name: 'Smacks of Euphoric Hysteria', length: '3:12' },
                { name: 'Euthanasia Waltz', length: '2:22' },
                { name: 'Nuclear Burn', length: '4:01' }]
            }]
        }
    ];
};
