define(["areas/userManagement/app.areas.userManagement"], function (userManagement) {
    userManagement.register.controller("setOrganizationController", ["$scope", "$timeout", "pn.remote.service", "pn.dialog", "pn.focus",
        "pn.enum",  "Notification", "$window", "$rootScope","userManagementWebAccess",
        function ($scope, $timeout, remoteService, dialog, focus, pnenum, notify, $window, $rootScope,WebAccess) {

            $scope.t = { kendoOptions: {} }

            var reloadGrid = function () {
                $scope.gridApi.refresh();
            }

            // Initilize Form Datau
            $scope.initializeForm = function () {
                $scope.disableUserForm = true;
                $scope.formOperationState = pnenum.pnformstate.browse;
            } 

            $scope.initializeForm();

            // #region ----- Standrad From Events -----

            // #endregion ----- Standrad From Events -----

            // #region ----- Custom Events -----

            // #endregion ----- Custom Events -----

            // #region ----- Standard Events -----

            // #endregion ----- Standard Events -----

            // #region ----- Grid Config -----  
          
            debugger;
            var data = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: {
                        url: WebAccess + "api/GroupRole/GetGroupRoleWithRolesQuery",
                        contentType: "application/json"
                    }
                },
                schema: {
                    model: {
                        children: "RoleResults"
                    }
                }
            });

            $scope.options = {
                checkboxes: {
                    checkChildren: true,
                }
                ,
                dataSource: data
                , // the issue: only shows top level nodes
                dataTextField: ["Title"],
                loadOnDemand: false
            }

            // #endregion ----- grid Config -----  

        }]);
});


