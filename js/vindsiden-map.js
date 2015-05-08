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

        var currentDate = new Date();

        var dateString =  currentDate.getFullYear() +'-' + (currentDate.getMonth() + 1) + '-' + currentDate.getUTCDate();
           //http://vindsiden.no/api/stations/?date=2015-05-06&n=10
        return $resource('http://vindsiden.no/api/stations' + '?date='+ dateString + '&n=1', {}, {
            query: {method:'GET', isArray:true}
        });
    }]);


