define(["areas/inf/app.areas.inf", 
        "areas/hr/app.areas.hr",
		"areas/pay/app.areas.pay",
        "areas/userManagement/app.areas.userManagement", 
        "areas/finance/app.areas.finance"], function () {
    angular.module('app.areas.register', ["app.areas.inf",
                                          "app.areas.hr",
                                          "app.areas.pay",
                                          "app.areas.userManagement",
                                          "app.areas.finance"]);
});