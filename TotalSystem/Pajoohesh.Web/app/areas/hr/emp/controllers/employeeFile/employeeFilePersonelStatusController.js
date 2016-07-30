define(["areas/hr/emp/app.areas.hr.emp"], function (emp) {

    emp.register.controller("employeeFilePersonelStatusController", 
        ["$scope", "$timeout", "pn.remote.service", "pn.dialog", "pn.focus",
        "pn.enum", "pn.array", "Notification",  "$rootScope"
       ,"pn.errorHandler","empWebAccess","cache","$state",

        function($scope,$timeout,remoteService,dialog,focus,pnenum,pnarray,notify,$rootScope,errorHandler,empWebAccess,
            cache,
            $state) {

            var currentForm = $state.current.data;
            var currentName = $state.current.name;
            var ctrCache = {};
            $rootScope.$on('$stateChangeStart',
                function(event, toState, toParams, fromState, fromParams) {
                    if (currentName === toState.name) {
                        // event.preventDefault();
                        $state.go('home.tab.createEmployeeFile.personelInfo');
                        init();
                        reloadGrid();
                    }
                }
            );

            function init() {
                debugger;
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

              if(ctrCache.person.EMPT1_Employees_Pkey==null)
                {
                 notify.error({message: 'لطفا یک شخص را برای نمایش اطلاعات انتخاب کنید', title: 'خطا'});
                 $state.go('home.tab.createEmployeeFile.personelInfo');
                }
            }
            init();

            var reloadGrid = function () {
                $scope.gridApi.refresh();
            }
            
            // grid Config
            $scope.selectedItems = [];
            $scope.gridConfig = {
                inlineOperationalUrl: {
                    read: {
                        url: empWebAccess+"api/HgEmployee/GetHgEmployeebyEmployeeKey",
                        data: function () {
                            var t = $scope.filterQuery || {};
                            t.EmployeeKey = ctrCache.person.EMPT1_Employees_Pkey;
                            return t;
                        }
                    }
                }

                 
            };
            $scope.gridColumns = [
              {
                  field: 'EmployeeId',
                  editable: false,
                  title: "شماره پرسنلی",
                  allownull: false,
                  width: 100,
              },
                {
                    field: 'EmployeeGroup', // in bayad change beshe
                    editable: false,
                    title: "گروه",
                    allownull: false,
                    width: 90
                },
                {
                    field: 'StartMode', // be chizi ke usr vase latin fiedlesh entekhab karde yechi mesle EMPT4_Family_BirthCertificateSeri
                    editable: false,
                    title: "تاریخ ثبت",
                    allownull: false,
                    width: 90
                },
              
                {
                    field: 'Code',
                    editable: false,
                    title: "کد",
                    allownull: false,
                    width: 130
                },
               

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
            $scope.gridGroups = {};

            $scope.$watch('selectedItems', function (newVal, oldVal) {
                if ($scope.selectedItems.length <= 0)
                    return;
                $scope.showGridSelectedRowInForm($scope.selectedItems[0]);
            });

            
            //var configGridDynamically = function(metaDataUrl, kendoGrid){
            //    remoteService.get(null, metaDataUrl).then(function (data) {
            //        var fields = data.FieldsGroup.map(function (d) { return d.FieldsList });

            //        console.log(data);
            //    });
            //}
            //$scope.onKendoReady = function(kendo){
            //   // configGridDynamically('api/DynamicEntity/GettingStructureTablebyName', kendo);
            //}

        }]);
});


