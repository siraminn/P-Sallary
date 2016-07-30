define(["areas/inf/app.areas.inf"], function (inf) {
    inf.register.controller("sampleController", ["$scope", function ($scope) {

        $scope.test = "salam";
        $scope.selectedItem = '5';
        $scope.names = [
            { id: '1', name: 'حسین' },
            { id: '2', name: 'علی' },
            { id: '3', name: 'صائب' },
            { id: '4', name: 'محمد' },
            { id: '5', name: 'سعید' },
            { id: '6', name: 'حسین' }
        ];

    }]);
});

