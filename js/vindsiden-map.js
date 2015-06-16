/**
 * Vindsiden.no map
 *
 * Created by erik.mohn on 12.10.2014.
 */
var vindsidenMap = angular.module('vindsiden-map',
    [
        'ngRoute',
        'ngResource',
        'uiGmapgoogle-maps'
    ]);

vindsidenMap.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'map.html',
                controller: 'MapController'
            });
    }]);

vindsidenMap.config(function (uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
})

vindsidenMap.factory('Stations', function ($http) {
    var Stations = {
        async: function () {
            var currentDate = new Date();
            var date = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getUTCDate();
            var promise = $http.get('http://vindsiden.no/api/stations?date=' + date + '&n=1').then(function (response) {
                //console.log(response);
                return response.data;
            });
            return promise;
        }
    };
    return Stations;
});