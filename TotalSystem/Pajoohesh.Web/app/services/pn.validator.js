define(['app'], function (app) {
    app.service("pn.validator", function () {
         function validate(form) {
                var result = {
                    ErrorMessage: null,
                    ValidationErrors: []
                };
                console.log(form);
                angular.forEach(form.$error, function (error, index) {
                    angular.forEach(error, function (item, index) {
                        result.ValidationErrors.push({ErrorMessage :item.$errorMessage});
                    })
                });
                return result;
            }
            return {
                Validate: validate
            };
    });
});