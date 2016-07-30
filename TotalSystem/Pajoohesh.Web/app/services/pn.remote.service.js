define(['app'], function (app) {
    app.factory("pn.remote.service", ["$http", "$q", "localStorageService", "AuthToken", "$state",
        function ($http, $q, localStorageService, tokenKey, $state) {

        function get(id, url) {
            var defferd = $q.defer();
            if (id != null) {
                $http.get(url + '?id=' + id)
                .success(function (result) { defferd.resolve(result); })
                .error(function (response) { defferd.reject(response); });
                return defferd.promise;
            }
            else {
                $http.get(url)
               .success(function (result) { defferd.resolve(result); })
               .error(function (response) { defferd.reject(response); });
                return defferd.promise;
            }
        }

        function post(entity, url) {
            var defferd = $q.defer();
            var request = {
                method: 'POST',
                url: url,
                headers: { 'Auth-Token': localStorageService.get(tokenKey) }
            };

            if (entity != null) {
                request.data = JSON.stringify(entity);
                $http(request)
                    .success(function (result) {
                        defferd.resolve(result);
                    })
                    .error(function (response) {

                        defferd.reject(response);
                    });
            }
            else {
                $http(request)
                    .success(function (result) {
                        defferd.resolve(result);
                    })
                    .error(function (response) {
                        if (response.Code != null) {
                            switch (response.Code) {
                                case 401:
                                    localStorageService.clearAll();
                                    $state.go("login");
                                    break;
                                default:
                            }
                        }
                        else
                        {

                        }


                        defferd.reject(response);
                    });
            }
            return defferd.promise;
        }
        return {
            get: get,
            post: post

        }

    }]);
});