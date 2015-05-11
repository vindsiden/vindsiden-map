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



        var img = new Image();

        if (station.Data[0] != null) {
            vind = station.Data[0].WindAvg;
            if (vind >= 0 && vind < 6) {
                icon = '/img/arrow_gray.png';
            } else if (vind >= 6  && vind < 10) {
                icon = '/img/arrow_green.png';
            } else if (vind >= 10) {
                icon = '/img/arrow_red.png';
            }
        } else {
            icon = '/img/not_available.png';
        }

        img.onload = function () {
            canvas = document.createElement("canvas");
            canvas.width = 50;
            canvas.height = 50;
            var context =  canvas.getContext("2d");

            centerX = canvas.width/2;
            centerY = canvas.height/2;

            var direction = 180;
            if (station.Data[0] != null) {


                direction = parseInt(station.Data[0].DirectionAvg) + 180 * Math.PI / 180;

                context.translate(centerX, centerY);
                context.rotate(direction);
                context.translate(-centerX, -centerY);
                context.drawImage(img, 0, 0);
                context.restore();

                icon = canvas.toDataURL('image/png');

                map = $scope.map;

            }

            logo = ""
            if (station.Logo.length > 0) {
                logo ='http://vindsiden.no/img/' + station.Logo;
            }

            avg = '';
            gust = '';
            temp = '';
            owner = '';
            min = '';
            dir = '';

            owner = station.LogoText;
            region = station.Region;
            city = station.City;
            text = station.Text
            ownerURL = station.LogoUrl;

            if (station.Data[0] != null) {
                data = station.Data[0];
                avg = Math.round(data.WindAvg * 10) / 10;
                gust = Math.round(data.WindMax * 10) / 10;
                min = Math.round(data.WindMin * 10) / 10;
                temp = Math.round(data.Temperature1 * 10) / 10;
                dir = data.DirectionAvg;
            }

            var ret = {
                id: station.StationID,
                logo: logo,
                avg:avg,
                gust:gust,
                min:min,
                temp:temp,
                owner: owner ,
                ownerURL: ownerURL,
                dir: dir,
                region: region,
                city: city,
                text: text,
                latitude: station.Latitude,
                longitude: station.Longitude,
                title: station.Name,
                show: false,
                options: {
                    title: station.Name,
                    icon: {
                        url: icon
                    }}
            };
            ret.onClick = function() {
                //window.location.href = 'http://vindsiden.no/default.aspx?id=' + station.StationID;
                //Window disabled
                //if (!ret.show) {
                    //ret.show = true;
                //}
                //ret.show = !ret.show;
            };
            markers.push(ret);
        }
        img.src = icon;
    };

    var markers = [];
    angular.forEach($scope.stations , function(station, key) {
        if (station.Show){
            createMarkerForStation(station);
        }
    });
    $scope.stationMarkers = markers;
};



