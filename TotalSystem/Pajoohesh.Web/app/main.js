require.config({
    baseUrl: 'app',
    urlArgs: "v=1.0.0",
    config: {
        es6: {
            resolveModuleSource: function (source) {
                return 'es6!' + source;
            }
        }
    },
    paths: {
        es6: '/Scripts/es6',
        babel: '/Scripts/babel-5.8.34.min'
    }
});

require(['app', 
         'areas/inf/controllers/dynamicEntity/InsertTreeStructureController',
         'areas/inf/controllers/dynamicEntity/InsertStructureOtherTablesController',
         'areas/inf/services/structureTableService',
         'directives/web.components/entity-viewer/entityViewerModule',
         //'directives/web.components/formula/formulaModule',
         'directives/web.components/hierarchy-meta/pn-hierarchy-meta',
         'directives/web.components/hierarchy-meta/pn-hierarchy-editor',

         'services/pn.remote.service',
         'services/pn.dialog',
         'services/pn.focus',
         'services/cache',
         'services/pn.enum',
         'services/pn.message',
         'services/pn.array',
         'services/pn.errorHandler',
         'services/pn.validator',
         'services/pn.kendo.config.provider',

         'controllers/dialogController',
         'controllers/home/homeController',
         'controllers/main/mainController',
         'controllers/login/loginController',
         'controllers/login/logoutController',

         'directives/controls/pn-required',
         'directives/controls/pnControls',
         'directives/controls/pn-select',
         'directives/controls/pn-comboBox',
         'directives/controls/pn-treelist',
         'directives/controls/pn.treeview',
         'directives/controls/pn-gridview',
         'directives/controls/pn-tab',
         'directives/controls/pn-textbox',
         'directives/controls/pn-ribbon',
         'directives/controls/pn-button',
         'directives/controls/pn-accordion',
         'directives/controls/pn-button',
         'directives/controls/pn-checkbox',
         'directives/controls/pn-required',
         'directives/controls/pn-textbox-decimal',
         'directives/controls/pn-textbox-float',
         'directives/controls/pn-textbox-number',
         'directives/controls/pn-select-box',
         'directives/controls/pn-currency',
         'directives/controls/maskedTextBox/pn-masked-textbox',
         'directives/controls/maskedTextBox/pn-time-picker',
         'directives/controls/maskedTextBox/pn-national-code',
         'directives/controls/maskedTextBox/pn-telephone',
         'directives/controls/pn-date-picker',
         'directives/controls/pn-dropdownlist',
         'directives/controls/pn-multiselect',
         'directives/controls/pn-numeric',
         'directives/controls/pn-email',
         'directives/controls/pn-float',
         'directives/controls/pn-string',
         'directives/controls/pn-calendar',
         'directives/controls/pn-richtext',
         'directives/controls/pn-spliter',
         'directives/controls/pn-static-partial-emp',
         'directives/controls/pn-static-partial-rec',
         'directives/controls/pn-tab',
         'directives/controls/pn-lookup',
         'directives/controls/pn-calculator',
         'directives/controls/pn-textbox-price'], function () {
    angular.bootstrap(document, ['app']);
});
