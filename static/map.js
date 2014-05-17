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
        }
        for(var i = 0; i < lines.length; i++) {
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
            lines.push(
                new google.maps.Polyline({
                    path: [ll, new google.maps.LatLng(data["server"]["latitude"], data["server"]["longitude"])],
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                    map: map
                })
            );
        });
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
