define(["areas/userManagement/app.areas.userManagement"], function (userManagement) {
    userManagement.register.controller("setPermissionToRoleController", ["$scope", "$http", "$timeout", "pn.remote.service", "pn.dialog", "pn.focus",
        "pn.enum", "Notification", "$rootScope", "pn.kendo.config", "userManagementWebAccess", "cache", "pn.errorHandler", "pn.message", "pn.dialog", "$state", "localStorageService",
        function ($scope, $http, $timeout, remoteService, dialog, focus, pnenum, notify, $rootScope, kendoConfig, WebAccess, cache, errorHandler, message, dialog, $state, localStorageService) {

            var tokenKey = 'Auth-Token';
            $scope.kendo = null;

            $scope.treeviewOnReady = function (kendo, option) {
                $scope.kendo = kendo;
            };

            var updateUrl = WebAccess + "api/Role/UpdateRolePermission";

            var initTree = function () {
                // #region ----- Tree Config -----  
                $scope.treeviewConfig = kendoConfig.getTreeviewConfig();
                $scope.treeviewConfig.dataSource = new kendo.data.HierarchicalDataSource({
                    transport: {
                        read: {
                            url: function (options) {
                                //return WebAccess + "api/Role/GetPermisionTreeStructure?id=" + cache.umsCache.selectedRole.Key;
                                return kendo.format("{0}api/Role/GetPermisionTreeStructure?id={1}", WebAccess, cache.umsCache.selectedRole.Key);
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


                $scope.treeviewConfig.checkboxes = {
                    checkChildren: false,
                };

                $scope.treeviewConfig.dataTextField = ["Title"];
                $scope.treeviewConfig.loadOnDemand = false;

                //#endregion ----- Tree Config -----  
            }

            $scope.doCancel = function () {
                $scope.redirectToList();
                return true;
            };

            $scope.redirectToList = function () {
                $state.go('home.tab.role.listRole');
            };

            // Initilize Form Datau
            $scope.initializeForm = function () {
                $scope.roleTotalCode = {};
                $scope.$emit("toolbar:DoRibbonFalse");

                if (cache.umsCache != null
                            && cache.umsCache.selectedRole != null
                            && cache.umsCache.selectedRole.Type != null
                            && cache.umsCache.selectedRole.Type == pnenum.roleState.role) {

                    initTree();

                    if ($scope.kendo != null)
                        $scope.kendo.dataSource.read();

                    $http.post(WebAccess + "api/Role/GetRoleSingleWithTotalCode?id=" + cache.umsCache.selectedRole.Key)
                        .success(function (result) {
                            $scope.roleTotalCode = result;
                        })
                        .error(function (response) { });
                }
                else {
                    dialog.showMessage(message.error, message.noSelectedRole);
                    $scope.redirectToList();
                }
            }

            $scope.doBtnUser3 = function () {
                $scope.saveChanges();
            }

            $scope.doApplay = function () {
                $scope.saveChanges();
                $scope.redirectToList();
                return true;
            };

            $scope.doInsert = function () {
                return true;
            };

            function init() {
                $scope.initializeForm();
            };

            init();

            var currentName = $state.current.name;
            $rootScope.$on('$stateChangeSuccess',
                function (event, toState, toParams, fromState, fromParams) {
                    if (currentName === toState.name) {
                        init();
                    }
                }
            );

            $scope.saveChanges = function () {
                remoteService.post($scope.kendo.dataSource._view, updateUrl).then(function (result) {
                    if (result.Success) {
                        notify.success({ message: message.successfullInsert, title: message.insert });
                    }
                    else {
                        errorHandler.ShowError(result);
                    }
                });
            };

            // #region ----- Standrad From Events -----

            // #endregion ----- Standrad From Events -----

            // #region ----- Custom Events -----

            // #endregion ----- Custom Events -----

            // #region ----- Standard Events -----

            // #endregion ----- Standard Events -----
        }]);
});


