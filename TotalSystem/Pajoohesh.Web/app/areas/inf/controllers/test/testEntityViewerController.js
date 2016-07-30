define(["areas/inf/app.areas.inf"], function (inf) {
    inf.register.controller("testEntityViewerController", function ($scope) {

        $scope.options = {
            metaDataUri: '/app/areas/inf/controllers/test/meta.json',
            columns: 3
        };

        $scope.options2 = {
            metaDataUri: '/app/areas/inf/controllers/test/meta2.json',
            //noFooter: true,
        };

        $scope.onChange = function (change) {
            $scope.api.getData(function (data) {
                $scope.data = data;
            });
        };

        $scope.testLoadJson = function () {
            $scope.api.load({
                "EMPTH1_AcademicDegree_1": 32000,
                "EMPTH1_AcademicDegree_2": 90000000,
                "EMPTH1_AcademicDegree_3": 99999999999999999,
                "EMPTH1_AcademicDegree_4": 12345667989.237,
                "EMPTH1_AcademicDegree_5": "1تست رشته با طول مشخص",
                "EMPTH1_AcademicDegree_6": true,
                "EMPTH1_AcademicDegree_7": "2016-01-08 00:00:00.0000000",
                "EMPTH1_AcademicDegree_8": "1394/10/10",
                "EMPTH1_AcademicDegree_9": "10:20",
                "EMPTH1_AcademicDegree_10": "آیتم1",
                "EMPTH1_AcademicDegree_11": ["آیتم3", "آیتم5", "آیتم6", "آیتم10"],
                "EMPTH1_AcademicDegree_12": "تست متن بزرگ بدون محدوديت1",
                "EMPTH1_AcademicDegree_13": null,
                "EMPTH1_AcademicDegree_14": 12365.3660
            });
        };

        $scope.test1 = function () {
            $scope.api.loadByUrl('/app/data1.json');
        }; ''
        $scope.test2 = function () {
            $scope.api.loadByUrl('/app/data2.json');
        };

        $scope.test3 = function () {
            var field = $scope.api.getField(1);
            field.labelElem.css('color', 'red');
            console.log(field);
        };
        $scope.test4 = function () {
            var field = $scope.api.getField("EMPTH1_AcademicDegree_9");
            field.kendoOptions.mask = "000:00";
            field.editorElem.setOptions(field.kendoOptions);
        };
        $scope.test5 = function () {
            var groups = $scope.api.getGroups();
            groups[0].title = 'aaaa';
            console.log(groups);
        };

        $scope.test6 = function () {
            if ($scope.options.metaDataUri == '/app/meta2.json') {
                $scope.options = { metaDataUri: '/app/meta.json' };
            } else {
                $scope.options = { metaDataUri: '/app/meta2.json' };
            }
        };

        $scope.testDisable = function () {
            $scope.api.disable();
            $scope.api2.disable();
            $scope.dis = true;
        };
        $scope.testEnable = function () {
            $scope.api.enable();
            $scope.api2.enable();
            $scope.dis = false;
        };
    });
});

