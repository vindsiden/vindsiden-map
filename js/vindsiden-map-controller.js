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
        stationImage = new Image();

        if (station.Data[0] != null) {
            vind = station.Data[0].WindAvg;
            if (vind >= 0 && vind < 6) {
                stationImageUrl = '/img/arrow_gray.png';
            } else if (vind >= 6  && vind < 10) {
                stationImageUrl = '/img/arrow_green.png';
            } else if (vind >= 10) {
                stationImageUrl = '/img/arrow_red.png';
            }
        } else {
            stationImageUrl = '/img/not_available.png';
        }

        stationImage.onload = function () {
            canvas = document.createElement("canvas");
            canvas.width = 50;
            canvas.height = 50;
            var context =  canvas.getContext("2d");

            centerX = canvas.width/2;
            centerY = canvas.height/2;

            if (station.Data[0] != null) {
                direction = station.Data[0].DirectionAvg;

                context.translate(centerX, centerY);
                context.rotate((direction + 180) * 0.0174532925);
                context.translate(-centerX, -centerY);
                context.drawImage(this, 0, 0);
                context.restore();

                rotatedImage = canvas.toDataURL('image/png');

                map = $scope.map;

            } else {
                rotatedImage = this.src;
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
                showData: station.Data != null,
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
                        url: rotatedImage
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
        stationImage.src = stationImageUrl;

    };

    var markers = [];
    angular.forEach($scope.stations , function(station, key) {
        if (station.Show){
            createMarkerForStation(station);
        }
    });
    $scope.stationMarkers = markers;
};



