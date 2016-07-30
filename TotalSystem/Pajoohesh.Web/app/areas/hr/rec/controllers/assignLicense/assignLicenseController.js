define(["areas/hr/rec/app.areas.hr.rec"], function (rec) {
    rec.register.controller("assignLicenseController"
        , ["$scope", "$rootScope", "pn.remote.service", "pn.enum", "pn.dialog", "pn.focus", "Notification", "recWebAccess", "$state", "cache"
        ,function ($scope,$rootScope, remoteService, pnenum, dialog, focus, notify, WebAccess, $state, cache) {

            //تعریف پارامتر های مربوط به فرم
            cache.recCache = cache.recCache || {};
            cache.recCache.RecruitmentLicense = {};
            cache.recCache.RecruitmentLicense.RecruitmentLicenseID = null;      
            $scope.RecruitmentLicense = {};
            $scope.disableCtrAssignLicenseForm = true;
            //************************************************
             $scope.tab ={
                        model: { name: 'persianName' },
                        fixedTabs:  [{ persianName: 'لیست تخصیص ها', urlName: 'home.tab.assignLicense.list', icon: 'list', isActive: true },
                                     { persianName: 'ورود اطلاعات', urlName: 'home.tab.assignLicense.create', icon: 'plus', isActive: false }],
                       };

           //*************************************************************************************************************
            $scope.options = {
                required: true,
                lookup: {
                    fields: [
                            { latinName: "FieldItemsValue", persianName: "مرجع صادر کننده", typeKey: 104,  showInSearchPanel: false, showInGrid: true, },
                            { latinName: "NO", persianName: "شماره مجوز",  typeKey: 104, showInSearchPanel: true, showInGrid: true, },
                            { latinName: "Subject", persianName: "موضوع مجوز", allowDuplicate: false, required: false, typeKey: 104, showInSearchPanel: true, showInGrid: true, },
                            { latinName: "SolarDate", persianName: "تاریخ صدور مجوز", typeKey: 107, showInSearchPanel: true, showInGrid: true, },
                            { latinName: "SolarRecordDate", persianName: "تاریخ ثبت مجوز", typeKey: 107, showInSearchPanel: true, showInGrid: true, }],
                    url: WebAccess + "/api/RecruitmentLicense/GetAllRecruitmentLicense/",
                    textField: "NO",
                    valueField: "Key",
                }
            };
            $scope.$watch('options.value', function () {
                if ($scope.options.value != null) {
                    remoteService.post({ Key: $scope.options.value }, WebAccess + "api/RecruitmentLicense/GetRecruitmentLicense").then(function (result) {
                        $scope.RecruitmentLicense = result.Entities[0];
                        cache.recCache.RecruitmentLicense.RecruitmentLicenseID = $scope.RecruitmentLicense.Key;
                        $state.go('home.tab.assignLicense.list');
                        $scope.$emit('someEvent', [$scope.RecruitmentLicense.Key]);

                    });
                }
            });
            $state.go('home.tab.assignLicense.list');
        }]);
});
