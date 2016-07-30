define(["areas/finance/acc/app.areas.finance.acc"], function (acc) {
    acc.register.controller("structureCodeController", ["$scope", "pn.enum", "pn.errorHandler", "pn.dialog", "pn.remote.service", "recWebAccess", "Notification", "$q",
    function ($scope, pnenum, errorHandler, dialog, remoteService, webAccess, notify, $q) {

        $scope.model = { ID: 0, Code: null, Description: "", Selected: false, Structure: null };

        $scope.editHierarchy = true;

        $scope.panelStatus = false;

        $scope.gridConfig = {
            autoBind: true,
            inlineOperationalUrl: {
                read: {
                    url: webAccess + "api/StructureCode/GetList",
                }
            }
        };

        $scope.gridColumns = [
            {
                field: 'Code',
                editable: false,
                title: "کدینگ",
                allownull: false,
                width: 200
            },
            {
                field: 'Description',
                editable: false,
                title: "توضیحات",
                allownull: false,
                width: 200
            },
            {
                field: 'LevelCount',
                editable: false,
                title: "تعداد سطوح",
                allownull: false,
                width: 200
            },
            {
                field: 'DescCount',
                editable: false,
                title: "تعداد سطوح شرح کامل",
                allownull: false,
                width: 200
            },
            {
                field: 'UnavailableCount',
                editable: false,
                title: "عداد سطوح غیرعملیاتی",
                allownull: false,
                width: 200
            }
        ];

        $scope.gridSchema = {
            model: {
                id: 'ID',
                fields: {
                    Code: {
                        type: 'number',
                        editable: false
                    }
                }
            },
            data: 'Entities',
            total: 'TotalCount'
        };

        $scope.onSelectRow = function (row) {
            $scope.model = row;
        }

        $scope.doInsert = function () {
            $scope.editHierarchy = true;
            $scope.hierarchyMeta = null;
            $scope.panelStatus = true;
            $scope.formOperationState = pnenum.pnformstate.insert;
            return true;
        }

        $scope.doDelete = function () {
            if ($scope.model.Structure != null) {
                var defferd = $q.defer();
                remoteService.post({ ID: $scope.model.ID }, webAccess + "api/StructureCode/Delete").then(function (data) {
                    $scope.hierarchyMeta = null;
                    $scope.panelStatus = false;
                    if (data.Success) {
                        notify.success("عملیات با موفقیت انجام شد");
                        reloadGrid();
                    }
                    else {
                        dialog.showMessage("خطا", "رکورد دارای زیر شاخه میباشد");
                    }
                    defferd.resolve(data.Success);
                });
            }
            else {
                dialog.showMessage("خطا", "یک رکورد را انتخاب کنید");
                return false;
            }
            defferd.resolve(true);
        }

        $scope.doCancel = function () {
            $scope.panelStatus = false;
            $scope.hierarchyMeta = null;
            return true;
        }

        $scope.doApplay = function () {

            if ($scope.hierarchyMeta.head.description != "" && ckeckStructure($scope.hierarchyMeta.rows)) {
                $scope.model.Description = $scope.hierarchyMeta.head.description;
                $scope.model.LevelCount = $scope.hierarchyMeta.head.count;
                $scope.model.DescCount = $scope.hierarchyMeta.head.descriptionRows;
                $scope.model.UnavailableCount = $scope.hierarchyMeta.head.countNoAction;
                $scope.model.Structure = JSON.stringify($scope.hierarchyMeta);

                var defferd = $q.defer();
                if ($scope.formOperationState == pnenum.pnformstate.insert) {
                    remoteService.post($scope.model, webAccess + "api/StructureCode/Create").then(function (data) {
                        $scope.hierarchyMeta = null;
                        $scope.panelStatus = false;
                        var resultStatus = resultHandler(data)
                        defferd.resolve(resultStatus);
                    });
                }
                else {
                    remoteService.post($scope.model, webAccess + "api/StructureCode/Update").then(function (data) {
                        $scope.hierarchyMeta = null;
                        $scope.panelStatus = false;
                        var resultStatus = resultHandler(data)
                        defferd.resolve(resultStatus);
                    });
                }

            }
            else {
                dialog.showMessage("خطا", "مقادیر را کامل وارد کنید");
                return false;
            }
            return defferd.promise;
        }

        $scope.doEdit = function () {
            if ($scope.model.Structure != null) {
                remoteService.post({ ID: $scope.model.ID }, webAccess + "api/StructureCode/CheckStructureCode").then(function (data) {
                    $scope.editHierarchy = !data.HasPeriod;
                    $scope.hierarchyMeta = JSON.parse($scope.model.Structure);
                    $scope.panelStatus = true;
                    $scope.formOperationState = pnenum.pnformstate.update;
                });
            }
            else {
                dialog.showMessage("خطا", "یک رکورد را انتخاب کنید");
                return false;
            }
            return true;
        }

        var reloadGrid = function () {
            $scope.gridApi.refresh();
        }

        var resultHandler = function (result) {
            if (result.Success) {
                notify.success("عملیات با موفقیت انجام شد");
                reloadGrid();
            }
            else {
                errorHandler.ShowError("خطا در عملیات");
                return false;
            }
            return true;
        }

        var ckeckStructure = function (items) {
            var isValid = true;
            angular.forEach(items, function (item) {
                if (angular.isUndefined(item.isAutomatic)) {
                    item.isAutomatic = false;
                }
                if (angular.isUndefined(item.title) || item.title == "" || item.rowLength == "0") {
                    isValid = false;
                }
            });
            return isValid;
        }
    }]);
});


