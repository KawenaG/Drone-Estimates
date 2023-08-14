let map;
let currentPolygon;

function initMap() {
  const center = { lat: 37.7749, lng: -122.4194 };

  map = new google.maps.Map(document.getElementById("map"), {
    center: center,
    zoom: 13,
  });

  const geocoder = new google.maps.Geocoder();
  document.getElementById("searchButton").addEventListener("click", () => {
    geocodeAddress(geocoder, map);
  });

  const drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.POLYGON,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: ["polygon"],
    },
  });

  drawingManager.setMap(map);

  google.maps.event.addListener(drawingManager, "overlaycomplete", function (e) {
    if (e.type === "polygon") {
      if (currentPolygon) {
        currentPolygon.setMap(null);
      }
      currentPolygon = e.overlay;
      let path = e.overlay.getPath();
      let areaInMeters = google.maps.geometry.spherical.computeArea(path);
      let areaInFeet = areaInMeters * 10.764;
      document.getElementById("area").innerHTML = `Area: ${areaInFeet.toFixed(2)} sq feet`;
    }
  });
}

function geocodeAddress(geocoder, resultsMap) {
  const address = document.getElementById("addressInput").value;
  geocoder.geocode({ address: address }, (results, status) => {
    if (status === "OK") {
      resultsMap.setCenter(results[0].geometry.location);
      new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location,
      });
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}
