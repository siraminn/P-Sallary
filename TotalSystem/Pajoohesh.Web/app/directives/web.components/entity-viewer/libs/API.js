define([], function (entityViewerControls) {
    
    var simplifyData = function(data) {
        var simplifiedData = {};
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].length; j++) {
                var value = data[i][j].value;
                if(typeof(data[i][j].value_typeSafe) !== "undefined")
                    value = data[i][j].value_typeSafe;
                simplifiedData[data[i][j].latinName] = value;
            }
        }
        return simplifiedData;
    };

    var API = function($element, $http, fieldsStorage, groups, $timeout ){
        this.$element = $element;
        this.$http = $http;
        this.fieldsStorage = fieldsStorage;
        this.groups = groups;
        this.searchIndex = 0;
        this.$timeout = $timeout;
    };

    API.prototype.loadByUrl = function(url) {
        var errorHandler = function(){
            console.log("entity-viewer", "caanot load data from url");
        };

        this.$http.post(url, []).then(function(response) {
            this.$element.find('group-control').trigger('populate', [response.data]);
        }, errorHandler);
    }

    API.prototype.load = function(json) {
        this.$element.find('group-control').trigger('populate', [json]);
    }

    API.prototype.getField = function(index) {
        var fields = this.fieldsStorage.Get();
        if (isNaN(index)) {
            var field;
            fields.forEach(function(v) {
                if (v.latinName === index)
                    field = v;
            });
            return field;
        }
        return fields[index];
    }


    API.prototype.setFilter = function (nameOrIndex, filter ) {
        var field = API.prototype.getField(nameOrIndex);
        if (field && field.lookup) {
            if (!field.lookup.filter) {
                field.lookup.filter = filter;
            } else if (field.lookup.filter.filters) {
                field.lookup.filter.filters.push(filter);
            }
        }
         
    }

    API.prototype.setFormAndSystemIdFilter = function (nameOrIndex, formId, systemId) {
        debugger;
        var groupData = [];
        this.$element.find('group-control').trigger('get-data', [groupData]);
        groupData.forEach(function (data) {
            data.forEach(function (field) {
                if (field.latinName===nameOrIndex) {
                    field.lookup.FormId = formId;
                    field.lookup.SystemId = systemId;
                }
            });
        });
         
    }


    API.prototype.getFieldsCount = function() {
        return this.fieldsStorage.Get().length;
    }
    API.prototype.setGroups = function(groups) {
        this.groups = groups;
    }
    API.prototype.getGroups = function() {
        return this.groups;
    }
    API.prototype.getData = function(cb) {
        var data = [];
        this.$element.find('group-control').trigger('get-data', [data]);
        cb(simplifyData(data));
    }
    
    API.prototype.isValid = function(cb) {
        var groupData = [];
        this.$element.find('group-control').trigger('get-data', [groupData]);
        var invalids = [];
        groupData.forEach(function (data) {
            data.forEach(function (field) {
                
                if (field.required && (field.value == undefined || field.value.length === 0) && field.isPrimarykey===false) {
                    invalids.push(field);
                }
            });
        });

        cb(invalids);
    }

    API.prototype.disable = function() {
        var fields = this.fieldsStorage.Get();
        this.$timeout(function() {
            fields.forEach(function (v) {
                v.disabled = true;
            });
        }, 0);
    }
    API.prototype.enable = function() {
        var fields = this.fieldsStorage.Get();
        fields.forEach(function(v) {
            v.disabled = false;
        });
    }

    return API;  
});