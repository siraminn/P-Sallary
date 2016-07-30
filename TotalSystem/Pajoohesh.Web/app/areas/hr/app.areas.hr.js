define(["areas/hr/emp/app.areas.hr.emp",
        "areas/hr/rec/app.areas.hr.rec",
        "areas/hr/prs/app.areas.hr.prs",
        "areas/hr/tat/app.areas.hr.tat",
        "areas/hr/isu/app.areas.hr.isu",
        ], function () {
    var hr = angular.module("app.areas.hr", ['app.areas.hr.emp',
                                             'app.areas.hr.rec',
                                             'app.areas.hr.prs',
                                             'app.areas.hr.tat',
                                             'app.areas.hr.isu',
                                             'pn.entityViewer']);

    return hr;
});