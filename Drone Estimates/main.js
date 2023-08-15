let map;
let drawingManager;
let existingPolygon = null; // Global variable to store existing polygon

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 47.608013, lng: -122.335167}, // Default to San Francisco, adjust as needed
    zoom: 10,
  });
  47.6062, 122.3321
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
      if (existingPolygon) {
        existingPolygon.setMap(null); // Remove existing polygon
      }
      existingPolygon = e.overlay; // Store new polygon

      let path = existingPolygon.getPath();
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
