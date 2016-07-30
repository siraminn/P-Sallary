define(['directives/web.components/entity-viewer/services/pn.entityViewer.services'], function (entityViewerServices) {
    entityViewerServices.provider('fieldTypes', [function () {
        var registry = [];
        this.register = function (type, tag) {
            var indexOf = registry.map(function (x) {
                return x.type;
            }).indexOf(type);
            if (indexOf !== -1) {
                registry.splice(indexOf, 1);
            }
            registry.push({tag: tag, type: type});
        };
        this.$get = function () {
            return {
                getTag: function (type) {
                    for (var i = 0; i < registry.length; i++) {
                        var t = registry[i];
                        if (t.type == type)
                            return t.tag
                    }
                    return 'debug-place-holder';
                }
            }
        };
    }]);
});