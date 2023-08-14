let map;
let drawingManager;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 37.7749, lng: -122.4194 }, // You can change these coordinates
        zoom: 14,
    });

    drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['polygon'],
        },
        polygonOptions: {
            fillOpacity: 0.5,
            strokeWeight: 2,
        },
    });

    drawingManager.setMap(map);

    google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e) {
      if (e.type === 'polygon') {
          let path = e.overlay.getPath();
          let areaInMeters = google.maps.geometry.spherical.computeArea(path);
          let areaInFeet = areaInMeters * 10.764; // Convert from square meters to square feet
          document.getElementById('area').innerHTML = `Area: ${areaInFeet.toFixed(2)} sq feet`;
      }
  });
  
}

// Create a search box and link it to the address input
const input = document.getElementById('addressInput');
const searchBox = new google.maps.places.SearchBox(input);
map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

// Listen for the event when the user selects a prediction
searchBox.addListener('places_changed', () => {
    const places = searchBox.getPlaces();
    
    if (places.length === 0) return;

    const place = places[0];
    
    if (!place.geometry) return;

    // Center the map on the selected place
    if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
    } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
    }
});
