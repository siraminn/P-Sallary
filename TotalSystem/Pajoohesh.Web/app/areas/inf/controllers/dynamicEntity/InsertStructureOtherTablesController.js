define(['app'], function (app) {
    app.controller("InsertStructureOtherTablesController",
        ["$scope", "close", "title", "message", "yesTitle", "noTitle", "isQuestion", "cache", "infWebAccess", "structureTableService",
  function ($scope, close, title, message, yesTitle, noTitle, isQuestion, cache, WebAccess, structureTableService) {


      //در یافت اطلاعات از  فیلد ساختار سایر جداول
      var lookupText = null;
      if (structureTableService.getJson() != "") {
          lookupText = JSON.parse(structureTableService.getJson());
      }
      //  If State Changed 
      var isDoInsertClicked = false;

      //پارامتر های مورد نیاز 
      $scope.cacheDynamicEntity = cache.dynamicEntity;
 
      $scope.dynamicEntity = {};
      $scope.dynamicField = {};

      // ایجاد پاپ آپ
      $scope.title = title;
      $scope.message = message;
      $scope.yesTitle = yesTitle;
      $scope.noTitle = noTitle;
      $scope.isQuestion = isQuestion;

      if (yesTitle === null) {
          $scope.yesTitle = 'بلی';
      }
      if (noTitle === null) {
          $scope.yesTitle = 'خیر';
      }

      //--------------------- Create Json Data  ---------------------------
      var createJsonOtherTable = {
          url: "",
          table: "",
          textField: "",
          valueField: "",
          fields: []
      }
      var field = {
          latinName: "",
          persianName: "",
          length: "",
          minRange: "",
          maxRange: "",
          allowDuplicate: true,
          required: true,
          typeKey: "",
          items: "",
          selectedItems: false,
          showInSearchPanel: false,
          showInGrid: true
      }

      //--------------------- Getting Fields Data  ---------------------------
      $scope.onSelectRow = function (data) {
          var objJSON = data;

          if (objJSON.BackingField)
              createJsonOtherTable.valueField = objJSON.FieldsKey;
          if (objJSON.ShowField)
              createJsonOtherTable.textField = objJSON.FieldsKey;

          var isExists = false;
          for (var i = 0; i < createJsonOtherTable.fields.length; i++) {
              if (createJsonOtherTable.fields[i].latinName == objJSON.LatinName) {
                  isExists = true;
                  createJsonOtherTable.fields[i].showInSearchPanel = (typeof objJSON.SearchField == 'undefined' || objJSON.SearchField == null) ? false : objJSON.SearchField;
                  createJsonOtherTable.fields[i].showInGrid = (typeof objJSON.ListField == 'undefined' || objJSON.ListField == null) ? false : objJSON.ListField;
                  $scope.markSelectedItems();
              }
          }
          if (!isExists) {
              field.latinName = objJSON.LatinName;
              field.persianName = objJSON.PersianName;
              field.length = objJSON.Length;
              field.minRange = objJSON.minRange;
              field.maxRange = objJSON.MaxRange;
              field.allowDuplicate = objJSON.IsRepeated;
              field.required = true;
              field.typeKey = objJSON.TypesCode;
              field.items = "";
              field.showInGrid = (typeof objJSON.ListField == 'undefined' || objJSON.ListField == null) ? false : objJSON.ListField;
              field.showInSearchPanel = (typeof objJSON.SearchField == 'undefined' || objJSON.SearchField == null) ? false : objJSON.SearchField;
              var newField = angular.copy(field);
              createJsonOtherTable.fields.push(newField);
              //در صورت انتخاب هر یک از آیتم ها
              if ($scope.markSelectedItems()) {
                  $scope.$apply(function () {
                      data.SelectedItems = true;
                  });
              }
          }
      }

      // دریافت اطلاعات 
      $scope.close = function (result) {
          var r = {
              dialogResult: result,
              data: createJsonOtherTable
          }
          close(r, 500);
      };

      //در صورت انتخاب هر یک از آیتم ها
      $scope.markSelectedItems = function () {
          if (field.showInSearchPanel !== false || field.showInGrid !== false || field.selectedItems != false ||
              createJsonOtherTable.valueField != null || createJsonOtherTable.textField != null) {
              field.selectedItems = true;
              return true;
          }
          return false;
      };

      //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  Tables  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++    
      //انتخاب سطر جداول
      $scope.TablesGrid_onDataBound = function (kendo) {
          setTimeout(function () {
              kendo.select(kendo.tbody.find('tr:first'));
          },100);         
      }

      //***************  نمایش اطلاعات در گرید دوم*****************
      $scope.FieldsArray = [];
      $scope.objkendo;
      $scope.objoptions;

      $scope.Fields_onKendoReady = function (kendo, options) {
          $scope.objkendo = kendo;
          $scope.objoptions = Option;
      };

      //***********************دریافت اطلاعات از گرید************************
      $scope.showGridSelectedRowInTablesForm = function (entity) {
          if (lookupText!=null) {
              for (var i = 0; i < entity.AllFields.length; i++) {
                  var currentEntity = $.grep(lookupText.fields, function (e) { return e.latinName == entity.AllFields[i].LatinName; })[0];
                  if (currentEntity) {
                      entity.AllFields[i].SelectedItems = currentEntity.selectedItems;
                      entity.AllFields[i].ListField = currentEntity.showInGrid;
                      entity.AllFields[i].SearchField = currentEntity.showInSearchPanel;

                  }
                  if (entity.AllFields[i].FieldsKey == lookupText.valueField) {
                      entity.AllFields[i].BackingField = lookupText.valueField;
                  }
                  if (entity.AllFields[i].FieldsKey == lookupText.textField) {
                      entity.AllFields[i].ShowField = lookupText.textField;
                  }
                  if ((angular.isDefined(entity.AllFields[i].SelectedItems) && entity.AllFields[i].SelectedItems == false) && entity.AllFields[i].ListField || entity.AllFields[i].SearchField ||
                      entity.AllFields[i].BackingField && entity.AllFields[i].ShowField) {
                      entity.AllFields[i].SelectedItems = true;
                  }
              }
          }
        
          $scope.objoptions.dataSource = entity.AllFields;
          $scope.objkendo.setOptions($scope.objoptions);
          $scope.objkendo.dataSource.pageSize(100);        
      };

      //****************** grid Config Tables ******************* 
      $scope.selectedTablesItems = [];
      $scope.gridConfigTables = {
          autoSize: true,
          inlineOperationalUrl: {
              read: {
                  url: WebAccess + "api/DynamicEntity/GetAllTables",
                  data: { Key: $scope.cacheDynamicEntity.DynamicEntityKey, EnglishName: (lookupText == null ? "" : lookupText.table) }
              }
          },
      };

      //********** grid Columns Tables *************
      $scope.gridColumnsTables = [
              {
                  field: 'EnglishName',
                  editable: false,
                  title: "شرح لاتین",
                  allownull: false,
                  width: 130,
                  attributes: { style: "text-align:left" }
              },
              {
                  field: 'PersianName',
                  editable: false,
                  title: "شرح فارسی",
                  allownull: false,
                  width: 130
              }
      ];

      //********* grid Schema Tables ************
      $scope.gridSchemaTables = {
          //serverPaging: false,         
          model: {
              id: 'Id',
              fields: {
                  Code: {
                      type: 'number',
                      editable: false
                  }
              }
          },

          data: 'Entities',
          total: 'TotalCount'
      };

      //********* watch ***********
      $scope.$watch('selectedTablesItems', function (newVal, oldVal) {
          if ($scope.selectedTablesItems.length <= 0)
              return;
          $scope.showGridSelectedRowInTablesForm($scope.selectedTablesItems[0]);
         // cache.dynamicEntity = $scope.selectedTablesItems[0];
          createJsonOtherTable.table = cache.dynamicEntity.EnglishName;
          createJsonOtherTable.fields = [];
          createJsonOtherTable.textField = "";
          createJsonOtherTable.url = "";
          createJsonOtherTable.valueField = "";
      });

      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  Fields   ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

      //******************gridConfig*******************   
      $scope.selectedFieldsItems = [];
      $scope.gridConfigFields = {
          autoSize: true,
          inlineOperationalUrl: {
              read: {

              }
          }
      };

      //******************gridColumns******************
      $scope.gridColumnsFields = [
          {
              field: 'FieldCode',
              editable: false,
              title: "کد ",
              allownull: false,
              width: 90,
              attributes: { style: "text-align:Center" }
          },
          {
              field: 'LatinName',
              editable: false,
              title: "شرح لاتین",
              allownull: false,
              width: 130,
              attributes: { style: "text-align:left" }
          },
          {
              field: 'PersianName',
              editable: false,
              title: "شرح فارسی",
              allownull: false,
              width: 130
          },
          {
              field: 'FieldAlias',
              editable: false,
              title: "شرح مستعار",
              allownull: false,
              width: 130
          },
          {
              field: 'SelectedItems',
              editable: false,
              title: "انتخاب موارد",
              allownull: false,
              width: 100,
              attributes: { style: "text-align:Center" },
              template: '<input type="checkbox" class="selected" ng-model=\"this.dataItem.SelectedItems\"  ng-checked=\"this.dataItem.SelectedItems\" ng-disabled="false" />'
          },
          {
              field: 'BackingField',
              editable: false,
              title: "فیلد بازگشتی ",
              allownull: false,
              width: 100,
              attributes: { style: "text-align:Center" },
              template: '<input type="radio"  name="BackingFields" ng-model=\"this.dataItem.BackingField\" class="selected"  ng-checked=\"this.dataItem.BackingField\" ng-value=\" this.dataItem.FieldsKey\" ng-disabled="false" />'
          },
          {
              field: 'ShowField',
              editable: false,
              title: "فیلد نمایشی ",
              allownull: false,
              width: 100,
              attributes: { style: "text-align:Center" },
              template: '<input type="radio" name="showFields" ng-model=\"this.dataItem.ShowField\"  class="selected"   ng-checked=\"this.dataItem.ShowField\" ng-value= \"this.dataItem.FieldsKey \" ng-disabled="false" />'
          },
          {
              field: 'ListField',
              editable: false,
              title: "فیلد لیست  ",
              allownull: false,
              width: 100,
              attributes: { style: "text-align:Center" },
              template: '<input type="checkbox" class="selected" ng-model=\"this.dataItem.ListField\" ng-checked=\"this.dataItem.ListField\" ng-disabled="false" />'
          },
          {
              field: 'SearchField',
              editable: false,
              title: "فیلد جستجو",
              allownull: false,
              width: 130,
              attributes: { style: "text-align:Center" },
              template: '<input type="checkbox" class="selected" ng-model=\"this.dataItem.SearchField\" ng-checked=\"this.dataItem.SearchField\" ng-disabled="false" />'

          }

      ];

      //انتخاب سطر فیلد 

      //******************gridSchema*******************
      $scope.gridSchemaFields = {
          serverPaging: true,
          model: {
              id: 'Id',
              fields: {
                  Code: {
                      type: 'number',
                      editable: false
                  },
              }

          },
          data: 'Entities',
          total: 'TotalCount'
      };
      // The End   
  }]);
});