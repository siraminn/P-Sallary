define(['directives/web.components/entity-viewer/controls/pn.entityViewer.controls'], function (entityViewerControls) {
   
    var controller = function ($scope, $element, $attrs, $rootScope, $compile, fieldTypes) {
        var options = $scope.options;
        $scope.fieldsOptions = [];
        $scope.childScopes = [];
        options.FieldsList.forEach(function(v, i) {
            var tag = fieldTypes.getTag(v.typeKey);
            $scope.fieldsOptions.push(v);

            var template = '';
            if (tag.indexOf("pn")  === 0) {
                //template = `<general tag="${tag}" value="fieldsOptions[${i}].value" class='group-child' options='fieldsOptions[${i}]' data-key='${v.latinName}'></general>`;
                template = ["<item-control", "tag='" + tag+ "'", "value='fieldsOptions["+ i +"].value'", "class='group-child'", "options='fieldsOptions[" + i + "]'", "data-key='" + v.latinName +"'", ">", "</item-control>"].join(" ");
                //template = "<item-control tag='" + tag+ "' value='fieldsOptions["+ i +"].value' class='group-child' options='fieldsOptions[" + i + "]' data-key='" + v.latinName +"' ></item-control>";
            } else {
                //template = `<${tag} value="fieldsOptions[${i}].value" class='group-child' options='fieldsOptions[${i}]' data-key='${v.latinName}'></${tag}>`;
                template = ["<" + tag, "value='fieldsOptions["+ i +"].value'", "class='group-child", "options='fieldsOptions[" + i + "]'", "data-key='" + v.latinName +"'", ">", "</" + tag + ">"].join(" ");
            }

            if(v.IsIdentity || v.IsPrimarykey){
                template = '';
            }

             if(v.isIdentity || v.isPrimarykey){
                template = '';
            }


            var childScope = $scope.$new();            
            $scope.childScopes.push(childScope);

            var el = $compile( template )( $scope );
            $element.find('.fields').append( el );

            $scope.$watch('fieldsOptions['+ i +'].value', function( newValue, oldValue){                
                $rootScope.$broadcast('entity-viewer:change', {
                    newValue: newValue,
                    oldValue: oldValue,
                    fieldKey: v.key,
                    fieldLatinName: v.latinName
                });
            })
        });
    };

    entityViewerControls.directive('groupControl', function factory() {
        var directiveDefinitionObject = {
            priority: 0,
            templateUrl: function(elem, attr) {
                var url = "app/directives/web.components/entity-viewer/controls/GroupControl/group-control.html";
                if(typeof(attr.bare) !== "undefined")
                    url = "app/directives/web.components/entity-viewer/controls/GroupControl/group-control.bare.html";
                return url;
            },
            restrict: 'E',
            scope: {
                options: '='
            },
            controller: controller,
            link: function(scope, elem, attr){
                elem.find('.panel-heading').click(function(){
                    elem.find('.panel-body').slideToggle();
                });
                elem.on('get-data', function(e, data){
                    data.push(scope.fieldsOptions);
                });
                elem.on('get-fields', function(e, data) {
                    scope.fieldsOptions.forEach(function(v, i){
                        if(v['get-fields'] && typeof (v['get-fields']) === 'function'){
                            data.push(v['get-fields']());
                        }else{
                            data.push(v);
                        }
                    });
                });
                elem.on('populate', function (e, data) {
                    for (var i = 0; i < scope.fieldsOptions.length; i++) {
                       
                        var field = scope.fieldsOptions[i];
                        field.value = data[field.latinName];
                        if (field.typeKey == 119) {
                            field.text = data[field.latinName + "_Text"];
                        }
                         
                        
                    }
                });
                elem.on('destroy', function(e, data) {
                    for (var i = 0; i < scope.childScopes.length; i++) {
                        var childScope = scope.childScopes[i];
                        childScope.$destroy();
                    }
                    $(elem).empty();
                });
            }
        };
        return directiveDefinitionObject;
    });
 
    
});

