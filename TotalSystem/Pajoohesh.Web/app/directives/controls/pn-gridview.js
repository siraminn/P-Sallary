define(['directives/controls/pnControls'], function (control) {
    control.directive("pnGridview", ["$window", "$parse", "localStorageService", "AuthToken", e]);
    function e($window, $parse, localStorageService, tokenKey) {
        return {
            restrict: 'EA',
            replace: false,
            scope: {
                gridConfig: "=config",
                gridColumns: "=columns",
                gridSchema: "=schema",
                toolbars: "=",
                selecteditems: "=",
                parameters: "=",
                api: "=",
                onKendoReady: '&',
                onDblClick: '&',
                onKendoDataBound: '&',
                onSelectRow: "&"
            },
            template: function (element, attrs) {
                return '<div kendo-grid="kendoGrid"  class="k-rtl" k-options="gridOptions"></div>';
            },
            link: function (scope, element, attrs) {

                var getColumns = function (columns) {
                    //TODO dehghan Change This. 
                    //Remove This cause of Sajjad Order
                    return columns;
                    var cols = columns;
                    var selectedColumn = [{ template: "<input style='float:left' type='checkbox' class='checkbox' />", width: 25 }];
                    cols = selectedColumn.concat(cols);
                    var commandColumns = [
                        { width: 100 }
                    ];
                    return cols.concat(commandColumns);
                };

                function initilalizeGrid() {
                   
                    scope.gridInitialized = true;
                    scope.gridConfig.autoSize = scope.gridConfig.autoSize || true;
                    scope.gridOptions = {
                        dataSource: {
                            transport: {
                                type: "jsonp",
                                read:
                                {
                                    url: scope.gridConfig.inlineOperationalUrl.read.url,
                                    data: scope.gridConfig.inlineOperationalUrl.read.data,
                                    type: "POST",
                                    contentType: "application/json",
                                    beforeSend: function (req) {
                                        req.setRequestHeader('Auth-Token', localStorageService.get(tokenKey));
                                    }
                                },
                                update:
                                {
                                    url: scope.gridConfig.inlineOperationalUrl.update,
                                    type: "PUT",
                                    contentType: "application/json"
                                },
                                destroy:
                                {
                                    url: scope.gridConfig.inlineOperationalUrl.destroy,
                                    type: "DELETE",
                                    contentType: "application/json"
                                },
                                create:
                                {
                                    url: scope.gridConfig.inlineOperationalUrl.create,
                                    type: "POST",
                                    contentType: "application/json"
                                },
                                parameterMap: function (data, operation) {
                                    if (operation === "read") {
                                        console.log(data);
                                        //return encodeURI(JSON.stringify(data));
                                        return angular.toJson(data);
                                    }
                                }
                            },
                            error: function (e) {


                            },
                            requestStart: function () {
                                kendo.ui.progress($("#fonixloading"), true);
                            },
                            requestEnd: function (result) {
                                kendo.ui.progress($("#fonixloading"), false);

                            },
                            batch: attrs.batch,
                            pageSize: attrs.pageSize ? attrs.pageSize : 10,
                            //serverPaging: attrs.serverpaging ? attrs.serverpaging : true,
                            //serverSorting: attrs.serverSorting ? attrs.serversorting : true,
                            //serverFiltering: attrs.serverfiltering ? attrs.serverfiltering : true,
                            serverPaging: true,
                            serverFiltering: true,
                            serverSorting: true,
                            schema: scope.gridSchema,
                        },
                        resizable: true,
                        height: 300,
                        pageable: {
                            refresh: true,
                            pageSizes: true
                        },
                        autoBind: typeof (scope.gridConfig.autoBind) === "undefined" ? true : scope.gridConfig.autoBind,
                        dataBound: function (arg) {
                            try {
                                scope.onKendoDataBound({ kendo: scope.kendoGrid });
                            } catch (e) {
                            }
                            if (scope.gridConfig.autoSize === true) {
                                var grid = scope.kendoGrid;
                                if(grid.dataSource.data().length > 0)
                                    for (var iC = 0; iC < grid.columns.length; iC++) {
                                        grid.autoFitColumn(iC);
                                    }
                            }
                            var rows = this.dataSource.view();
                            for (var i = 0; i < rows.length; i++) {
                                if (rows[i].IsRead == undefined)
                                    break;
                                if (!rows[i].IsRead) {
                                    this.tbody.find("tr[data-uid='" + rows[i].uid + "']").addClass("unreadclass");
                                }
                            }
                            if (scope.disabledItem) {

                                var selectedItems = [];
                                scope.selecteditems = selectedItems;
                                scope.disabledItem.addClass("toolbarDisabledCommandButton");
                                var getter = $parse(attrs.isSelected);
                                var setter = getter.assign;
                                setter(scope.$parent, "false");
                                scope.$apply();
                            }
                        },
                        navigatable: true,
                        groupable: false,
                        editable: false,

                        filterable: true, //scope.gridConfig.filterable ? scope.gridConfig.filterable : false,
                        scrollable: attrs.scrollable ? attrs.scrollable : true,
                        sortable: attrs.sortable ? attrs.sortable : true,
                        columns: getColumns(scope.gridColumns),
                        // TODO Dehghan Change This
                        // Case of Sajjad Order.
                        // selectable: "multiple",
                        selectable: "row",
                        change: function () {
                            if (attrs.isSelected) {
                                var getter = $parse(attrs.isSelected);
                                var setter = getter.assign;
                                setter(scope.$parent, "true");
                                scope.disabledItem = $(".toolbarDisabledCommandButton");
                                $("a").removeClass("toolbarDisabledCommandButton");

                            }
                            var selectedRows = this.select();
                            var selectedItems = [];
                            for (var i = 0; i < selectedRows.length; i++) {
                                var dataItem = this.dataItem(selectedRows[i]);
                                selectedItems.push(dataItem);
                            }

                            scope.selecteditems = selectedItems;
                            scope.onSelectRow({ data: dataItem });
                            scope.$apply();

                        }

                    };
                    if (scope.gridConfig.group != null && scope.gridConfig.group.fieldName != null) {
                        scope.gridOptions.dataSource.group = { field: scope.gridConfig.group.fieldName };
                    }
                }

                if (scope.gridConfig) {
                    initilalizeGrid();
                }
                scope.$parent.$watch(scope.gridConfig, function (newparameter, oldparameter) {
                   
                    if (!scope.gridInitialized) {
                        initilalizeGrid();
                    }
                    if (newparameter) {

                        scope.gridOptions.dataSource.transport = {
                            type: "jsonp",
                            read:
                            {
                                url: scope.gridConfig.inlineOperationalUrl.read,
                                data: scope.gridConfig.inlineOperationalUrl.read.data,
                                type: "POST",
                                contentType: "application/json"
                            },
                            update:
                            {
                                url: scope.gridConfig.inlineOperationalUrl.update,
                                type: "PUT",
                                contentType: "application/json"
                            },
                            destroy:
                            {
                                url: scope.gridConfig.inlineOperationalUrl.destroy,
                                type: "DELETE",
                                contentType: "application/json"
                            },
                            create:
                            {
                                url: scope.gridConfig.inlineOperationalUrl.create,
                                type: "POST",
                                contentType: "application/json"
                            },
                            parameterMap: function (data) {

                                data.parameters = scope.parameters;
                                console.log(data);
                                //return JSON.stringify(data);
                                return angular.toJson(data);
                            }
                        };

                        scope.kendoGrid.setOption(scope.gridOptions);
                    }
                });
                scope.$watch(attrs.isSelected, function (newparameter, oldparameter) {
                    if (newparameter) {

                        $("p").removeClass(".toolbarDisabledCommandButton");
                    }
                });
                element.on("click", ".checkbox", selectRow);

                //on dataBound event restore previous selected rows:
                element.on('click', '.selected', selectRow);
                //function () {
                /* remark: review this code.
                var checked = $(this).is(':checked');
                var grid = element.data('kendoGrid');
                var row = $(this).closest('tr');
                //var selection = grid.select(); //single selection
                //var rowData = grid.dataItem(selection);
                //alert(angular.toJson(rowData));
                if (checked) {
                    //dataItem.css("background-color", "red");
                    grid.trigger("change");
                } else {
                    //dataItem.css("background-color", "green");
                    dataItem.removeClass("k-state-selected");
                    //grid.trigger("change");
                }
                */
                //});


                element.on("keyup", function (ke) {


                    var elem = $(ke.target);

                    var el = elem.find('.k-state-focused');
                    el.removeClass('k-state-focused');
                    el.removeAttr('aria-describedby');


                    ke.preventDefault();
                    ke.stopImmediatePropagation();
                    var kGrid, curRow, newRow;
                    kGrid = scope.kendoGrid;

                    //get currently selected row
                    curRow = kGrid.select();

                    //abort if no row selected
                    if (!curRow.length)
                        return false;

                    //get newRow up or down.
                    if (ke.which == 38) {
                        newRow = curRow.prev();
                    } else if (ke.which == 40) {
                        newRow = curRow.next();
                    } else {
                        return false;
                    }

                    //Top or Bottom exceeded, abort.
                    if (!newRow.length)
                        return false;

                    //Select new row
                    kGrid.select(newRow);
                    //var elem = $(e.target);

                    //if (e.keyCode == 38 /* up */) {


                    //    var el = elem.find('.k-state-selected');
                    //    var tBody = el.closest('tbody');
                    //    var prevEl = el.prev('tr');

                    //    if(tBody.find(prevEl).length > 0){
                    //        el.removeClass("k-state-selected");
                    //        el.attr('aria-selected', 'false');
                    //        prevEl.attr('aria-selected', 'true');
                    //        prevEl.addClass("k-state-selected");
                    //    } else {
                    //        scope.kendoGrid.select(scope.kendoGrid.tbody.find('tr:first'));
                    //        scope.kendoGrid.tbody.find('tr:first').focus();
                    //    }

                    //} else if (e.keyCode == 40 /* down */) {
                    //    var el = elem.find('.k-state-selected');
                    //    var tBody = el.closest('tbody');
                    //    var prevEl = el.next('tr');
                    //    if(tBody.find(prevEl).length > 0){
                    //        el.removeClass("k-state-selected");
                    //        el.attr('aria-selected', 'false');
                    //        prevEl.attr('aria-selected', 'true');
                    //        prevEl.addClass("k-state-selected");
                    //    }
                    //}
                });
                element.on("click", "td", function (e) {
                    //var grid = element.data('kendoGrid');
                    //grid.tbody.find("tr").not('.k-state-selected').find("td:first input").removeAttr("checked");
                    //grid.tbody.find("tr.k-state-selected").find("td:first input").prop("checked", true);
                });
                element.on("dblclick", "tr", function (e) {
                    scope.onDblClick({ items: scope.selecteditems });
                });
                scope.api = {
                    refresh: function(){},
                    setActive: function(){}
                };
                scope.$on('kendoWidgetCreated', function () {
                    scope.onKendoReady({ kendo: scope.kendoGrid, options: scope.gridOptions });
                    scope.kendoGrid.tbody.attr("tabindex", 0);
                    var gridOverlay;
                    scope.api = {
                        refresh: function () {
                            scope.kendoGrid.dataSource.read();
                        },
                        setActive: function (isActive) {

                            if (isActive && gridOverlay) {
                                gridOverlay.remove();
                                gridOverlay = null;
                                return;

                            }
                            if (!isActive && !gridOverlay) {
                                gridOverlay = $("<div  />").css({
                                    position: "absolute",
                                    width: "100%",
                                    height: "100%",
                                    left: 0,
                                    top: 2,
                                    cursor: "not-allowed",
                                    opacity: 0.3,
                                    background: "#ffffff",
                                    zIndex: 1000000
                                });
                                gridOverlay.appendTo(scope.kendoGrid.element);
                            }
                        }
                    };
                })

                //var checkedIds = {};

                //on click of the checkbox:

                function selectRow() {

                    var checked = this.checked;
                    row = $(this).closest("tr");

                    var rowData = scope.kendoGrid.dataItem(row);
                    scope.onSelectRow({ data: rowData });

                    //if (checked) {
                    //    row.addClass("k-state-selected");
                    //} else {
                    //    row.removeClass("k-state-selected");
                    //}
                    //elem.trigger("change");
                }
            }
        };
    }
});