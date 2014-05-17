/*function initialize() {
  var mapOptions = {
    zoom: 3,
    center: new google.maps.LatLng(0, -180),
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  var flightPlanCoordinates = [
    new google.maps.LatLng(37.772323, -122.214897),
    new google.maps.LatLng(21.291982, -157.821856),
    new google.maps.LatLng(-18.142599, 178.431),
    new google.maps.LatLng(-27.46758, 153.027892)
  ];
  var flightPath = new google.maps.Polyline({
    path: flightPlanCoordinates,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  flightPath.setMap(map);
}*/

//google.maps.event.addDomListener(window, 'load', initialize);


var map = null;
var markers = [];
var lines = [];

function updateMap() {
    $.ajax({
        url: "/connections"
    }).done(function(data) {
        var cords = [];
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
            lines[i].setMap(null);
        }
        lines = [];
        markers = [];

        var l = [];
        $.each(data["connections"], function(key, value){
            var ll = new google.maps.LatLng(value["latitude"], value["longitude"]);
            markers.push(new google.maps.Marker({
                position: ll,
                map: map,
                title: (value["metro_code"] ? value["metro_code"] + ", " : "") + value["country"]
            }));
            l.push(
                new google.maps.Polyline({
                    path: [ll, new google.maps.LatLng(data["server"]["latitude"], data["server"]["longitude"])],
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                    map: map
                })
            );
        });
        lines = new google.maps.Polyline({
            path: l,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });

        console.log(markers);

    });
}


google.maps.event.addDomListener(window, 'load', function(){
    map = new google.maps.Map(document.getElementById('map-canvas'),  {
        zoom: 3,
        center: new google.maps.LatLng(52.5, 5.75),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    });
    setInterval(updateMap, 5000);
    updateMap();
});