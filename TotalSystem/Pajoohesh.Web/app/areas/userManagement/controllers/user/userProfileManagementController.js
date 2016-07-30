define(["areas/userManagement/app.areas.userManagement"], function (userManagement) {
    userManagement.register.controller("userProfileManagementController", ["$scope", "$state", "cache",
        function ($scope, $state, cache) {

            $scope.umsCache = $scope.umsCache || {};
            $scope.umsCache = cache.umsCache;

            $scope.tab =
                    {
                        model: { name: 'persianName' },
                        fixedTabs: [
                                { persianName: 'پروفایل کاربری', urlName: 'home.tab.profile.userProfile', icon: 'user', isActive: false },
                                { persianName: 'تغییر رمز عبور', urlName: 'home.tab.user.setRoleToUser', icon: 'th-list', isActive: false },
                                { persianName: 'اطلاعات تماس', urlName: 'home.tab.user.createAddress', icon: 'envelope', isActive: false },
                                { persianName: 'تغییر رمز عبور', urlName: 'home.tab.user.createCredential', icon: 'bookmark', isActive: false },
                                { persianName: 'نقش ها', urlName: 'home.tab.user.createActiveUser', icon: 'random', isActive: false },
                                { persianName: 'سابقه ورود و خروج', urlName: 'home.tab.user.listLogLogin', icon: 'log-in', isActive: false },
                                { persianName: 'سابقه ورود ناموفق', urlName: 'home.tab.user.logFailed', icon: 'log-out', isActive: false },
                                { persianName: 'سابقه تغییر رمز عبور', urlName: 'home.tab.user.listLogChangePass', icon: 'tags', isActive: false },
                                { persianName: 'سابقه تغییر نقش', urlName: 'home.tab.user.listLogChangeRole', icon: 'transfer', isActive: false },
                                { persianName: 'سابقه فعال/غیرفعال', urlName: 'home.tab.user.listLogUserActiveChange', icon: 'tasks', isActive: false }
                        ] 
                    };

            $state.go("home.tab.profile.userProfile");
        }]);
});