//تعریف مجوز
define(["areas/hr/rec/app.areas.hr.rec"], function (rec) {
    rec.register.controller("recruitmentLicenseController",
    ["$scope", "pn.remote.service", "pn.enum", "pn.dialog", "pn.focus", "Notification", "pn.errorHandler", "recWebAccess", "pn.validator", "$q", "pn.message",
        function ($scope, remoteService, pnenum, dialog, focus, notify, errorHandler, WebAccess, validator, $q, pnMessage) {

            //تعریف پارامتر های مربوط به فرم
            $scope.RecruitmentLicense = {};
            $scope.FieldItems = {};
            $scope.selectedItems = [];

           
            function initializeForm() {
                $scope.formOperationState = pnenum.pnformstate.browse;
                $scope.disableCtrRecruitmentLicenseForm = true;
                enableGrid(true);
            };

            //پر کردن کمبو نوع مجوز
            function GetFieldItems() {
                remoteService.post({Code:7}, WebAccess + "api/InfForRec/GetItemGroup").then(function (result) {
                    $scope.FieldItems = result.Entities[0].FieldItems;
                    $scope.RecruitmentLicense.FieldItemsID = $scope.FieldItems[0].FieldItemId;
                });
            };
            /*********************************************************************/
            //گرید
            $scope.$watch('selectedItems', function (newVal, oldVal) {
                if ($scope.selectedItems.length <= 0)
                    return;
                $scope.showGridSelectedRowInForm($scope.selectedItems[0]);
            });

            $scope.gridConfig = {
                inlineOperationalUrl: {
                    read: {
                        url: WebAccess + "api/recruitmentLicense/GetAllRecruitmentLicense",
                        data: function () {return $scope.filterQuery;}
                    }
                },
                pageSizes: [5, 10, 15, 20, 25, 30, "All"]
            };
            $scope.gridColumns = [
                                        { field: "FieldItemsValue", editable: false, title: "مرجع صادر کننده", allownull: false },
                                        { field: "NO", editable: false, title: "شماره مجوز", allownull: false },
                                        { field: "Subject", editable: false, title: "موضوع مجوز", allownull: false },
                                        { field: "SolarDate", editable: false, title: "تاریخ مجوز", allownull: false },
                                        { field: "SolarRecordDate", editable: false, title: "تاریخ صدرو مجوز", allownull: false },
                                        { field: "Comments", editable: false, title: "توضیحات", allownull: false },
            ];
            $scope.gridSchema = { model: { id: "Id", fields: { Code: { type: "number", editable: false } } }, data: "Entities", total: "TotalCount" };
            //دریافت اطلاعات  از گرید
            $scope.showGridSelectedRowInForm = function (entity) {

              //  $scope.RecruitmentLicense = entity;
                     $scope.RecruitmentLicense.FieldItemsID = entity.FieldItemsID;
                $scope.RecruitmentLicense.NO = entity.NO;
                $scope.RecruitmentLicense.Subject = entity.Subject;
                $scope.RecruitmentLicense.SolarDate = entity.SolarDate;
                $scope.RecruitmentLicense.SolarRecordDate = entity.SolarRecordDate;
                $scope.RecruitmentLicense.Comments = entity.Comments;
                $scope.RecruitmentLicense.Key = entity.Key;
            };
            //ریفریش اطلاعات گرید 
            function reloadGridRecruitmentLicense() {
                $scope.gridApi.refresh();
                $scope.showGridSelectedRowInForm($scope.selectedItems[0]);
            };
            //انتخاب اولین سطر بطور پیش فرض
            $scope.grid_onDataBound = function (kendo) {
                kendo.select(kendo.tbody.find('tr:first'));
            };
            //********************************************************************************************************************
            GetFieldItems();
            initializeForm();
            //*********************************Template Method*******************************************
            $scope.doInsert = function () {
                $scope.formOperationState = pnenum.pnformstate.insert;
                $scope.RecruitmentLicense.FieldItemsID = null;
                $scope.RecruitmentLicense.NO = "";
                $scope.RecruitmentLicense.Subject = "";
                $scope.RecruitmentLicense.SolarDate = "";
                $scope.RecruitmentLicense.SolarRecordDate = "";
                $scope.RecruitmentLicense.Comments = "";
                $scope.disableCtrRecruitmentLicenseForm = false;
                focus.setFocus('RecruitmentLicense.FieldItemsID');
                enableGrid(false);
                return true;
            };
            $scope.doEdit = function () {
                $scope.formOperationState = pnenum.pnformstate.update;
                $scope.disableCtrRecruitmentLicenseForm = false;
                focus.setFocus('RecruitmentLicense.FieldItemsID');
                enableGrid(true);
                return true;
            };
            $scope.doDelete = function () {
                var resultDelete = false;
                if ($scope.RecruitmentLicense == null)
                    dialog.showMessage(pnMessage.common.note, pnMessage.common.errorDelete);

                else if ($scope.RecruitmentLicense.Key == null)
                    dialog.showMessage(pnMessage.common.note, pnMessage.common.errorDelete);
                else {
                    dialog.showYesNo(pnMessage.common.note, pnMessage.common.deleteSure, pnMessage.common.yes, pnMessage.common.no).then(function (resultConfrim) {
                        if (resultConfrim == null) { return resultDelete; }

                        else if (resultConfrim == true) {
                            remoteService.post($scope.RecruitmentLicense, WebAccess + "api/RecruitmentLicense/DeleteRecruitmentLicense").then(function (resultReqDelete) {
                                if (resultReqDelete.Success) {
                                    var notifyP = { message: pnMessage.common.successfullDelete, title: pnMessage.common.delete };
                                    resultDelete = resultHandler(resultReqDelete, notifyP);
                                }
                                else {
                                    errorHandler.ShowError(resultReqDelete);
                                }
                            });
                        }
                    });
                }
                return resultDelete;
            };
            $scope.doApplay = function () {
                var defferd = $q.defer();
                if ($scope.ValidationInfoFrom()) {
                    if ($scope.formOperationState === pnenum.pnformstate.insert) {
                        remoteService.post($scope.RecruitmentLicense, WebAccess + "api/RecruitmentLicense/CreateRecruitmentLicense").then(function (result) {
                            var notifyP = { message: pnMessage.common.successfullInsert, title: pnMessage.common.insert };
                            var resultStatus = resultHandler(result, notifyP);
                            defferd.resolve(resultStatus);
                        });
                    }
                    else if ($scope.formOperationState === pnenum.pnformstate.update) {
                        remoteService.post($scope.RecruitmentLicense, WebAccess + "api/RecruitmentLicense/UpdateRecruitmentLicense").then(function (result) {
                            var notifyP = { message: pnMessage.common.SuccessfullUpdate, title: pnMessage.common.update };
                            var resultStatus = resultHandler(result, notifyP);
                            defferd.resolve(resultStatus);
                        });
                    }
                }
                else {
                    defferd.resolve(false);
                }
                return defferd.promise;
            };
            $scope.doCancel = function () {
                initializeForm();
                return true;
            };

            //*******************************************  
            // اعتبار سنجی اطلاعات
            $scope.ValidationInfoFrom = function () {
                if ($scope.createForm.$valid) {
                    return true;
                }
                else {
                    var result = validator.Validate($scope.createForm);
                    errorHandler.ShowError(result);
                    return false;
                }
            };
            var resultHandler = function (result, notifyP) {
                if (result.Success) {
                    notify.success(notifyP);
                    reloadGridRecruitmentLicense();
                    initializeForm();
                }
                else {
                    errorHandler.ShowError(result);
                }
                return result.Success;
            }
            function enableGrid(value) {
                if($scope.gridApi)
                $scope.gridApi.setActive(value);
            }

        }]);
});
