define(["areas/userManagement/app.areas.userManagement"], function (userManagement) {
    userManagement.register.controller("listRoleController", ["$scope", "$timeout", "pn.remote.service", "pn.dialog", "pn.focus",
        "pn.enum", "Notification", "$rootScope", "hotkeys", "pn.kendo.config", "userManagementWebAccess", "cache", "pn.errorHandler", "pn.message",
        function ($scope, $timeout, remoteService, dialog, focus, pnenum, notify, $rootScope, hotkeys, kendoConfig, WebAccess, cache, errorHandler, message) {

            $scope.itemTypeImage = "group";
            $scope.itemTypeTitle = message.roleOrGroupRolePorperties;
            $scope.isRole = false;

            $scope.treeviewOnReady = function (tree) {
                $scope.tree = tree;
            }

            var switchToEditableMode = function () {
                $scope.disableManipulateForm = false;
                $scope.disableTree = true;
                $scope.$emit("toolbar:DoRibbonFalse");
            };

            var switchToReadonlyMode = function () {
                $scope.disableManipulateForm = true;
                $scope.disableTree = false;
            };

            // Initilize Form Datau
            $scope.initializeForm = function () {
                cache.umsCache = cache.umsCache || {};
                cache.umsCache.selectedRole = {};

                $scope.roleStateSelectedItem = [];
                switchToReadonlyMode();
                $scope.formOperationState = pnenum.pnformstate.update;
                $scope.selectedDataItem = {};
            }

            $scope.initializeForm();

            // #region ----- Standrad From Events -----

            $scope.checkEditable = function () {
                if ($scope.selectedItem == null || $scope.selectedItem.Key == "00000000-0000-0000-0000-000000000000") {
                    notify.error({ message: message.noSelectedGoodItemForChange, title: message.deleteInfo });
                    return false;
                }

                return true;
            };

            $scope.doEdit = function () {
                if (!$scope.checkEditable())
                    return;

                $scope.edit();
                return true;
            };

            $scope.doDelete = function () {

                if (!$scope.checkEditable())
                    return;

                Delete();
            };

            function Delete() {
                dialog.showYesNo(message.note, message.deleteSure, message.yes, message.no).then(function (resultConfrim) {
                    if (resultConfrim != null && resultConfrim == true) {
                        remoteService.post($scope.selectedItem, WebAccess + "api/Role/DeleteRoleOrGroup").then(function (result) {
                            if (result.Success) {
                                notify.success({ message: message.SuccessfullDelete, title: message.deleteInfo });
                                reloadTree();
                            }
                            else { errorHandler.ShowError(result); }
                        });
                    }
                });
            };

            $scope.organizationLevels = {};
            $scope.subLevels = {};

            $scope.isRole = false;

            $scope.loadOrganizationLevel = function () {
                remoteService.post(null, WebAccess + "api/Role/GetOrganizationLevelQuery?level=").then(function (result) {
                    $scope.organizationLevels = result.Entities;
                });
            };

            $scope.loadOrganizationLevel();

            $scope.loadSubOrganizationLevel = function (parentLevel) {
                remoteService.post(null, WebAccess + "api/Role/GetOrganizationLevelQuery?level=" + parentLevel).then(function (result) {
                    $scope.subLevels = result.Entities;
                });
            };

            $scope.loadOrganizationLevel();

            $scope.$watch('selectedDataItem.OrganizationLevelCode', function (newVal, oldVal) {
                $scope.loadSubOrganizationLevel(newVal);
            });

            $scope.$watch('selectedDataItem.SubOrganizationLevelCode', function (newVal, oldVal) {

            });

            $scope.doCancel = function () {
                $scope.$emit("toolbar:DoRibbonTrue");
                $scope.disableMode();
                return true;
            }; 

            $scope.disableMode = function () {
                $scope.$emit("toolbar:DoRibbonTrue");
                $scope.disableManipulateForm = true;
            };

            $scope.doInsert = function () {
                debugger;

                if ($scope.selectedItem == null) {
                    notify.error({ message: "آیتم مناسب برای ایجاد آیتم جدید به درستی انتخاب نشده است", title: "عدم انتخاب صحیح آیتم" });
                    return;
                }

                if (($scope.selectedItem != null && $scope.selectedItem.Key == "00000000-0000-0000-0000-000000000000") && $scope.isRole) {
                    notify.error({ message: "امکان ایجاد نقش در درختواره نقش و گروه نیست", title: "عدم ایجاد نقش در درختواره" });
                    return false;
                }

                if ($scope.isRole) {
                    dialog.showMessage("عدم امکان تعریف آیتم", "بر روی یک نقش نمی توان آیتمی را تعریف نمود");
                    return;
                }

                if ($scope.selectedItem.Key == "00000000-0000-0000-0000-000000000000") {
                    $scope.addGroupRole();
                    return true;
                }

                dialog.showYesNo("توجه", "ایتم مورد نظر خود را جهت ثبت اطلاعات انتخاب کنید", "گروه", "نقش").then(function (result) {
                    if (result == null)
                        return false;

                    return $scope.manageInsert(result);
                });
            };

            $scope.manageInsert = function (result) {
                if (!result) {
                    //نقش
                    //گروه
                    $scope.isRole = true;
                    $scope.addRole();
                    return true;
                }
                else {
                    $scope.addGroupRole();
                    return true;
                }
            };

            $scope.doApplay = function () {
                debugger;
                switch ($scope.formOperationState) {
                    case pnenum.pnformstate.insert:
                        $scope.updateOrInsert("CreateRoleOrGroupRole");
                        break;
                    case pnenum.pnformstate.update:
                        $scope.updateOrInsert("UpdateRoleOrGroupRole");
                        break;
                }

                $scope.$emit("toolbar:DoRibbonTrue");
            };

            $scope.applyForm = function () {

            }

            $scope.updateOrInsert = function (url) {
                remoteService.post($scope.selectedDataItem, WebAccess + "api/Role/" + url)
                .then(afterSave);
            }

            // #endregion ----- Standrad From Events -----

            // #region ----- Custom Events -----

            // #endregion ----- Custom Events -----

            // #region ----- Standard Events -----

            // #endregion ----- Standard Events -----

            // #region ----- Tree Config -----  

            $scope.treeviewConfig = kendoConfig.getTreeviewConfig();

            $scope.treeviewConfig.select = function (e) {
                $scope.disableMode();
                $scope.selectedNode = e.node;
                $scope.selectedItem = e.sender.dataItem(e.node);
                $scope.isRole = false;
                cache.umsCache.selectedRole = $scope.selectedItem;

                if ($scope.selectedItem.Type == pnenum.roleState.role) {
                    $scope.itemTypeImage = "group";
                    $scope.isRole = true;
                    $scope.itemTypeTitle = message.rolePorperties;
                    $scope.itemType = message.role;
                }
                else {
                    if ($scope.selectedItem.Code == 0) {
                        $scope.itemTypeImage = "sitemap";
                        $scope.itemType = $scope.itemTypeTitle = message.rootRoleAndGroupRole;
                    }
                    else {
                        $scope.itemTypeImage = "folder";
                        $scope.itemTypeTitle = message.groupRolePorperties;
                        $scope.itemType = message.groupRole;
                    }
                }

                $scope.selectedDataItem.OrganizationLevelCode = $scope.selectedItem.OrganizationLevelCode;
                $scope.selectedDataItem.HasAccessSelfLevel = $scope.selectedItem.HasAccessSelfLevel;
                $scope.selectedDataItem.SubOrganizationLevelCode = $scope.selectedItem.SubOrganizationLevelCode;
                $scope.selectedDataItem.Title = $scope.selectedItem.Title;
                $scope.selectedDataItem.Description = $scope.selectedItem.Description;
                $scope.selectedDataItem.Code = $scope.selectedItem.Code;
                $scope.selectedDataItem.Type = $scope.selectedItem.Type;
                $scope.selectedDataItem.ParentKey = $scope.selectedItem.ParentKey;
                $scope.selectedDataItem.Key = $scope.selectedItem.Key;

                $scope.$apply();
            };

            var afterSave = function (result) {
                if (result.Success) {
                    notify.success({ message: 'اطلاعات با موفقیت ثبت شد', title: ' ثبت اطلاعات' });
                }

                if (result.ParentKey == $scope.selectedItem.Key)// Add State
                {
                    var newDataItem =
                        {
                            Key: result.Key,
                            ParentKey: result.ParentKey,
                            Title: result.Title,
                            expanded: true,
                            spriteCssClass: result.cssClass,
                            Type: result.Type,
                            Code: result.Code
                        };

                    var newItem = $scope.tree.append(newDataItem, $scope.tree.findByUid($scope.selectedItem.uid))
                    $scope.tree.select(newItem);
                }
                else {
                    reloadTree();
                    switchToReadonlyMode();
                }
            };

            var reloadTree = function () {
                $scope.tree.dataSource.read();
            }

            $scope.addRole = function () {
                readyItem(pnenum.roleState.role);
            };

            $scope.edit = function () {
                //check selected item was TRUE
                $scope.formOperationState = pnenum.pnformstate.update;
                switchToEditableMode();
            };

            var readyItem = function (Type) {
                $scope.selectedDataItem.OrganizationLevelCode = 1;
                $scope.selectedDataItem.HasAccessSelfLevel = false;
                $scope.selectedDataItem.SubOrganizationLevelCode = 0;
                $scope.selectedDataItem.Title = "";
                $scope.selectedDataItem.Description = "";
                $scope.selectedDataItem.Code = "";
                $scope.selectedDataItem.Type = Type;
                $scope.selectedDataItem.ParentKey = $scope.selectedItem.Key;
                $scope.formOperationState = pnenum.pnformstate.insert;
                $scope.itemTypeImage = $scope.isRole ? "group" : "folder";
                $scope.itemTypeTitle = $scope.isRole ? message.rolePorperties : "گروه نقش";

                switchToEditableMode();
                focus.setFocus('selectedDataItem.Code');
            };

            $scope.addGroupRole = function (itemType) {
                readyItem(pnenum.roleState.groupRole);
            };

            $scope.treeviewConfig.dataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: {
                        url: WebAccess + "api/Role/GetGroupRoleStructureQuery",
                        contentType: "application/json"
                    }
                },
                schema: {
                    model: {
                        children: "Items"
                    }
                }
            });

            $scope.treeviewConfig.checkboxes = false;

            $scope.treeviewConfig.checkboxes = {
                checkChildren: false,
            };

            $scope.treeviewConfig.dataTextField = ["Title"];
            $scope.treeviewConfig.loadOnDemand = false;
            // #endregion ----- Tree Config -----  

            $scope.saveTreeFields = function () {

                var data = $scope.tree.dataSource._data;

                for (var i = 0, j = data.length; i < j; i++) {
                    checkChildren(data[i]);
                }

                function checkChildren(data) {
                    if (data.checked) {
                        data.checked = false;
                    }
                    if (data.items !== undefined) {
                        for (var i = 0, j = data.items.length; i < j; i++) {
                            checkChildren(data.items[i]);
                        }
                    }
                }

                $scope.tree.setDataSource(data)
            };

        }]);
});


