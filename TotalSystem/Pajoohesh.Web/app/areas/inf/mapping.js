var infMapping = [
        { 
        action: 'home.tab', url: '/tab', access: 'public', subSystem: 'inf', module: '', folder: 'tab', controller: 'tab', view: 'tabView', pageTitle: 'tab_Page_Title' },
           {
                 action: 'home.tab.navigationDynamicEntity',
                 url: '/navigationDynamicEntity',
                 access: 'public',
                 subSystem: 'inf',
                 module: '',
                 folder: 'dynamicEntity',
                 controller: 'navigationDynamicEntity',
                 view: 'navigationDynamicEntityView',
                 pageTitle: 'جداول', 
                 sticky: true, 
                 tabMenu: true 
             },

          {
                action: 'home.tab.navigationDynamicEntity.createDynamicEntity', 
                url: '/createDynamicEntity',
                access: 'public', 
                subSystem: 'inf', 
                module: '',
                folder: 'dynamicEntity', 
                controller: 'createDynamicEntity', 
                view: 'createDynamicEntityView', 
                pageTitle: 'تعریف جداول', 
                sticky: true,
                tabMenu: true 
            },
               { 
        action: 'home.tab.navigationDynamicEntity.createDynamicField',
        url: '/createDynamicField',
        access: 'public',
        subSystem: 'inf',
        module: '',
        folder: 'dynamicEntity',
        controller: 'createDynamicField',
        view: 'createDynamicFieldView',
        pageTitle: 'تعریف فیلد',
        sticky: true, 
        tabMenu: true 
        },

        {
        
        action: 'home.tab.createSystem',
        url: '/createSystem', 
        access: 'public',
        subSystem: 'inf',
        module: '',
        folder: 'system',
        controller: 'createSystem',
        view: 'createSystemView',
        pageTitle: 'تعریف سیستم', 
        sticky: true,
        tabMenu: true 
        },    

        {
        action: 'home.tab.createTableGroup',
        url: '/createTableGroup',
        access: 'public',
        subSystem: 'inf',
        module: '',
        folder: 'TableGroup',
        controller: 'createTableGroup',
        view: 'createTableGroupView',
        pageTitle: 'گروه جدول' 
        },

        {
        action: 'home.tab.createItemGroup',
        url: '/createItemGroup',
        access: 'public',
        subSystem: 'inf',
        module: '',
        folder: 'itemGroup',
        controller: 'createItemGroup',
        view: 'createItemGroupView',
        pageTitle: 'تعریف ایتم ها' 
        },

        {
        action: 'home.tab.tree',
        url: '/tree',
        access: 'public',
        subSystem: 'inf',
        module: '',
        folder: 'test',
        controller: 'testTree',
        view: 'testTreeView',
        pageTitle: 'testTreeView_Page_Title' 
        },

        {
        action: 'home.tab.sample',
        url: '/sample',
        access: 'public',
        subSystem: 'inf',
        module: '',
        folder: 'sample',
        controller: 'sample',
        view: 'sampleView',
        pageTitle: 'sampleView_Page_Title' 
        },

        {
        action: 'home.tab.treeList',
        url: '/treeList',
        access: 'public',
        subSystem: 'inf',
        module: '',
        folder: 'test', 
        controller: 'testTreeList',
        view: 'testTreeListView',
        pageTitle: 'testTreeListView_Page_Title' 
        },

        {
        action: 'home.tab.testEntityViewer',
        url: '/testEntityViewer',
        access: 'public',
        subSystem: 'inf',
        module: '',
        folder: 'test',
        controller: 'testEntityViewer', 
        view: 'testEntityViewerView',
        pageTitle: 'testEntityViewerController_Title' 
        },

        {
        action: 'home.tab.testReport',
        url: '/testReport',
        access: 'public',
        subSystem: 'inf',
        module: '',
        folder: 'test',
        controller: 'testReport',
        view: 'testReportView',
        pageTitle: 'تست برنامه گزارش ساز' 
        },

        {
        action: 'home.tab.testFormula',
        url: '/testFormula',
        access: 'public',
        subSystem: 'inf',
        module: '',
        folder: 'test',
        controller: 'testFormula',
        view: 'testFormulaView',
        pageTitle: 'تست فرمول' ,
        sticky: true, 
        tabMenu: true 
        },
         {
             action: 'home.tab.createSystemFeature',
             url: '/createSystemFeature',
             access: 'public',
             subSystem: 'inf',
             module: '',
             folder: 'systemFeature',
             controller: 'createSystemFeature',
             view: 'createSystemFeatureView',
             pageTitle: 'تعریف اجزاء برنامه',
             sticky: true,
             tabMenu: true
         },
         //{
         //    action: 'home.tab.createFieldGroup',
         //    url: '/createFieldGroup',
         //    access: 'public',
         //    subSystem: 'inf',
         //    module: '',
         //    folder: 'fieldGroup',
         //    controller: 'createFieldGroup',
         //    view: 'createFieldGroupView',
         //    pageTitle: 'گروه فیلد ها',
         //    sticky: true,
         //    tabMenu: true
         //},
{
    action: 'home.tab.fieldGroup', url: '/FieldGroup', access: 'public', subSystem: 'inf', module: '', folder: 'fieldGroup', controller: 'fieldGroup', view: 'fieldGroupView', pageTitle: 'گروه بندی لیست ها', sticky: true,    tabMenu: true},
{ action: 'home.tab.fieldGroup.list', url: '/list', access: 'public', subSystem: 'inf', module: '', folder: 'fieldGroup', controller: 'fieldGroupList', view: 'fieldGroupListView', pageTitle: 'گروه بندی لیست ها', sticky: true, tabMenu: true },
{ action: 'home.tab.fieldGroup.create', url: '/create', access: 'public', subSystem: 'inf', module: '', folder: 'fieldGroup', controller: 'fieldGroupCreate', view: 'fieldGroupCreateView', pageTitle: 'گروه بندی لیست ها', sticky: true, tabMenu: true },

];


