/**
 * Vindsiden.no map
 *
 * Created by erik.mohn on 12.10.2014.
 */
var vindsiden = angular.module('vindsiden-map',
    [
        'ngRoute',
        'ngResource',
        'vindsidenControllers',
        'vindsidenServices',
        'uiGmapgoogle-maps'
    ]);

vindsiden.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'map.html',
                controller: 'MapController'
            });
    }]);

var vindsidenControllers = angular.module('vindsidenControllers', []);

var vindsidenServices = angular.module('vindsidenServices', ['ngResource']);

vindsidenServices.factory('Stations', ['$resource',
    function($resource){

        return $resource('http://vindsiden.no/api/stations', {}, {
            query: {method:'GET', isArray:true}
        });
    }]);


