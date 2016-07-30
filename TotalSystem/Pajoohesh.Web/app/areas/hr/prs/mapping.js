/*
{action},{url},{access},{sub-system-name},{module-name},{folder},{view-name},{page-title}
*/

var mappingPRS = [
    //"tab.createEmployeeFile,/createEmployeeFile,public,inf,,EmployeeFile,createEmployeeFile,createEmployeeFileView,Test_Page"

   //{ action: 'tab', url: '/tab', access: 'public', subSystem: 'inf', module: '', folder: 'tab', controller: 'tab', view: 'tabView', pageTitle: 'tab_Page_Title' },
    //{ action: 'tab.testEntityViewer', url: '/testEntityViewer', access: 'public', subSystem: 'inf', module: '', folder: 'test', controller: 'testEntityViewer', view: 'testEntityViewerView', pageTitle: 'testEntityViewerView_Page_Title' },

    {
        action: 'home.tab.basicTables',
        url: '/personnel/basicTables',
        access: 'public',
        subSystem: 'hr/prs',
        module: '',
        folder: 'dynamic',
        controller: 'personnelDynamic',
        view: 'personnelDynamicView',
        pageTitle: 'ورود جداول پایه',
        sticky: true,
        tabMenu: true
    },
    {
        action: 'home.tab.defineTables',
        url: '/personnel/defineTables',
        access: 'public',
        subSystem: 'hr/prs',
        module: '',
        folder: 'tables',
        controller: 'defineTables',
        view: 'defineTablesView',
        pageTitle: 'تعریف جداول پایه',
        sticky: true,
        tabMenu: true
    }
],



    prsTabRoute = {
        action: 'home.tab.basicTables.dyn',
        url: '/personnel/',
        access: 'public',
        subSystem: 'hr/prs',
        module: '',
        folder: 'dynamic',
        controller: 'initialDynamic',
        view: 'personnelDynamicEnitityView',
        pageTitle: '',
        sticky: true,
        tabMenu: false
    };
