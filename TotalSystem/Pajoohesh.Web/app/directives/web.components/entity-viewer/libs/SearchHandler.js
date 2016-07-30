define([], function (entityViewerControls) {
    var SearchHandler = function($element, fieldsStorage){
        this.$element = $element;
        this.fieldsStorage = fieldsStorage;
        this.searchIndex = 0;
    };

    SearchHandler.prototype.Search = function(value) {
        var fields = this.fieldsStorage.Get();
        for (var k = 0; k < fields.length; k++) {
            var obj = fields[k];
            obj.labelElem && obj.labelElem.removeClass('text-info');
        }

        if (!(value && value.length > 0)) {
            return;
        }

        var forFrom = this.searchIndex || 0;
        var forTo = fields.length;
        for (var i = forFrom; i < forTo; i++) {
            var obj = fields[i];
            if (obj.persianName && obj.persianName.indexOf(value) > 0) {
                var panelBody = this.$element.find('.entity-viewer-shell-body');
                panelBody.animate({
                    scrollTop: obj.labelElem.offset().top - panelBody.offset().top + panelBody.scrollTop() - 10
                }, 1000);

                this.searchIndex = i + 1 == forTo ? 0 : i + 1;
                obj.labelElem.addClass('text-info');

                if(obj.kendoOptions){
                    obj.editorElem.element.focus();
                }else{
                    obj.editorElem.focus();
                }
                break;
            }
            this.searchIndex = 0;
        }
        return this.searchIndex;
    }

    return SearchHandler;  
});