define([], function () {
    var FieldsStorage = function($element){
        this.$element = $element;
        this.fields = [];
    };

    FieldsStorage.prototype.Clean = function() {
        this.fields = [];
    }

    FieldsStorage.prototype.Get= function(){
        if (this.fields.length == 0) {
            this.fields = [];
            this.$element.find('group-control').trigger('get-fields', [this.fields]);
        }
        return this.fields;
    }

    return FieldsStorage;  
});