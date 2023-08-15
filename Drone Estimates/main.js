let map;
let drawingManager;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.7749, lng: -122.4194}, // Default to San Francisco, adjust as needed
    zoom: 10,
  });

  drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.POLYGON,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: ['polygon']
    },
    polygonOptions: {
      editable: true,
      draggable: true
    }
  });
  drawingManager.setMap(map);

  google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e) {
    if (e.type === 'polygon') {
      let path = e.overlay.getPath();
      let areaInMeters = google.maps.geometry.spherical.computeArea(path);
      let areaInFeet = areaInMeters * 10.764;
      document.getElementById('area').innerHTML = `Area: ${areaInFeet.toFixed(2)} sq feet`;
    }
  });

  // Search Box
  const input = document.getElementById('addressInput');
  const searchBox = new google.maps.places.SearchBox(input);

  document.getElementById('searchButton').addEventListener('click', function() {
    const places = searchBox.getPlaces();
    
    if (places.length === 0) return;

    const place = places[0];
    
    if (!place.geometry) return;

    if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
    } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
    }
  });
}