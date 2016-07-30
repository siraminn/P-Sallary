define(['directives/web.components/formula/services/pn.formula.services'], function (formulaServices){

formulaServices.service('formulaService', ['pn.remote.service', function (remoteService) {
    var getFormula = function (name) {
        remoteService.get(null, 'Home/GetFormula');
    };
    var saveFormula = function (items) {
        remoteService.post(items, 'Home/SaveFormula');
    };
    return {
        saveFormula: saveFormula,
        getFormula: getFormula
    };
  }]);

});