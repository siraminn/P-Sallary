define(['directives/controls/pnControls'], function (control) {
    control.directive('pnRibbon', ["pn.remote.service", "pn.array", "$http", "$compile", "$rootScope", "$state", "infWebAccess", "$stickyState", "$timeout", "$q",
        function (pnRemoteResvice, pnarray, $http, $compile, $rootScope, $state, WebAccess, $stickyState, $timeout, $q) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: "app/partials/directives/ribbon.html",
                link: function (scope, element) {

                    scope.toolbars = [];
                    $rootScope.toolbar = {};
                    $rootScope.openedTaps = [];
                    $rootScope.tabItems = [];

                    $rootScope.toolbar.apply = function (toolbars) {

                        scope.ShowRibbonTabConfiguration();

                        element.find('.ribbon-tab:first').find('.ribbon-button').hide();
                        element.find('.toolbar-btn').show();

                        for (var i = 0; i < toolbars.length; i++) {
                            var htmlElement;
                            if (toolbars[i].LatinName != null) {
                                htmlElement = element.find('div[name=' + toolbars[i].LatinName + "]");
                                htmlElement.show();
                                if (toolbars[i].Disabled === "") {
                                    htmlElement.removeClass("disabled");
                                }
                                else {
                                    htmlElement.addClass("disabled");
                                }
                            }
                            htmlElement = element.find('input[name="' + toolbars[i].LatinName + '"]');

                            htmlElement.val(toolbars[i].Description);


                            var img = element.find('img[name="' + toolbars[i].LatinName + '"]');
                            img.attr('src', toolbars[i].Icon);

                            htmlElement = element.find("#" + toolbars[i].Order);
                            htmlElement.css("visibility", toolbars[i].Visibility);

                            var nextHtmlElement = htmlElement.next("div");
                            nextHtmlElement.css("visibility", toolbars[i].Visibility);
                            var button = htmlElement.find("input[type=button]");

                            if (toolbars[i].Disabled === "disabled") {
                                button.attr("ng-disabled", "true");
                            }
                            else {
                                button.attr("ng-disabled", "false");
                            }

                            htmlElement.css("visibility", toolbars[i].Visibility);
                        }

                    }

                    scope.disableToolbar = function () {

                        var header0 = element.find("#ribbon-tab-header-0");
                        header0.removeClass("sel");
                        header0.css("display", "none");
                        var tab0 = element.find("#format-tab0");
                        tab0.css("display", "none");
                        var header1 = element.find("#ribbon-tab-header-1");
                        header1.addClass("sel");
                        var tab1 = element.find("#format-tab1");
                        tab1.css("display", "block");

                    }
                    scope.enableToolbar = function () {


                        angular.forEach($rootScope.tabItems, function (tab) {
                            if (tab.isActive) {
                                $rootScope.toolbar.apply(tab.toolbar);
                                //TODO: Risky ... //
                                scope.toolbars = tab.toolbar;
                            }
                        });


                        $(".ribbon-tab-header").removeClass('sel');
                        $(".ribbon-tab").css("display", 'none');
                        var header = element.find('#ribbon-tab-header-0');
                        header.css('display', 'inline');
                        header.addClass('sel');
                        var tab = element.find('#format-tab0');
                        tab.css('display', 'block');

                        scope.RibbonTabConfiguration();
                    }


                    scope.ShowRibbonTabConfiguration = function () {
                        element.find('.ribbon-tab:first').find("[name='toolbar-btn']").each(function () {
                            var elem = angular.element(this);
                            elem.show();
                            elem.next('.ribbon-section-sep').show();
                        });
                    }

                    scope.RibbonTabConfiguration = function () {
                        element.find('.ribbon-tab:first').find("[name='toolbar-btn']").each(function () {
                            var elem = angular.element(this);
                            if (elem.find('.ribbon-button:visible').length == 0) {
                                elem.hide();
                                elem.next('.ribbon-section-sep').hide();
                            }
                        });
                    }

                    $rootScope.add = function (title, action, systemId, featureId) {
                        for (var i = 0; i < $rootScope.tabItems.length; i++) {
                            if ($rootScope.tabItems[i].action === action) {
                                $rootScope.tabItems[i].isActive = true;
                                if ($rootScope.openedTaps.indexOf($rootScope.tabItems[i]) === -1)
                                    $rootScope.openedTaps.push($rootScope.tabItems[i]);
                                $rootScope.onClickTab($rootScope.tabItems[i]);
                                break;
                            }
                        }
                        setTabState(title, action, systemId, featureId);
                        $state.go(action);
                    }

                    function setTabState(title, action, systemId, featureId) {
                        $rootScope.CurrenTabState = {
                            title: title,
                            action: action,
                            systemId: systemId,
                            featureId: featureId
                        };
                    }

                    scope.SetEnableButton = function (stausButton) {

                        angular.forEach(scope.toolbars, function (item, index) {

                            if (item.LatinName == 'Delete' || item.LatinName == 'Add' || item.LatinName == 'Edit') {
                                if (stausButton == true) {
                                    item.Disabled = '';
                                }
                                else {
                                    item.Disabled = 'disabled';
                                }
                            }
                            else if (item.LatinName == 'Cancel' || item.LatinName == 'Apply') {
                                if (stausButton == true) {
                                    item.Disabled = 'disabled';
                                }
                                else {
                                    item.Disabled = '';
                                }
                            }
                        });


                        $rootScope.toolbar.apply(scope.toolbars);

                        scope.RibbonTabConfiguration();
                    }
                    $rootScope.close = function (tab) {
                        scope.DoDispose().then(function (result) {
                            if (result) {
                                var sc = { action: tab.action }
                                var rs = pnarray.serach($rootScope.openedTaps, sc);
                                var index = rs.index;
                                var len = $rootScope.openedTaps.length - 1;

                                var nextTabAfterClose;
                                var activeIndex;
                                var currentTab;

                                if (len === index) {
                                    if (index === 0) {
                                        $rootScope.openedTaps.splice(0, 1);
                                        currentTab = "home";
                                        $state.go(currentTab);
                                    } else {
                                        currentTab = $rootScope.openedTaps[len - 1].action;
                                        if (len === 0) {
                                            nextTabAfterClose = 0;
                                        } else {
                                            nextTabAfterClose = len - 1;
                                        }
                                        activeIndex = $rootScope.openedTaps[nextTabAfterClose];
                                        $rootScope.onClickTab(activeIndex);
                                        $rootScope.openedTaps.splice(index, 1);
                                        $state.go(currentTab);
                                    }
                                } else {
                                    if (index === 0) {
                                        nextTabAfterClose = 1;
                                    } else {
                                        nextTabAfterClose = index + 1;
                                    }
                                    activeIndex = $rootScope.openedTaps[nextTabAfterClose];
                                    $rootScope.onClickTab(activeIndex);
                                    $rootScope.openedTaps.splice(index, 1);
                                    currentTab = $rootScope.openedTaps[index].action;
                                    $state.go(currentTab);
                                }

                                if ($rootScope.openedTaps.length === 0) {
                                    scope.disableToolbar();
                                }

                                $timeout(function () {
                                    $stickyState.reset(tab.action);
                                }, 0);
                            }
                        });
                    }
                    $rootScope.onClickTab = function (tab) {
                        angular.forEach($rootScope.tabItems, function (tabItem) {
                            if (tab.action === tabItem.action) {
                                tabItem.isActive = true;
                            }
                            else {
                                tabItem.isActive = false;
                            }
                        });
                        scope.enableToolbar();
                        setTabState(tab.title, tab.action, tab.systemId, tab.featureId);
                    }


                    scope.$on("toolbar:doEdit", function () {
                        scope.DoEdit();
                    });
                    scope.$on("toolbar:doInsert", function () {
                        scope.DoInsert();
                    });
                    scope.$on("toolbar:doDelete", function () {
                        scope.DoDelete();
                    });
                    scope.$on("toolbar:doApplay", function () {
                        scope.DoApplay();
                    });
                    scope.$on("toolbar:doCancel", function () {
                        scope.DoCancel();
                    });
                    scope.$on("toolbar:DoBtnUser1", function () {
                        scope.DoBtnUser1();
                    });
                    scope.$on("toolbar:DoRibbonFalse", function () {
                        scope.SetEnableButton(false);
                    });
                    scope.$on("toolbar:DoRibbonTrue", function () {
                        scope.SetEnableButton(true);
                    });


                    function getActiveFormScope() {
                        var form = $('.acitveForm:visible');
                        return angular.element(form).scope();
                    }

                    scope.DoInsert = function () {
                        var formScope = getActiveFormScope();
                        formScope.doInsert().then(function (result) {
                            scope.SetEnableButton(!result);
                        });
                    }
                    scope.DoDispose = function () {
                        var defferd = $q.defer();
                        var formScope = getActiveFormScope();
                        if (formScope.doDispose != undefined) {
                            formScope.doDispose().then(function(result) {
                                defferd.resolve(result);
                            });
                        } else {
                            defferd.resolve(true);
                        }
                        return defferd.promise;
                    }
                    scope.DoEdit = function () {
                        var formScope = getActiveFormScope();
                        formScope.doEdit().then(function (result) {
                            scope.SetEnableButton(!result);
                        });
                    }
                    scope.DoDelete = function () {
                        var formScope = getActiveFormScope();
                        formScope.doDelete().then(function (result) {
                            scope.SetEnableButton(!result);
                        });
                    }
                    scope.DoApplay = function () {
                        var formScope = getActiveFormScope();
                        formScope.doApplay().then(function (result) {
                            scope.SetEnableButton(result);
                        });
                    }
                    scope.DoCancel = function () {
                        var formScope = getActiveFormScope();
                        formScope.doCancel().then(function (result) {
                            scope.SetEnableButton(result);
                        });
                    }
                    scope.DoReport = function () {
                        scope.formInfo();
                    }
                    scope.DoArchive = function () {
                        scope.formInfo();
                    }
                    scope.DoWorkflow = function () {
                        scope.formInfo();
                    }
                    scope.DoRefresh = function () {
                        scope.formInfo();
                    }
                    scope.DoLoadlog = function () {
                        scope.formInfo();
                    }
                    scope.DoLog = function () {
                        scope.formInfo();
                    }

                    scope.DoBtnUser1 = function () {
                        var formScope = getActiveFormScope();
                        formScope.doBtnUser1();
                    }
                    scope.DoBtnUser2 = function () {
                        var formScope = getActiveFormScope();
                        formScope.doBtnUser2();
                    }
                    scope.DoBtnUser3 = function () {
                        var formScope = getActiveFormScope();
                        formScope.doBtnUser3();
                    }
                    scope.DoBtnUser4 = function () {
                        var formScope = getActiveFormScope();
                        formScope.doBtnUser4();
                    }
                    scope.DoBtnUser5 = function () {
                        var formScope = getActiveFormScope();
                        formScope.doBtnUser5();
                    }
                    scope.DoBtnUser6 = function () {
                        var formScope = getActiveFormScope();
                        formScope.doBtnUser6();
                    }
                    scope.DoBtnUser7 = function () {
                        var formScope = getActiveFormScope();
                        formScope.doBtnUser7();
                    }
                    scope.DoBtnUser8 = function () {
                        var formScope = getActiveFormScope();
                        formScope.doBtnUser8();
                    }
                    scope.DoBtnUser9 = function () {
                        var formScope = getActiveFormScope();
                        formScope.doBtnUser9();
                    }

                    scope.formInfo = function () {
                        var formDetails = [$rootScope.currentForm.title,
                                   $rootScope.currentForm.action,
                                   $rootScope.currentForm.systemId,
                                   $rootScope.currentForm.featureNo].join(',');
                        alert(formDetails);
                    }

                    var ribbon = $('<div>');
                    var toolbar_fetched = $rootScope.$on("toolbar:fetched", function (ev, menu) {
                        toolbar_fetched();
                        //remark: toolbar
                        var riboonItem = $('<div class="ribbon-tab" id="format-tab0" >');
                        riboonItem.append('<span class="ribbon-title">' + 'جعبه ابزار' + '</span>');

                        var baseCount = 1000;
                        var oldValue = 0;
                        var ribbonSection;

                        angular.forEach(menu.Toolbar, function (toolbar, index) {


                            var newValue = parseInt(toolbar.Order / baseCount);
                            if (oldValue != newValue) {
                                ribbonSection = $('<div id=' + toolbar.Order + ' name="toolbar-btn" class="ribbon-section">' +
                                   '<span class="section-title">' + toolbar.GroupDescription + '</span>');

                                oldValue = newValue;
                            }
                            var functions = $(
                                          '<div name=' + toolbar.LatinName + ' class="ribbon-button ribbon-button-large " id="toolbar-btn" ng-click="' + toolbar.ActionViewUrl + '" value=' + toolbar.Description + '  >' +
                                          '<img name =' + toolbar.LatinName + ' class="ribbon-icon ribbon-normal" src="' + toolbar.Icon + '" />' +
                                          "<div>" + //جعبه ابزار
                                          '<span  class="button-title"> <input name=' + toolbar.LatinName + ' type="button" class="pn-ribbon-style"></span>' +
                                          '</div>'
                                          );
                            ribbonSection.append(functions);
                            riboonItem.append(ribbonSection);
                        });
                        ribbon.append(riboonItem);
                        //remark: toolbar

                        scope.items = menu.Items;
                        angular.forEach(scope.items, function (item, index) {


                            var riboonItem = $('<div class="ribbon-tab" id="format-tab' + (index + 1) + '" >');
                            riboonItem.append('<span class="ribbon-title">' + item.SystemTitle + '</span>');
                            var totalCode = item.SystemTotalCode;
                            angular.forEach(item.Features, function (feature) {

                                var subMenu = $('<div id=' + feature.GroupId + ' class="ribbon-section">' +
                                        '<span class="section-title">' + feature.GroupTitle + '</span>');

                                var groupNo = feature.GroupId;
                                angular.forEach(feature.Functions, function (functions) {

                                    var tabItem = {
                                        title: functions.SystemFeatureTitle,
                                        action: functions.SystemFeatureViewAction,
                                        systemId: totalCode,
                                        featureNo: functions.SystemFeatureNO,
                                        isActive: false,
                                        SystemKey: item.SystemKey,
                                        FormId: functions.SystemFeaturePkey,
                                        toolbar: functions.Toolbar
                                    };
                                    $rootScope.tabItems.push(tabItem);

                                    var functions = $(
                                        '<div name=' + functions.LatinName + ' class="ribbon-button ribbon-button-large " id="add-table-btn" ng-click="\$root.add(\'' + functions.SystemFeatureTitle + '\', \'' + functions.SystemFeatureViewAction + '\',\'' + totalCode + '\', \'' + functions.SystemFeatureNO + '\')">' +
                                        '<img name=' + functions.LatinName + ' class="ribbon-icon ribbon-normal" src="' + functions.SystemFeatureIcon + '" />' +
                                        "<div>" + //فرم ها
                                        '<span  class="button-title"> <p>' + functions.SystemFeatureTitle + '</p></span>' +
                                        '</div>');
                                    subMenu.append(functions);
                                    riboonItem.append(subMenu);
                                });

                            });
                            ribbon.append(riboonItem);
                        });
                        var el2 = $compile(ribbon)(scope);
                        $(element).append(el2);
                        $(element).ribbon();

                        scope.disableToolbar();

                    });
                }
            }
        }]);
});