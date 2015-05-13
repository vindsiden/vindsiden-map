/**
 * Created by erik.mohn on 21.10.2014.
 */
vindsidenMap.controller('MapController', ['$scope', 'Stations', function ($scope, Stations) {
    $scope.markers = [];

    $scope.map = {
        center: {
            latitude: 65,
            longitude: 12
        },
        zoom: 4
    };

    $scope.$watch(function () {
        return $scope.map.bounds;
    }, function (nv, ov) {
        if ($scope.markers.length == 0)
            Stations.async().then(function (response) {
                createMarkers(response, $scope);
            });
    }, true);

}]);

function createMarkers(stations, $scope) {
    angular.forEach(stations, function (station, key) {
        if (station.Show) {
            createMarker(station, $scope);
        }
    });
};

function createMarker(station, $scope) {
    stationImage = new Image();
    stationImage.src = identifyIconImageUrl(station.Data[0]);

    stationImage.onload = function () {
        data = station.Data[0];
        anyData = data != null
        markerIcon = anyData ? createRotatedIconImage(this, data) : this.src;

        marker = {
            id: station.StationID,
            station: station,
            data: data,
            avg: anyData ? round(data.WindAvg) : '',
            gust: anyData ? round(data.WindMax) : '',
            min: anyData ? round(data.WindMin) : '',
            temp: anyData ? round(data.Temperature1) : '',
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

function createRotatedIconImage(img, data) {
    canvas = document.createElement("canvas");
    context = canvas.getContext("2d");
    canvas.width = 50;
    canvas.height = 50;
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;

    context.translate(centerX, centerY);
    context.rotate((data.DirectionAvg + 180) * 0.0174532925);
    context.translate(-centerX, -centerY);
    context.drawImage(img, 0, 0);
    context.restore();

    return canvas.toDataURL('image/png');
}

function identifyIconImageUrl(data) {
    return (data == null)
        ? '/img/not_available.png'  : (data.WindAvg >= 0 && data.WindAvg < 6)
        ? '/img/arrow_gray.png'     : (data.WindAvg >= 6 && data.WindAvg < 10)
        ? '/img/arrow_green.png'    : '/img/arrow_red.png'
}

function round(number) {
    return Math.round(number * 10) / 10
}