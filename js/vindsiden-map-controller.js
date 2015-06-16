/**
 * Created by erik.mohn on 21.10.2014.
 */

vindsidenMap.controller('MapController', ['$scope', 'Stations','uiGmapIsReady', function ($scope, Stations, IsReady) {
    $scope.markers = [];
    $scope.control = {};
    $scope.map = {
        center: {
            latitude: 65,
            longitude: 12
        },
        zoom: 4
    };

    IsReady.promise().then(function(maps) {
        Stations.async().then(function (response) {

            createMarkers(response, $scope);
            refresh($scope)
        });
    });
}]);

function createMarkers(stations, $scope) {
    angular.forEach(stations, function (station, key) {
        if (station.Show) {
            createMarker(station, $scope);
        }
    });
};

function createMarker(station, $scope) {
    var markerIcon = new Image();
    markerIcon.src = identifyIconUrl(station.Data[0]);
    markerIcon.onload = function () {
        var data = station.Data[0];
        var anyData = data != null
        var markerIcon = anyData ? createRotatedIcon(this, data) : this.src;

        var marker = {
            id: station.StationID,
            station: station,
            data: data,
            avg: anyData ? data.WindAvg.toFixed(1) : '',
            gust: anyData ? data.WindMax.toFixed(1) : '',
            min: anyData ? data.WindMin.toFixed(1) : '',
            temp: anyData ? data.Temperature1.toFixed(1) : '',
            latitude: station.Latitude,
            longitude: station.Longitude,
            show: false,
            options: {
                title: station.Name,
                icon: {
                    url: markerIcon
                }}
        };
        marker.onClick = function () {
            marker.show = !marker.show;
        };
        $scope.markers.push(marker);
    }
};

function identifyIconUrl(data) {
    return (data == null)
        ? '/img/not_available.png' : (data.WindAvg >= 0 && data.WindAvg < 6)
        ? '/img/arrow_gray.png' : (data.WindAvg >= 6 && data.WindAvg < 10)
        ? '/img/arrow_green.png' : '/img/arrow_red.png'
}

function createRotatedIcon(img, data) {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    canvas.width = 50;
    canvas.height = 50;
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;

    context.translate(centerX, centerY);
    context.rotate((data.DirectionAvg + 180) * 0.0174532925);
    context.translate(-centerX, -centerY);
    context.drawImage(img, 0, 0);
    context.restore();

    return canvas.toDataURL('image/png');
}

/**
 * Need to refresh the map after markers are added, otherwise the markers
 * would only show once the map is touched by the user
 * @param $scope
 */
function refresh($scope) {
    $scope.map.center.latitude = 65.000001;
};