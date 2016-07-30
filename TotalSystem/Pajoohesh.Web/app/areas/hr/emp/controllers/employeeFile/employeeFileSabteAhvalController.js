define(["areas/hr/emp/app.areas.hr.emp"], function (emp) {


    emp.register.controller("employeeFileSabteAhvalController", ["$scope", "pn.remote.service", "pn.dialog", "Notification",
         "cache", "pn.errorHandler", "empWebAccess", "$state", "$rootScope",
        function ($scope, remoteService, dialog, notify, cache, errorHandler, empWebAccess, $state, $rootScope) {

            var ctrCache = cache.empCache;
            function init() {
                //disableActionButtons();
                var systemId = parseInt($rootScope.CurrenTabState.systemId);
                switch (systemId) {
                    case 2006:
                        {
                            ctrCache = cache.empCache;
                            ctrCache.testTitle = " شماره پرونده :";
                            break;
                        }
                    case 3001:
                        {
                            ctrCache = cache.empCache2;
                            ctrCache.testTitle = " شماره پرسنلی :";
                            break;
                        }
                    default: ctrCache.testTitle = " شماره پرونده :";
                }

                if (ctrCache.person.EMPT1_Employees_Pkey == null) {
                      notify.error({message: 'لطفا یک شخص را برای نمایش اطلاعات انتخاب کنید', title: 'خطا'});
                    $state.go('home.tab.createEmployeeFile.personelInfo');
                }
            }

            init();

            $scope.doBtnUser1 = function () {
                dialog.showYesNo("استعلام", "آیا مایل به استعلام جدید هستید ؟", "بلی", "خیر")
                    .then(function (result) {
                        if (result == undefined) {
                            return true;
                        }
                        var employee = {};
                        employee.NationalID = ctrCache.person.EMPT1_Employees_NationalID;
                        employee.BirthDate = ctrCache.person.EMPT1_Employees_BirthDate;
                        remoteService.post(employee, empWebAccess + "api/EmpCommonServices/InquiryPersonSabteAhvalInfoByNationalID").then(function () {
                            reloadGrid();
                        });
                        return true;
                    });


            };

            var currentName = $state.current.name;
            $rootScope.$on('$stateChangeSuccess',
                function (event, toState, toParams, fromState, fromParams) {
                    if (currentName === toState.name) {
                        init();
                        reloadGrid();

                    }
                }
            );


            function reloadGrid() {
                $scope.gridApi.refresh();
            }
            var enableGrid = function () {
                if ($scope.gridApi)
                    $scope.gridApi.setActive(true);
            }
            var disableGrid = function () {
                $scope.gridApi.setActive(false);
            }


            var initializeForm = function () {
            }



            initializeForm();


            // grid Config
            $scope.selectedItems = [];
            $scope.gridConfig = {
                inlineOperationalUrl: {
                    read: {
                        url: empWebAccess + "api/EmpCommonServices/GetSabteAhval",
                        data: function () {
                            var t = {};
                            t.NationalID = ctrCache.person.EMPT1_Employees_NationalID;
                            return t;
                        }
                    }
                }
            };
            $scope.gridColumns = [
              {
                  field: 'NationalID',
                  editable: false,
                  title: "کد ملی",
                  allownull: false,
                  width: 100,
              },

                {
                    field: 'Name',
                    editable: false,
                    title: "نام",
                    allownull: false,
                    width: 130
                },

                {

                    field: 'LastName',
                    editable: false,
                    title: "نام خانوادگی",
                    allownull: false,
                    width: 130
                },
                {
                    field: 'BirthCertificateID',
                    editable: false,
                    title: "شماره شناسنامه",
                    allownull: false,
                    width: 130
                },
                {
                    field: 'FatherName',
                    editable: false,
                    title: "نام پدر",
                    allownull: false,
                    width: 130
                },

                {
                    field: 'BirthDate',
                    editable: false,
                    title: "تاریخ تولد",
                    allownull: false,
                    width: 130
                },


                 {
                     field: 'DateReceived',
                     editable: false,
                     title: "تاریخ به روز رسانی",
                     allownull: false,
                     width: 130
                 },

               {
                   field: 'TimeReceived',
                   editable: false,
                   title: "ساعت به روز رسانی",
                   allownull: false,
                   width: 130
               }


            ];
            $scope.gridSchema = {
                model: {
                    id: 'Id',
                    fields: {
                        Code: {
                            type: 'number',
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

            //function disableActionButtons() {
                
            //    for (var index = 0; index < $rootScope.tabItems.length; index++) {
            //        //TODo Make a better Idea.
            //        alert($rootScope.tabItems[index].action.indexOf("personelInfo"));
            //        if ($rootScope.tabItems[index].action==="home.tab.createEmployeeFile.personelInfo") {
            //            for (var j = 0; j < 4; j++) {
            //                $rootScope.tabItems[index].toolbar[j].disabled = "disabled";
            //            }
            //        }
            //    }
            //  //  action


            //}

        }]);
});


