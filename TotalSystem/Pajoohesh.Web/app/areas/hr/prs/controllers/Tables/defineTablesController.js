define(["areas/hr/prs/app.areas.hr.prs"], function (prs) {

    prs.register.controller("defineTablesController",
        ["$scope", "$timeout", "pn.remote.service", "pn.dialog", "pn.focus",
        "pn.enum", "pn.array", "Notification", "$window", "$rootScope", "$stateParams", "empWebAccess",
        "cache", "$state", "pn.errorHandler", "$q",
        function ($scope, $timeout, remoteService, dialog, focus, pnenum,
                  pnarray, notify, $window, $rootScope, $stateParams, empWebAccess,
                  cache, $state, errorHandler, $q) {

            var routePrefix = 'home.tab.defineTables';

            $scope.obj = {};
            $scope.obj.relation = {};
            $scope.obj.relation.levels = [{ name: "2 ارتباطی", id: 1 }, { name: '3 ارتباطی', id: 2 }];
            $scope.obj.relation.CountLevel = 2;
            $scope.tableList=[];
            $scope.fieldList1 = [];
            $scope.fieldList2 = [];
            $scope.fieldList3 = [];

            fillTableList();

            var fillTableList = function () {
                remoteService.post($scope.relation, WebAccess + "api/DefineTable/Create").then(function (result) {
                });
            };

            $scope.fillFieldList = function (targetFiledList, tableId) {
                remoteService.post($scope.relation, WebAccess + "api/DefineTable/Create").then(function (result) {
                });
            };


            $scope.DoInsert = function () {
                $scope.formOperationState = pnenum.pnformstate.insert;

            };

            $scope.DoApplay = function () {
           // if ($scope.ValidationDataFrom) {
                        if ($scope.formOperationState === pnenum.pnformstate.insert) {
                            $scope.insert();
                        }

                        if ($scope.formOperationState === pnenum.pnformstate.update) {
                            $scope.update();
                        }
                //    }

                //    else {
                //        dialog.showMessage("توجه", "عملیاتی برای ثبت یافت نشد");
                //        return false;
                //    }
            };

            $scope.insert = function () {

                remoteService.post($scope.relation, WebAccess + "api/DefineTable/Create").then(function (result) {
                    console.log(result);
                    if (result.Success) {
                        notify.success({ message: 'اطلاعات با موفقیت ثبت شد', title: ' ثبت اطلاعات' });
                        $scope.initializeForm();
                        $scope.loadSystems();
                        enableGrid();
                        reloadGrid();
                    } else { errorHandler.ShowError(result); }
                    $scope.CreateSystem = null;
                });

            };

            $scope.update = function () {
                remoteService.post($scope.relation, WebAccess + "api/DefineTable/Update").then(function (result) {
                    if (result.Success) {
                        notify.success({ message: 'اطلاعات با موفقیت ویرایش شد', title: ' ویرایش اطلاعات' });
                        $scope.initializeForm();
                        $scope.loadSystems();
                        enableGrid();
                        reloadGrid();
                    }

                    else {
                        errorHandler.ShowError(result);
                    }

                    $scope.CreateSystem = null;
                });
            };

        }]);
});