using System.Web;
using System.Web.Optimization;

namespace Pajoohesh.Web
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            #region JavaScript
            bundles.Add(new ScriptBundle("~/scripts/controls").Include("~/Content/controls/ribbon/ribbon/ribbon.js",
                 "~/Content/controls/pn-gridview.js"
                  //"~/Content/controls/Accordion/menu.js",
                  //"~/Content/controls/Accordion/Script1.js"
                  ));

            bundles.Add(new ScriptBundle("~/scripts/angular").Include(
             "~/Scripts/angular/angular.min.js",
             "~/Scripts/angular/angular-sanitize.min.js",
             "~/Scripts/angular/angular-ui-router.min.js",
             "~/Scripts/angular/angular-ui-notification.min.js",
             "~/Scripts/angular/angular-ui-router-extras.min.js",
             "~/Scripts/angular/angular-local-storage.min.js",
             "~/Scripts/angular/angular-translate.min.js",
             "~/Scripts/angular/angular-animate.min.js",
             "~/Scripts/angular/angular-translate-loader-partial/angular-translate-loader-partial.min.js",
             "~/Scripts/angular/angular-modal-service.js",
             "~/Scripts/angular/angular-block-ui.js"));

            bundles.Add(new ScriptBundle("~/scripts/Jquery").Include(
                        "~/Scripts/Jquery/jquery-{version}.js",
                        "~/Scripts/Jquery/jquery.slimscroll.min.js"));

            bundles.Add(new ScriptBundle("~/scripts/bootstrap").Include(
                      "~/Scripts/bootstrap/bootstrap.min.js",
                      "~/Scripts/bootstrap/ui-bootstrap/dateparser.js",
                      "~/Scripts/bootstrap/ui-bootstrap/position.js",
                      "~/Scripts/bootstrap/ui-bootstrap/persiandate.js",
                      "~/Scripts/bootstrap/ui-bootstrap/persian-datepicker.js",
                      "~/Scripts/bootstrap/ui-bootstrap/ui-bootstrap-tpls-0.12.0.js",
                      "~/Scripts/bootstrap/ui-bootstrap/dateconvertor.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new ScriptBundle("~/scripts/kendo").Include(
                "~/Scripts/helper/JalaliDate.js",
                "~/Content/kendo/2016.1/js/kendo.all.min.js",
                "~/Content/kendo/kendo.calendar.jalali.js",
                "~/Content/kendo/kendo.datepicker.jalali.js",
                "~/Content/kendo/cultures/kendo.fa-IR.js"));

            bundles.Add(new ScriptBundle("~/scripts/hotkeys").Include(
                "~/Content/hotkeys/hotkeys.js",
                "~/Content/hotkeys/mousetrap.js"));

            bundles.Add(new ScriptBundle("~/scripts/modernizr").Include("~/Scripts/modernizr-*"));
            #endregion

            #region Style
            bundles.Add(new Bundle("~/content/tab").Include("~/Content/tab/tab.css"));

            bundles.Add(new Bundle("~/content/layout").Include("~/Content/layout.css"));

            bundles.Add(new StyleBundle("~/content/bootstrap").Include(
                     "~/Content/bootstrap/bootstrap.css",
                    "~/Content/bootstrap/bootstrap-rtl.css",
                     "~/Content/bootstrap/ui-bootstrap/bootstrap-datepicker.min.css",
                     "~/Content/bootstrap/ui-bootstrap/CustomBootStrap.css"
                     // "~/Content/bootstrap/ui-bootstrap/font-awesome.min.css",//
                     //"~/Content/bootstrap/fonts/fontawesome-webfont.woff2",//
                     //"~/Content/bootstrap/fonts/fontawesome-webfont.woff",//
                     //"~/Content/bootstrap/fonts/fontawesome-webfont.ttf"//
                     ));

            bundles.Add(new StyleBundle("~/fonts").Include(
            "~/fonts/font-awesome.min.css",
           "~/fonts/fontawesome-webfont.woff2",
            "~/fonts/fontawesome-webfont.woff",
            "~/fonts/fontawesome-webfont.ttf"
            //"~/Content/bootstrap/fonts/fontawesome-webfont.woff",
            //"~/Content/bootstrap/fonts/fontawesome-webfont.ttf"
            ));

            bundles.Add(new StyleBundle("~/content/controls").Include(
                "~/Content/controls/ribbon/ribbon/ribbon.css",
                //"~/Content/controls/Accordion/style.min.css",
                "~/Content/controls/select/pn-select.css",
                "~/Content/controls/calculator/pn-calculator.css",
                "~/Content/controls/tab/tab.css",
                 "~/Content/entityViewer/entityViewerStyle.css"));

            bundles.Add(new StyleBundle("~/content/kendo").Include(
                "~/Content/kendo/2016.1/styles/kendo.common.min.css",
                "~/Content/kendo/2016.1/styles/kendo.blueopal.min.css",
                "~/Content/kendo/2016.1/styles/kendo.rtl.min.css",
                "~/Content/KendoUiCustomPlugin/CustomKendoUi.css"));

            bundles.Add(new StyleBundle("~/content/hotkeys").Include("~/Content/hotkeys/hotkeys.css"));

            bundles.Add(new StyleBundle("~/content/angular").Include(
                      "~/Content/Notification/angular-csp.css",
                      "~/Content/Notification/angular-ui-notification.min.css",
                      "~/Content/angular/angular-block-ui.css"));
            #endregion
        }
    }
}
