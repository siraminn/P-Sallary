define(['directives/web.components/formula/formulaCore',
        'directives/web.components/formula/services/pn.formula.services',
        'directives/web.components/formula/controls/pn.formula.controls',
        'directives/web.components/formula/controls/formula/pn-formula',
        'directives/web.components/formula/controls/fourmulaToolbar/pn-formula-toolbar'], function(){
    var formula = angular.module('formulaModule', []);
    return formula;
});