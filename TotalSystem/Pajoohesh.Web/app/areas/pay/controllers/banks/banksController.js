define(["areas/pay/app.areas.pay"], function (pay) {
    pay.register.controller("banksController", ["$scope", "pn.remote.service", "pn.focus", "Notification", "payWebAccess", "cache", "pn.message", "$state", "pn.dialog", "pn.errorHandler", "$q",
        function ($scope, remoteService, focus, notify, WebAccess, cache, message, $state, dialog, errorHandler, $q) {
            $scope.kendoGrid = null;
            $scope.onKenoReady = function (kendo, option) {
                $scope.kendoGrid = kendo;
                $scope.kendoGrid.dataSource.read();
            };

            $scope.doDelete = function () { return true; };

            $scope.doEdit = function () {
                return true;
            };

            $scope.doCancel = function () {
                alert(0);
            };

            $scope.doInsert = function () {
                var defferd = $q.defer();
                defferd.resolve(true);
                return defferd.promise;
            };

            $scope.doApplay = function () {
                alert(123);
            };

            // grid Config
            $scope.selectedItems = [];

            $scope.gridConfig = {
                inlineOperationalUrl: {
                    read: {
                        url: WebAccess + "api/Banks/GetAll",
                        data: function () {
                            return $scope.filterQuery;
                        }
                    }
                }
            };

            $scope.gridColumns = [
              {
                  field: 'Name',
                  editable: false,
                  title: "نام",
                  allownull: false
              },
               {
                   field: 'Id',
                   editable: false,
                   title: "نام",
                   allownull: false
               }
            ];

            $scope.gridSchema = {
                model: {
                    id: 'Id',
                    fields: {
                        Name: {
                            type: 'text',
                            editable: false
                        }
                    }
                },
                data: 'Entities',
                total: 'TotalCount',
            };

            $scope.$watch('selectedItems', function (newVal, oldVal) {
                if ($scope.selectedItems.length <= 0)
                    return;
                $scope.showGridSelectedRowInForm($scope.selectedItems[0]);
            });

        }]);
});
