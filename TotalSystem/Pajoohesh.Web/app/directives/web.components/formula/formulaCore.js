var collectionTypeEnum = Object.freeze({ "mathematicalOperator": 1, "parantez": 2, "logicalOperator": 3, "comparisonOperator": 4, "conditionalOperator": 5, "fieldOperations": 6, "  ": 7 });
var parantezEnum = Object.freeze({ "openParantez": 8, "closeParantez": 9 });
var mathematicalOperatoEnum = Object.freeze({ "plus": 10, "minus": 11, "division": 12, "korrutada": 13, "power": 14 });
var fieldOperationsEnum = Object.freeze({ "numeric": 15, "variable": 16, "field": 17, "function": 18 });
var comparisonOperatorEnum = Object.freeze({ "equal": 19, "greater": 20, "less": 21, "greaterEqual": 22, "lessEqual": 23 });
var linearSingleOperatorEnum = Object.freeze({ "comment": 24, "group": 25,"beforLine": 26, "afterLine": 27});
var plusTypeItemNext = [parantezEnum.openParantez, fieldOperationsEnum.numeric, fieldOperationsEnum.variable, fieldOperationsEnum.field, fieldOperationsEnum.function];
var minusTypeItemNext = [parantezEnum.openParantez, fieldOperationsEnum.numeric, fieldOperationsEnum.variable, fieldOperationsEnum.field, fieldOperationsEnum.function];
var korrutadaTypeItemNext = [parantezEnum.openParantez, fieldOperationsEnum.numeric, fieldOperationsEnum.variable, fieldOperationsEnum.field, fieldOperationsEnum.function];
var divisionTypeItemNext = [parantezEnum.openParantez, fieldOperationsEnum.numeric, fieldOperationsEnum.variable, fieldOperationsEnum.field, fieldOperationsEnum.function];
var powerTypeItemNext = [fieldOperationsEnum.numeric];
var openParantezTypeItemNext = [parantezEnum.openParantez, fieldOperationsEnum.variable, fieldOperationsEnum.numeric, fieldOperationsEnum.field, fieldOperationsEnum.function];
var closeParantezTypeItemNext = [parantezEnum.closeParantez, mathematicalOperatoEnum.plus, mathematicalOperatoEnum.minus, mathematicalOperatoEnum.division,mathematicalOperatoEnum.power];
var variableItemNext = [parantezEnum.closeParantez, mathematicalOperatoEnum.plus, mathematicalOperatoEnum.minus, mathematicalOperatoEnum.division, mathematicalOperatoEnum.korrutada, mathematicalOperatoEnum.power, comparisonOperatorEnum.equal];
var fieldOperationsItemNext = [parantezEnum.closeParantez, mathematicalOperatoEnum.plus, mathematicalOperatoEnum.minus, mathematicalOperatoEnum.division, mathematicalOperatoEnum.korrutada, mathematicalOperatoEnum.power];
var linearSingleOperatorItemNext = [];

var comparisonOperatorTypeItemNext = [fieldOperationsEnum.numeric, fieldOperationsEnum.variable, fieldOperationsEnum.function, fieldOperationsEnum.field, parantezEnum.openParantez, ];

function inherit(base, methods) {
    var sub = function () {
        base.apply(this, arguments); // Call base class constructor

        // Call sub class initialize method that will act like a constructor
        this.initialize.apply(this, arguments);
    };
    sub.prototype = Object.create(base.prototype);
    $.extend(sub.prototype, methods);
    return sub;
}



var baseItem = function () {
    this.collectionType = "";
    this.caption = "";
    this.script = "";
    this.tag = 0;
    this.tagStr = "";
    this.hint = "";
    this.class = "";
    this.nextTypeItem = [];
};
$.extend(baseItem.prototype, {
    validationTypeItemNext: function (nextItem) {
      return this.nextTypeItem.indexOf(nextItem.typeItem) !== -1;
    },
    createItem : function(){
        this.add();
    },
});
baseItem.prototype.add = function () {
  
};
var mathematical = inherit(baseItem, {
    initialize: function (caption, script, tag, typeItem, tagStr) {
        this.caption = caption;
        this.script = script;
        this.tag = tag;
        this.tagStr = tagStr;
        this.collectionType = collectionTypeEnum.mathematicalOperator;
        this.typeItem = typeItem;
        switch (typeItem) {
            case mathematicalOperatoEnum.plus:
                this.class = "item-mathematical";
                this.nextTypeItem = plusTypeItemNext;
                break;
            case mathematicalOperatoEnum.minus:
                this.class = "item-mathematical";
                this.nextTypeItem = minusTypeItemNext;
                break;
            case mathematicalOperatoEnum.division:
                this.class = "item-mathematical";
                this.nextTypeItem = divisionTypeItemNext;
                this.class = "item-mathematical";
                break;
            case mathematicalOperatoEnum.korrutada:
                this.class = "item-mathematical";
                this.nextTypeItem = korrutadaTypeItemNext;
                break;
            case mathematicalOperatoEnum.power:
                this.class = "item-mathematical";
                this.nextTypeItem = powerTypeItemNext;
                break;
        }
    },
});

var parantez = inherit(baseItem, {
    initialize: function (caption, script, tag, typeItem, tagStr) {
        this.caption = caption;
        this.script = script;
        this.tag = tag;
        this.tagStr = tagStr;
        this.isvalid = true;
        this.collectionType = collectionTypeEnum.parantez;
        this.typeItem = typeItem;
        switch (typeItem) {
            case parantezEnum.openParantez:
                this.class = "item-parantez";
                this.nextTypeItem = openParantezTypeItemNext;
                break;
            case parantezEnum.closeParantez:
                this.class = "item-parantez";
                this.nextTypeItem = closeParantezTypeItemNext;
                break;
        }
    },
});
var fieldOperations = inherit(baseItem, {
    initialize: function (caption, script, tag, typeItem, tagStr) {
        this.caption = caption;
        this.script = script;
        this.tag = tag;
        this.tagStr = tagStr;
        this.collectionType = collectionTypeEnum.fieldOperations;
        this.typeItem = typeItem;
        this.nextTypeItem = fieldOperationsItemNext;
        switch (typeItem) {
            case fieldOperationsEnum.variable:
                this.class = "item-field";
                this.nextTypeItem = variableItemNext;
                break;
            default:
                this.class = "item-field";
                 this.nextTypeItem = fieldOperationsItemNext;
                break;
        }
    },
});

var comparisonOperator = inherit(baseItem, {
    initialize: function (caption, script, tag, typeItem, tagStr) {
        this.caption = caption;
        this.script = script;
        this.tag = tag;
        this.tagStr = tagStr;
        this.collectionType = collectionTypeEnum.fieldOperations;
        this.class = "item-comparison";
        this.typeItem = typeItem;
        this.nextTypeItem = comparisonOperatorTypeItemNext;
    },
});
var linearSingleOperator = inherit(baseItem, {
    initialize: function (caption, script, tag, typeItem, tagStr) {
        this.caption ="--"+caption;
        this.script = "++"+script;
        this.tag = tag;
        this.tagStr = tagStr;
        this.collectionType = collectionTypeEnum.linearSingleOperator;
        this.class = "item-linearSingle";
        this.typeItem = typeItem;
        this.nextTypeItem = linearSingleOperatorItemNext;
        
    },
});