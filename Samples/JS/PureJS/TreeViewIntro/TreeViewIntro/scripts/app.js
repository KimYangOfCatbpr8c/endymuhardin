onload = function () {

    // sample TreeView data
    var items = [
        { header: 'Electronics', img: 'resources/electronics.png', items: [
            { header: 'Trimmers/Shavers' },
            { header: 'Tablets' },
            { header: 'Phones', img: 'resources/phones.png', items: [
                { header: 'Apple' },
                { header: 'Motorola', newItem: true },
                { header: 'Nokia' },
                { header: 'Samsung' }]
            },
            { header: 'Speakers', newItem: true },
            { header: 'Monitors' }]
        },
        { header: 'Toys', img: 'resources/toys.png', items: [
            { header: 'Shopkins' },
            { header: 'Train Sets' },
            { header: 'Science Kit', newItem: true },
            { header: 'Play-Doh' },
            { header: 'Crayola' }]
        },
        { header: 'Home', img: 'resources/home.png', items: [
            { header: 'Coffeee Maker' },
            { header: 'Breadmaker', newItem: true },
            { header: 'Solar Panel', newItem: true },
            { header: 'Work Table' },
            { header: 'Propane Grill' }]
        }
    ];

    // use a separate copy for editing (TFS 242748)
    var editableItems = JSON.parse(JSON.stringify(items));

    // create and bind the 'Getting Started' TreeView
    var tv = new wijmo.nav.TreeView('#tv', {
        displayMemberPath: 'header',
        childItemsPath: 'items',
        itemsSource: items,
    });

    // handle collapse/expand buttons
    document.getElementById('btnCollapse').addEventListener('click', function () {
        tv.collapseToLevel(0);
    });
    document.getElementById('btnExpand').addEventListener('click', function () {
        tv.collapseToLevel(1000);
    });

    // handle checkboxes
    document.getElementById('chkAutoCollapse').addEventListener('change', function (e) {
        tv.autoCollapse = e.target.checked;
    });
    document.getElementById('chkIsAnimated').addEventListener('change', function (e) {
        tv.isAnimated = e.target.checked;
    });
    document.getElementById('chkExpandOnClick').addEventListener('change', function (e) {
        tv.expandOnClick = e.target.checked;
    });

    // create and bind the 'Navigation' TreeView
    var tvNav = new wijmo.nav.TreeView('#tvNav', {
        displayMemberPath: 'header',
        childItemsPath: 'items',
        itemsSource: items,
        itemClicked: function (s, e) {
            document.getElementById('tvNavItem').innerHTML = 
                'Navigating to <b>*** ' + s.selectedItem.header + ' ***</b>';
        }
    });

    // create and bind the 'Accordion' TreeView
    var tvAccordion = new wijmo.nav.TreeView('#tvAccordion', {
        isContentHtml: true,
        autoCollapse: true,
        itemsSource: [
            { header: 'Angular', items: [
                { header: '<a href="ng/intro">Introduction</a>' },
                { header: '<a href="ng/samples">Samples</a>' },
                { header: '<a href="ng/perf">Performance</a>' }
            ]},
            { header: 'React', items: [
                { header: '<a href="rc/intro">Introduction</a>' },
                { header: '<a href="rc/samples">Samples</a>' },
                { header: '<a href="rc/perf">Performance</a>' }
            ]},
            { header: 'Vue', items: [
                { header: '<a href="vue/intro">Introduction</a>' },
                { header: '<a href="vue/samples">Samples</a>' },
                { header: '<a href="vue/perf">Performance</a>' }
            ]},
            { header: 'Knockout', items: [
                { header: '<a href="ko/intro">Introduction</a>' },
                { header: '<a href="ko/samples">Samples</a>' },
                { header: '<a href="ko/perf">Performance</a>' }
            ]},
        ]
    });

    /* handle clicks on accordion items */
    tvAccordion.hostElement.addEventListener('click', function (e) {
        if (e.target.tagName == 'A') {
            document.getElementById('tvAccordionItem').innerHTML =
                'Navigating to <b>*** ' + e.target.href + ' ***</b>';
            e.preventDefault();
        }
    });

    // create and bind the 'Images' TreeView
    var tvImg = new wijmo.nav.TreeView('#tvImg', {
        displayMemberPath: 'header',
        imageMemberPath: 'img',
        childItemsPath: 'items',
        itemsSource: items
    });

    // create and bind the 'Checkboxes' TreeView
    var tvChk = new wijmo.nav.TreeView('#tvChk', {
        displayMemberPath: 'header',
        childItemsPath: 'items',
        showCheckboxes: true,
        itemsSource: items,
        checkedItemsChanged: function (s, e) {
            var items = s.checkedItems,
                msg = '';
            if (items.length) {
                msg = '<p><b>Checked Items:</b></p><ol>\r\n';
                for (var i = 0; i < items.length; i++) {
                    msg += '<li>' + items[i].header + '</li>\r\n';
                }
                msg += '</ol>';
            }
            document.getElementById('tvChkStatus').innerHTML = msg;
        }
    });

    // check/uncheck all nodes
    document.getElementById('btnCheckAll').addEventListener('click', function () {
        tvChk.checkAllItems(true);
    });
    document.getElementById('btnUncheckAll').addEventListener('click', function () {
        tvChk.checkAllItems(false);
    });

    // save/restore checked state
    var saveCheckedItems = null;
    document.getElementById('btnSaveState').addEventListener('click', function () {
        saveCheckedItems = tvChk.checkedItems;
    });
    document.getElementById('btnRestoreState').addEventListener('click', function () {
        tvChk.checkedItems = saveCheckedItems || [];
    });

    // create and bind the 'CSS' TreeView
    var tvCss = new wijmo.nav.TreeView('#tvCss', {
        displayMemberPath: 'header',
        imageMemberPath: 'img',
        childItemsPath: 'items',
        itemsSource: items
    });

    // toggle style when user checks the checkbox
    document.getElementById('tvCssCheck').addEventListener('change', function(e) {
        wijmo.toggleClass(tvCss.hostElement, 'custom-tree', e.target.checked);
    });

    // create and bind the 'Disable Items' TreeView
    var tvDisable = new wijmo.nav.TreeView('#tvDisable', {
        displayMemberPath: 'header',
        childItemsPath: 'items',
        itemsSource: items,
    });

    // disable selected node
    document.getElementById('btnDisableNode').addEventListener('click', function () {
        var nd = tvDisable.selectedNode;
        if (nd) {
            nd.isDisabled = true;
        }
    });

    // enable all nodes
    document.getElementById('btnEnableAllNodes').addEventListener('click', function () {
        for (var nd = tvDisable.getFirstNode(); nd; nd = nd.next()) {
            nd.isDisabled = false;
        }
    });

    // create and bind the 'Custom Content' TreeView
    var tvFmtItem = new wijmo.nav.TreeView('#tvFmtItem', {
        displayMemberPath: 'header',
        childItemsPath: 'items',
        itemsSource: items,
        formatItem: function (s, e) {
            if (e.dataItem.newItem) {
                e.element.innerHTML +=
                    '<img style="margin-left:6px;transform:rotate(-30deg)" src="resources/new.png"/>';
            }
        }
    });

    // create and bind the drag/drop TreeView
    var allowDraggingParentNodes = true,
        allowDroppingIntoEmpty = true;
    var tvDragDrop = new wijmo.nav.TreeView('#tvDragDrop', {
        displayMemberPath: 'header',
        childItemsPath: 'items',
        imageMemberPath: 'img',
        showCheckboxes: true,
        allowDragging: true,
        itemsSource: items,

        // use dragStart event to honor the allowDraggingParentNodes setting
        // by setting the 'cancel' event parameter to true
        dragStart: function (s, e) {
            if (e.node.hasChildren) {
                if (!allowDraggingParentNodes) {
                    e.cancel = true; // prevent dragging parent nodes
                } else {
                    e.node.isCollapsed = true; // collapse parent nodes when dragging
                }
            }
        },

        // use dragOver event to honor the allowDroppingIntoEmpty setting
        // by changing the 'position' event parameter to 'Before'
        dragOver: function (s, e) {
            if (!allowDroppingIntoEmpty &&
                !e.dropTarget.hasChildren &&
                 e.position == wijmo.nav.DropPosition.Into) {
                e.position = wijmo.nav.DropPosition.Before;
            }
        },
    });

    // toggle drag/drop
    document.getElementById('allowDragging').addEventListener('change', function (e) {
        tvDragDrop.allowDragging = e.target.checked;
    });
    document.getElementById('allowDraggingParentNodes').addEventListener('change', function (e) {
        allowDraggingParentNodes = e.target.checked;
    });
    document.getElementById('allowDroppingIntoEmpty').addEventListener('change', function (e) {
        allowDroppingIntoEmpty = e.target.checked;
    });

    // create trees to drag/drop between
    var tvDragDrop1 = new wijmo.nav.TreeView('#tvDragDrop1', {
        displayMemberPath: 'header',
        childItemsPath: 'items',
        allowDragging: true,
        dragOver: dragOverBetweenTrees,
        itemsSource: [
            { header: 'Item 1.1' },
            { header: 'Item 1.2' },
            { header: 'Item 1.3' },
            { header: 'Item 1.4' },
            { header: 'Item 1.5' }
        ]
    });
    var tvDragDrop2 = new wijmo.nav.TreeView('#tvDragDrop2', {
        displayMemberPath: 'header',
        childItemsPath: 'items',
        allowDragging: true,
        dragOver: dragOverBetweenTrees,
        itemsSource: [
            { header: 'Item 2.1' },
            { header: 'Item 2.2' },
            { header: 'Item 2.3' },
            { header: 'Item 2.4' },
            { header: 'Item 2.5' }
        ]
    });

    // allow drag/drop between tvDragDrop1 and tvDragDrop2
    function dragOverBetweenTrees(s, e) {
        var t1 = e.dragSource.treeView,
            t2 = e.dropTarget.treeView;
        if (t1 == tvDragDrop1 || t1 == tvDragDrop2) {
            if (t2 == tvDragDrop1 || t2 == tvDragDrop2) {
                e.cancel = false;
            }
        }
    }

    // demonstrate editing support
    var tvEdit = new wijmo.nav.TreeView('#tvEdit', {
        displayMemberPath: 'header',
        childItemsPath: 'items',
        imageMemberPath: 'img',
        showCheckboxes: true,
        itemsSource: editableItems,
        isReadOnly: false,
        nodeEditStarting: function (s, e) {
            if (e.node.hasChildren) {
                e.cancel = true;
            }
        }
    });

    // demonstrate RTL support (no need to set any properties)
    var tvRtl = new wijmo.nav.TreeView('#tvRtl', {
        displayMemberPath: 'header',
        childItemsPath: 'items',
        imageMemberPath: 'img',
        showCheckboxes: true,
        allowDragging: true,
        itemsSource: items
    });

    // demonstrate lazy-loading
    var tvLazyLoad = new wijmo.nav.TreeView('#tvLazyLoad', {
        displayMemberPath: 'header',
        childItemsPath: 'items',
        itemsSource: [ // start with three lazy-loaded nodes
            { header: 'Lazy Node 1', items: [] },
            { header: 'Lazy Node 2', items: [] },
            { header: 'Lazy Node 3', items: [] }
        ],
        lazyLoadFunction: function (node, callback) {
            setTimeout(function () { // simulate http delay
                var result = [ // simulate result
                    { header: 'Another lazy node...', items: [] },
                    { header: 'A non-lazy node without children' },
                    { header: 'A non-lazy node with child nodes', items: [
                      { header: 'hello' },
                      { header: 'world' }
                    ]}
                ];
                callback(result); // return result to control
            }, 2500); // 2.5sec http delay
        }
    });

    // demonstrate lazy-loading with OData
    var nwindService = 'http://services.odata.org/V4/Northwind/Northwind.svc';
    var tvLazyLoadOData = new wijmo.nav.TreeView('#tvLazyLoadOData', {
        displayMemberPath: ['FullName', 'ShipName', 'Summary' ],
        childItemsPath: ['Orders', 'Order_Details'],
        lazyLoadFunction: function (node, callback) {

            switch (node.level) {

                // load orders for an employee
                case 0:
                    var url = 'Employees(' + node.dataItem.EmployeeID + ')/Orders';
                    var orders = new wijmo.odata.ODataCollectionView(nwindService, url, {
                        fields: 'OrderID,ShipName,ShipCountry'.split(','),
                        loaded: function () {
                            var items = orders.items.map(function (e) {
                                e.Order_Details = []; // lazy-order details
                                return e;
                            });
                            callback(items);
                        }
                    });
                    break;

                // load extended details for an order
                case 1:
                    var url = "Order_Details_Extendeds/?$filter=OrderID eq " + node.dataItem.OrderID;
                    var details = new wijmo.odata.ODataCollectionView(nwindService, url, {
                        fields: 'ProductName,ExtendedPrice'.split(','),
                        loaded: function () {
                            var items = details.items.map(function (e) {
                                e.Summary = wijmo.format('{ProductName}: {ExtendedPrice:c}', e);
                                return e;
                            });
                            callback(items);
                        }
                    });
                    break;

                // default
                default:
                    callback(null);
            }
        }
    });

    // first level: employees
    var employees = new wijmo.odata.ODataCollectionView(nwindService, 'Employees', {
        fields: 'EmployeeID,FirstName,LastName'.split(','),
        loaded: function () {
            var items = employees.items.map(function (e) {
                e.FullName = e.FirstName + ' ' + e.LastName;
                e.Orders = []; // lazy-load orders
                return e;
            });
            tvLazyLoadOData.itemsSource = items;
        }
    });
}