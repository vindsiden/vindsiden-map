/**
 * Created by erik.mohn on 21.10.2014.
 */
vindsidenControllers.controller('MapController', ['$scope', '$routeParams', 'Stations', function($scope, $routeParams, Stations) {
    $scope.stations = Stations.query();

    $scope.map = {
        center: {
            latitude: 65,
            longitude: 12
        },
        zoom: 4,
        bounds: {}
    };

    $scope.stationMarkers = [];

    $scope.$watch(function() { return $scope.stations; }, function() {
        // Get the bounds from the map once it's loaded
        $scope.$watch(function() { return $scope.map.bounds; }, function(nv, ov) {

            if (!ov.southwest && nv.southwest && $scope.stationMarkers.length == 0) {
                createMarkers($scope);
            }
        }, true);
    });

    $scope.$watch(function() {return $scope.stations;}, function() {
       if ($scope.stations != null && $scope.stations.length > 0 && $scope.stationMarkers.length == 0) {
            createMarkers($scope);
       }
    },true);

}]);

function createMarkers($scope) {
    var createMarkerForStation = function (station) {

        icon = '/img/not_available.png';
        var direction = 180;
        if (station.Data[0] != null) {
            direction = station.Data[0].DirectionAvg + 180;
            icon = {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 7,
                rotation: direction
            };
        }

        var ret = {
            id: station.StationID,
            latitude: station.Latitude,
            longitude: station.Longitude,
            title: station.Name,
            show: false,
            options: {
                title: station.Name,
                icon: icon}
        };
        ret.onClick = function() {
            window.location.href = 'http://vindsiden.no/default.aspx?id=' + station.StationID;
            //Window disabled
            //ret.show = !ret.show;
        };
        return ret;
    };

    var markers = [];
    angular.forEach($scope.stations , function(station, key) {
        if (station.Show){
            markers.push(createMarkerForStation(station))
        }
    });
    $scope.stationMarkers = markers;
};

