
var empMapping = [

    { action: 'home.tab.createEmployeeFile', url: '/employeeFile/base', access: 'public', subSystem: 'hr/emp', module: '', folder: 'employeeFile', controller: 'employeeFileBase', view: 'employeeFileBaseView', pageTitle: 'پرونده پرسنلی', sticky: true, tabMenu: true, stickyGateway: true },
    { action: 'home.tab.createEmployeeFile.personelInfo', url: '/createEmployeeFile/personelInfo', access: 'public', subSystem: 'hr/emp', module: '', folder: 'employeeFile', controller: 'employeeFilePersonelInfo', view: 'personelInfoView', pageTitle: 'پرونده پرسنلی - اطلاعات شخص', sticky: true, tabMenu: false, stickyGateway: true },
    { action: 'home.tab.createEmployeeFile.personelTakafol', url: '/createEmployeeFile/personelTakafol', access: 'public', subSystem: 'hr/emp', module: '', folder: 'employeeFile', controller: 'employeeFileTakafol', view: 'personelTakafolView', pageTitle: 'پرونده پرسنلی - افراد تحت تکفل', sticky: true, tabMenu: false },
    { action: 'home.tab.createEmployeeFile.personelStatus', url: '/createEmployeeFile/personelStatus', access: 'public', subSystem: 'hr/emp', module: '', folder: 'employeeFile', controller: 'employeeFilePersonelStatus', view: 'personelStatusView', pageTitle: 'پرونده پرسنلی - وضعیت پرسنلی', sticky: true, tabMenu: false },
    { action: 'home.tab.createEmployeeFile.sabteAhval', url: '/createEmployeeFile/sabteAhval', access: 'public', subSystem: 'hr/emp', module: '', folder: 'employeeFile', controller: 'employeeFileSabteAhval', view: 'personelSabteAhvalView', pageTitle: 'پرونده پرسنلی ثبت -  احوال', sticky: true, tabMenu: true },
    { action: 'home.tab.createEmployeeFile2', url: '/employeeFile2/base', access: 'public', subSystem: 'hr/emp', module: '', folder: 'employeeFile', controller: 'employeeFileBase', view: 'employeeFileBaseView', pageTitle: 'پرونده پرسنلی', sticky: true, tabMenu: true },
    { action: 'home.tab.createEmployeeFile2.personelInfo', url: '/createEmployeeFile2/personelInfo', access: 'public', subSystem: 'hr/emp', module: '', folder: 'employeeFile', controller: 'employeeFilePersonelInfo', view: 'personelInfoView', pageTitle: 'پرونده پرسنلی - اطلاعات شخص', sticky: true, tabMenu: false, stickyGateway: true },
    { action: 'home.tab.createEmployeeFile2.personelTakafol', url: '/createEmployeeFile2/personelTakafol', access: 'public', subSystem: 'hr/emp', module: '', folder: 'employeeFile', controller: 'employeeFileTakafol', view: 'personelTakafolView', pageTitle: 'پرونده پرسنلی - افراد تحت تکفل', sticky: true, tabMenu: false },
    { action: 'home.tab.createEmployeeFile2.personelStatus', url: '/createEmployeeFile2/personelStatus', access: 'public', subSystem: 'hr/emp', module: '', folder: 'employeeFile', controller: 'employeeFilePersonelStatus', view: 'personelStatusView', pageTitle: 'پرونده پرسنلی - وضعیت پرسنلی', sticky: true, tabMenu: false },
    { action: 'home.tab.createEmployeeFile2.sabteAhval', url: '/createEmployeeFile2/sabteAhval', access: 'public', subSystem: 'hr/emp', module: '', folder: 'employeeFile', controller: 'employeeFileSabteAhval', view: 'personelSabteAhvalView', pageTitle: 'پرونده پرسنلی ثبت -  احوال', sticky: true, tabMenu: true },

],

empTabRoute = {
    action: 'home.tab.createEmployeeFile',
    url: '/createEmployeeFile/',
    access: 'public',
    subSystem: 'hr/emp',
    module: '',
    folder: 'employeeFile',
    controller: 'employeeDynamic',
    view: 'employeeDynamicEnitityView',
    pageTitle: '',
    sticky: true,
    tabMenu: false,
    stickyGateway: true
};
