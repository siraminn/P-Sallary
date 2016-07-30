define(["areas/userManagement/app.areas.userManagement"], function (userManagement) {
    userManagement.register.controller("setRoleToUserController", ["$scope", "$timeout", "pn.remote.service", "pn.dialog", "pn.focus",
        "pn.enum", "Notification", "$rootScope", "hotkeys", "pn.kendo.config",
        "userManagementWebAccess", "cache", "$state", "pn.dialog", "pn.message", "pn.errorHandler", "$q",
        function ($scope, $timeout, remoteService, dialog, focus, pnenum, notify, $rootScope, 
        hotkeys, kendoConfig, WebAccess, cache, $state, dialog, message,errorHandler,$q) {

            var reloadGrid = function () {
                $scope.gridApi.refresh();
            }

            $scope.kendo = null;

            $scope.treeviewOnReady = function (kendo, option) {
                $scope.kendo = kendo;
            }; 

            // Initilize Form Datau
            $scope.initializeForm = function () {
               //برگشت به حالت اولیه دکمه ها
               $scope.$emit("toolbar:DoRibbonFalse");
               debugger;

                $scope.disableUserForm = true;
                $scope.formOperationState = pnenum.pnformstate.browse;

                if (cache.umsCache != null
                            && cache.umsCache.selectedUser != null
                            && cache.umsCache.selectedUser.Key != null )
                {
                    $scope.treeviewConfig = null;
                    $scope.treeviewConfig = kendoConfig.getTreeviewConfig();
                    $scope.treeviewConfig.onchange = "selectedItem = dataItem";

                    $scope.treeviewConfig.dataSource = new kendo.data.HierarchicalDataSource({
                        transport: {
                            read: {
                                url:function (options) {
                                        return kendo.format("{0}api/User/GetUserRoleTreeStructure?id={1}", WebAccess , cache.umsCache.selectedUser.Key);
                                    },
                                contentType: "application/json"
                            }
                        },
                        schema: {
                            model: {
                                children: "Items"
                            }
                        }
                    });

                    if ($scope.kendo !=null)
                        $scope.kendo.dataSource.read();
                }
                else {
                    dialog.showMessage(message.error, message.common.noSelectedUser);
                    $state.go('home.tab.user.listUser');
                }
            };

            function init() {
                $scope.initializeForm();
            };

            init();

            var currentName = $state.current.name;
            $rootScope.$on('$stateChangeSuccess',
                function (event, toState, toParams, fromState, fromParams) {
                    if (currentName === toState.name) {
                       //reloadGrid();
                        init();
                    }
                }
            );

            // #region ----- Standrad From Events -----

            $scope.doApplay = function () {
             var defferd = $q.defer();
             remoteService.post($scope.kendo.dataSource._view, WebAccess + "api/User/UpdateUserRole").then(function (result) {
                    if (result.Success) {
                        notify.success({ message: message.common.successfullInsert, title: message.common.insert });
                        defferd.resolve(true);
                    }
                    else {
                        errorHandler.ShowError(result);
                        defferd.resolve(false);
                    }
                });

                 defferd.promise;
                 $state.go('home.tab.user.listUser');
            };

            $scope.doInsert = function ()
            {
                return true;
            };
           
            $scope.doCancel = function ()
            {
                $state.go('home.tab.user.listUser');
                return true;
            };

            $scope.doBtnUser3 = function () {
                $scope.doApplay()  
            };


            // #endregion ----- Standrad From Events -----

            // #region ----- Custom Events -----

            // #endregion ----- Custom Events -----

            // #region ----- Standard Events -----

            // #endregion ----- Standard Events -----

            // #region ----- Tree Config -----  

         

            $scope.treeviewConfig.select = function (e)
            {
                //alert(e.sender.dataItem(e.node).Title)
                $scope.selectedNode = e.node;
                $scope.selectedItem = e.sender.dataItem(e.node);
            };

            $scope.treeviewConfig.checkboxes = {
                checkChildren: true,
            };

            $scope.treeviewConfig.dataTextField= ["Title"];
            $scope.treeviewConfig.loadOnDemand= false;
            // #endregion ----- Tree Config -----  

            $scope.saveTreeFields = function ()
            {
                var data = $scope.tree.dataSource._data;

                for (var i = 0, j = data.length; i < j; i++) {
                    checkChildren(data[i]);
                }

                function checkChildren(data) {
                    if (data.checked) {
                        data.checked = false;
                    }
                    if (data.items !== undefined) {
                        for (var i = 0, j = data.items.length; i < j; i++) {
                            checkChildren(data.items[i]);
                        }
                    }
                }

                $scope.tree.setDataSource(data)
            };

        }]);
});


