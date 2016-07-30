/// <reference path="controls/itemControl/itemControl.html" />

define([
        'directives/web.components/entity-viewer/controls/pn.entityViewer.controls', 
        'directives/web.components/entity-viewer/libs/FieldsStorage',
        'directives/web.components/entity-viewer/libs/SearchHandler',
        'directives/web.components/entity-viewer/libs/API',
    ], 
        function (entityViewerControls, FieldsStorage, SearchHandler, API) {

            function debounce(func, wait, immediate) {
                var timeout;
                return function() {
                    var context = this, args = arguments;
                    var later = function() {
                        timeout = null;
                        if (!immediate) func.apply(context, args);
                    };
                    var callNow = immediate && !timeout;
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                    if (callNow) func.apply(context, args);
                };
            };

            var init = function($scope, $element, $http, $compile ){
                $scope.childScopes = [];
                var initSingleColumn = function (response) {
                    $scope.meta = response.data.Entity;
                    response.data.Entity.FieldGroup.forEach(function(v, i) {
                       // var newVar = `<group options='groups[${i}]'></group>`;
                        var newVar = ["<group-control ", "options='groups[" + i + "]'", ">", "</group-control>"].join(" ");
                        $scope.groups.push({title: v.FieldGroup, FieldsList: v.FieldList});
                        var childScope = $scope.$new();
                        $scope.childScopes.push(childScope);
                        var el = $compile(newVar)(childScope);
                        $element.find('.children').append(el);
                    });
                    $scope.Api.setGroups($scope.groups);
                };

                var initMultiColumn = function (response) {
                    if (!response.data || !response.data.Entity || !response.data.Entity.FieldGroup) {
						console.error('incorrect response for meta data');
						return;
					}
                    $scope.meta = response.data;

                    var fields = [];
                    response.data.FieldGroup
                        .map(function(a) { 
                            return a.FieldList 
                        })
                        .forEach(function(group){
                            fields.concat(group);
                        })
                    ;
            
                    var groups = [];
                    var chunk = Math.ceil(fields.length  / $scope.options.columns);
                    var cols = 12 /  $scope.options.columns;

                    for (var i = 0; i < $scope.options.columns; i++) {
                        groups.push({
                            'Fields_FieldGroup': 'n/a',
                            'FieldsList': fields.slice(i*chunk, (i*chunk) + chunk)
                        });
                    }
                    groups.forEach(function(v, i) {
                        //var newVar = `<group class='col-md-${cols}' bare options='groups[${i}]'></group>`;
                        var newVar = ["<group-control ", "class='col-md-" + cols + "'", "bare", "options='groups[" + i +"]'", ">", "</group-control>"].join(' ');
                        $scope.groups.push({title: v.Fields_FieldGroup, FieldsList: v.FieldsList});

                        var childScope = $scope.$new();
                        $scope.childScopes.push(childScope);
                        var el = $compile(newVar)(childScope);
                        $element.find('.children').append(el);
                    });
                    $scope.Api.setGroups($scope.groups);
                };

                $scope.groups = [];

                var options = $scope.options;
                var initFunc = initSingleColumn;
                if($scope.options.columns && $scope.options.columns > 1){
                    initFunc = initMultiColumn;
                }
                
                $http.post(options.metaDataUri, [])
                    .then(initFunc)
                    //.error(function(){
                    //    console.log("cannot load metadata from ", options.metaDataUri);
                    //})
                ;

                $scope.fieldsStorage.Clean();
            };

            var controller = function ($scope, $element, $attrs, $transclude, $http, $compile, hotkeys, $timeout) {
                $scope.fieldsStorage = new FieldsStorage($element);
                $scope.searchHandle = new SearchHandler($element, $scope.fieldsStorage);
                $scope.Api = new API($element, $http, $scope.fieldsStorage, $scope.groups, $timeout);
                $scope.api = $scope.Api;

                $scope.options.columns = $scope.options.columns || 1;
                if ($scope.options.columns > 1) {
                    $scope.options.noFooter = true;
                }
                hotkeys.add({
                    combo: 'f3',
                    description: 'Search',
                    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                    callback: function(event) {
                        var index = $scope.searchHandle.Search($scope.search);
                        if(index === 0){
                            $element.find('.shell-input-search').focus();
                            $element.find('.shell-input-search').click();
                        }
                        event.preventDefault();
                    }
                });

                $scope.cleanData = function() {
                    $element.find('group').trigger('populate', [{}]);
                };

                $scope.searchNext = function() {
                    $scope.searchHandle.Search($scope.search);
                };

                $scope.memeoEditor = {
                    save: function() {
                        $scope.memeoEditor.callback($scope.memeoEditor.value);
                        $scope.memeoEditor.window.close();
                    }
                };

                $scope.$on('memeoEditor:open', function(e, value, callback) {
                    $scope.memeoEditor.value = value;
                    $scope.memeoEditor.callback = callback;
                    $scope.memeoEditor.window.open();
                    $scope.memeoEditor.window.center();
                });

                $scope.$watch('options', function(newValue, oldValue) {
                    $element.find('group-control').trigger('destroy', []);
                    if ($scope.childScopes) {
                        for (var i = 0; i < $scope.childScopes.length; i++) {
                            $scope.childScopes[i].$destroy();
                        }
                        $element.find('group-control').empty();
                        $element.find('group-control').remove();
                    }
                    init($scope, $element, $http, $compile);
                });

                this.getMetaData= function() {
                    return  $scope.meta;
                };
            };
    
            var compile = function(tElement, tAttrs, transclude) {
                tElement.find('.entity-viewer-shell-body').slimScroll({
                    position: 'left',
                    height: tAttrs.height,
                    railVisible: true
                    //alwaysVisible: true
                });

                return function (scope, elem, attr) {
                    scope.$on('entity-viewer:change', function (event, data) {
                        scope.onChange({ data: data });                       
                    });

                    var entityViewerLoadDebounce = debounce(function() {
                        scope.onReady();                        
                        remove_eventListner();              
            
                    }, 500);
                    var remove_eventListner = scope.$on('entity-viewer:change', entityViewerLoadDebounce)
                }
            };

            entityViewerControls.directive('pnEntityViewer', function factory() {
                var directiveDefinitionObject = {
                    priority: 0,
                    templateUrl: function(elem, attr) {
                        var url = "app/directives/web.components/entity-viewer/pn-entity-viewer.html";
                        if(typeof(attr.bare) !== "undefined")
                            url = "app/directives/web.components/entity-viewer/pn-entity-viewer.bare.html";
                        return url;
                    },           
                    restrict: 'E',
                    scope: {
                        title: '@',
                        options: '=',
                        onChange: '&',
                        onReady: '&',
                        api: '=',
                        height: '@'
                    },
                    controller: controller,
                    controllerAs: 'vm',
                    compile: compile
                };
                return directiveDefinitionObject;
            });
});
