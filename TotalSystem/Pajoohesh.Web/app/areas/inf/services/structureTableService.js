define(["app"], function (app) {
    app.service("structureTableService", function () {
        var json = "";
        function getJson() {
            return json;
        };
        function addJson(text) {
            json = text;
        };
        return {
            getJson: getJson,
            addJson: addJson
        }
    });
});
