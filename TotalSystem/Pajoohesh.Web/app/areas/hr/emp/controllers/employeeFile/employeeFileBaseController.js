define(["areas/hr/emp/app.areas.hr.emp"], function (emp) {

    emp.register.controller("employeeFileBaseController", ["$scope", "cache", "empWebAccess",
                            "pn.remote.service", "$rootScope", "$state", "Notification",

        function ($scope, cache, empWebAccess, remoteService, $rootScope, $state, notify) {

            var routePrefix = 'home.tab.createEmployeeFile';

            cache.empCache = cache.empCache || {};
            cache.empCache.person = cache.empCache.person || {};
            cache.empCache.DynamicTable = cache.empCache.DynamicTable || [];
            cache.empCache.person.disablePersonBaseInfo = true;
            cache.empCache.person.EMPT1_Employees_NationalOptions =
            cache.empCache.person.EMPT1_Employees_NationalOptions || {
                kendoOptions: {}
            }

            $scope.empCache = cache.empCache;

            if ($state.current && $state.current.name &&
                $state.current.name.indexOf('home.tab.createEmployeeFile2') === 0) {
                routePrefix = 'home.tab.createEmployeeFile2';
                cache.empCache2 = cache.empCache2 || {};
                cache.empCache2.person = cache.empCache2.person || {};
                cache.empCache2.DynamicTable = cache.empCache2.DynamicTable || [];
                cache.empCache2.person.disablePersonBaseInfo = true;
                cache.empCache2.person.EMPT1_Employees_NationalOptions = cache.empCache2.person.EMPT1_Employees_NationalOptions || {
                    kendoOptions: {}
                }

                $scope.empCache = cache.empCache2;
            }

            remoteService.post(null, empWebAccess + 'api/EmpCommonServices/GetTableListofGroup').then(function (result) {
                var dynamicTables = result.Entities;
                cache.empCache.DynamicTable = dynamicTables;

            });

            $scope.onTabclick = function(route) {
                if (route === "home.tab.createEmployeeFile.personelInfo" || route === "home.tab.createEmployeeFile2.personelInfo")
                    return"";

                if (route.indexOf("home.tab.createEmployeeFile.") === 0  && cache.empCache.person.EMPT1_Employees_Pkey === undefined) {
                    notify.error({
                        message: 'لطفا یک شخص را برای نمایش اطلاعات انتخاب کنبد',
                        title: 'خطا'
                    });
                    return "stop";
                }

                if (route.indexOf('home.tab.createEmployeeFile2.') === 0 && cache.empCache2.person.EMPT1_Employees_Pkey === undefined) {
                    notify.error({
                        message: 'لطفا یک شخص را برای نمایش اطلاعات انتخاب کنبد',
                        title: 'خطا'
                    });
                    return "stop";
                }
            };

            $scope.tab =
                {
                    url: empWebAccess + 'api/EmpCommonServices/GetTableListofGroup',
                    isDynamic: true,
                    routePrefix: routePrefix,

                    model: { name: 'PersianName' },
                    fixedTabs: [{ persianName: 'مشخصات پرسنل', urlName: routePrefix + '.personelInfo' },
                                { persianName: 'افراد تحت تکفل', urlName: routePrefix + '.personelTakafol' },
                                { persianName: 'وضعیت پرسنل', urlName: routePrefix + '.personelStatus' },
                                { persianName: 'وضعیت ثبت حوال', urlName: routePrefix + '.sabteAhval' }
                    ]
                };

            $scope.tabRoute = empTabRoute;
            $scope.PersonBirthLocationOptions = {
                allowDuplicate: true,
                required: true,
                showValue: "",
                disabled: false,
                lookup: {
                    fields: [
                      {
                          latinName: "PUBT1_GeographicAreas_Desc",
                          persianName: "نام",
                          length: 100,
                          minRange: null,
                          maxRange: null,
                          allowDuplicate: false,
                          required: false,
                          typeKey: 104,
                          items: null,
                          showInSearchPanel: true,
                          showInGrid: true,
                          ParameterName: "p100"
                      },
                      {
                          latinName: "PUBT1_GeographicAreas_Pkey",
                          persianName: "کد استان",
                          length: 0,
                          minRange: null,
                          maxRange: null,
                          allowDuplicate: false,
                          required: false,
                          typeKey: 101,
                          items: null,
                          showInSearchPanel: false,
                          showInGrid: false,
                      },
                      {
                          latinName: "PUBT1_GeographicAreas_LevelNo",
                          persianName: "کد ",
                          length: 0,
                          minRange: null,
                          maxRange: null,
                          allowDuplicate: false,
                          required: false,
                          typeKey: 101,
                          items: null,
                          showInSearchPanel: false,
                          showInGrid: false,
                      }
                    ],
                    filter: {
                        Logic: "and",
                        filters: [
                            {
                                field: "PUBT1_GeographicAreas_LevelNo",
                                Value: 2,
                                operator: "eq",
                                dataType: 101,
                                ParameterName: "p10"
                            }]
                    },
                    url: empWebAccess + "api/BaseSystemOData/Get",
                    table: "PUB.PUBT1_GeographicAreas",
                    textField: "PUBT1_GeographicAreas_Desc",
                    valueField: "PUBT1_GeographicAreas_Pkey",
                }
            }

            $rootScope.birthLocation = $scope.PersonBirthLocationOptions;

        }]);
});




