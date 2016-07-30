define(['directives/web.components/entity-viewer/services/pn.entityViewer.services',
        'directives/web.components/entity-viewer/services/fieldTypesProvider', 
        'directives/web.components/entity-viewer/controls/pn.entityViewer.controls',
        'directives/web.components/entity-viewer/pn-entity-viewer',
        'directives/web.components/entity-viewer/controls/GroupControl/group-control',
        'directives/web.components/entity-viewer/controls/memo/memo',
        'directives/web.components/entity-viewer/controls/picture/picture',
        'directives/web.components/entity-viewer/controls/itemControl/item-control',
        'directives/web.components/entity-viewer/controls/validators/nationalcodeValidator',
        'directives/web.components/entity-viewer/controls/selectOnClick'], function () {
            
            var entityViewer = angular.module("pn.entityViewer", ['ngSanitize', "kendo.directives", 'cfp.hotkeys', 
                'pn.entityViewer.services', 'pn.entityViewer.controls']);
            entityViewer.config(function ($logProvider) {
                $logProvider.debugEnabled(false);
            });

            entityViewer.config(function (fieldTypesProvider) {
                fieldTypesProvider.register(100, 'pn-numeric');
                fieldTypesProvider.register(101, 'pn-numeric');
                fieldTypesProvider.register(102, 'pn-numeric');
                fieldTypesProvider.register(103, 'pn-float');
                fieldTypesProvider.register(104, 'pn-string');
                fieldTypesProvider.register(105, 'pn-select-box');
                fieldTypesProvider.register(106, 'pn-date-picker en');
                fieldTypesProvider.register(107, 'pn-date-picker');
                fieldTypesProvider.register(124, 'pn-date-picker datetime');
                fieldTypesProvider.register(108, 'pn-masked-textbox pn-time-picker');
                fieldTypesProvider.register(109, 'pn-dropdownlist');
                fieldTypesProvider.register(110, 'pn-multiselect');
                fieldTypesProvider.register(111, 'memo');
                fieldTypesProvider.register(112, 'picture');
                fieldTypesProvider.register(113, 'pn-currency');
                fieldTypesProvider.register(118, 'pn-masked-textbox pn-national-code');
                fieldTypesProvider.register(119, 'pn-lookup');
            });

            return entityViewer;
});