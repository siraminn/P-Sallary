define(['app'], function (app) {
    app.controller("InsertTreeStructureController",["$scope", "close", "title", "message", "yesTitle", "noTitle", "isQuestion",
                                        function ($scope, close, title, message, yesTitle, noTitle, isQuestion) {

                                            $scope.title = title;
                                            $scope.message = message;
                                            $scope.yesTitle = yesTitle;
                                            $scope.noTitle = noTitle;
                                            $scope.isQuestion = isQuestion;


                                            if (yesTitle === null) {
                                                $scope.yesTitle = 'بلی';
                                            }
                                            if (noTitle === null) {
                                                $scope.yesTitle = 'خیر';
                                            }

                                            $scope.close = function (result) {
                                                var r = {
                                                    dialogResult: result,
                                                    data: $scope.hierarchyMeta
                                                }
                                                close(r, 500);
                                            };
                                        }]);
});