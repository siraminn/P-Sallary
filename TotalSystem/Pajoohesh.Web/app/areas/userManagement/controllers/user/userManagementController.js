define(["areas/userManagement/app.areas.userManagement"], function (userManagement) {
    userManagement.register.controller("userManagementController", ["$scope", "$state", "cache",
        function ($scope, $state, cache) {

            $scope.umsCache = $scope.umsCache || {};
            $scope.umsCache = cache.umsCache;

            $scope.doInsert = function () {

            };

            $scope.doCancel = function () {

            };

            $scope.tab =
                    {
                        model: { name: 'persianName' },
                        fixedTabs: [
                                { persianName: 'لیست کاربران', urlName: 'home.tab.user.listUser', icon: 'home', isActive: true },
                                { persianName: ' پروفایل کاربر', urlName: 'home.tab.user.createUser', icon: 'user', isActive: false },
                                { persianName: 'تخصیص نقش', urlName: 'home.tab.user.setRoleToUser', icon: 'th-list', isActive: false },
                                { persianName: 'آدرس ها', urlName: 'home.tab.user.createAddress', icon: 'envelope', isActive: false },
                                { persianName: 'اعتبارنامه ها', urlName: 'home.tab.user.createCredential', icon: 'bookmark', isActive: false },
                                { persianName: 'فعال/غیرفعال کردن', urlName: 'home.tab.user.createActiveUser', icon: 'random', isActive: false },
                                { persianName: 'سابقه ورود و خروج', urlName: 'home.tab.user.listLogLogin', icon: 'log-in', isActive: false },
                                { persianName: 'سابقه ورود ناموفق', urlName: 'home.tab.user.logFailed', icon: 'log-out', isActive: false },
                                { persianName: 'سابقه تغییر رمز عبور', urlName: 'home.tab.user.listLogChangePass', icon: 'tags', isActive: false },
                                { persianName: 'سابقه تغییر نقش', urlName: 'home.tab.user.listLogChangeRole', icon: 'transfer', isActive: false },
                                { persianName: 'سابقه فعال/غیرفعال', urlName: 'home.tab.user.listLogUserActiveChange', icon: 'tasks', isActive: false }
                        ]
                    };

         






            //************************************************

            //$scope.MenuItems = [{ title: 'لیست کاربران', url: 'home.tab.user.listUser', icon: 'home', isActive: true},
                               // { title: 'پروفایل کاربر', url: 'home.tab.user.createUser', icon: 'user', isActive: false },
                              //  { title: 'تخصیص نقش', url: 'home.tab.user.setRoleToUser', icon: 'th-list', isActive: false },
                                //{ title: 'آدرس ها', url: 'home.tab.user.createAddress', icon: 'envelope', isActive: false },
                                //{ title: 'اعتبارنامه ها', url: 'home.tab.user.createCredential', icon: 'bookmark', isActive: false },
                               // { title: 'فعال/غیرفعال کردن', url: 'home.tab.user.createActiveUser', icon: 'random', isActive: false },
                               // { title: 'سابقه ورود و خروج', url: 'home.tab.user.createEmployeeFile.t.personelInfo', icon: 'log-in', isActive: false },
                                //{ title: 'سابقه ورود ناموفق', url: 'home.tab.user.logFailed', icon: 'log-out', isActive: false },
                                //{ title: 'سابقه تغییر رمز عبور', url: 'home.tab.user.testEntityViewer', icon: 'tags', isActive: false },
                               // { title: 'سابقه تغییر نقش', url: 'home.tab.user.listLogChangeRole', icon: 'transfer', isActive: false },
                                //{ title: 'سابقه فعال/غیرفعال', url: 'home.tab.user.listLogUserActiveChange', icon: 'tasks', isActive: false }];

           // $scope.onClickTab = function (tab) {
               // angular.forEach($scope.MenuItems, function (item) {
                   // item.isActive = false;
               // });
             //   tab.isActive = true;
            //   }

            //*************************************************************************************************************


            $state.go("home.tab.user.listUser");


        }]);
});







