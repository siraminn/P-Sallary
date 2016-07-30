define(["areas/userManagement/app.areas.userManagement"], function (userManagement) {
    userManagement.register.controller("roleManagementController", ["$scope", "$state", function ($scope, $state) {

        $scope.tab =
                {
                    model: { name: 'PersianName' },
                    fixedTabs: [
                            { persianName: 'درختواره گروه و نقش', urlName: 'home.tab.role.listRole', icon: 'home', isActive: true },
                            { persianName: 'تخصیص مجوز به نقش', urlName: 'home.tab.role.setPermissionToRole', icon: 'user', isActive: false }
                    ]
                };

        $state.go("home.tab.role.listRole");
    }]);
}); 