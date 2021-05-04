// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// Perform a GET request to the query URL
var myMap = L.map("map", {
  center: [37.77986, -122.42905],
  zoom: 7
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

d3.json(queryUrl).then(function(data) {
    
  var features = data.features
  var properties = data.features.properties

  mags = []
  lats = []
  lons = []
  coors = []
  places = []
  times = []
  depths = []
  for (var i = 0; i < features.length; i++) {
    var p = features[i].properties
    var g = features[i].geometry
    var mag = p.mag
    var lat = g.coordinates[0]
    var lon = g.coordinates[1]
    var coor = g.coordinates
    var place = p.place
    var time = p.time
    var depth = coor[2]
    mags.push(mag)
    lats.push(lat)
    lons.push(lon)
    coors.push(coor)
    places.push(place)
    times.push(time)
    depths.push(depth)

    var color = "";
    if (depth > 90) {
      color = "black";
    }
    else if (depth > 70) {
      color = "red";
    }
    else if (depth > 50) {
      color = "orange";
    }
    else if (depth > 30) {
      color = "yellow";
    }
    else if (depth > 10) {
      color = "green";
    }
    else {
      color = "white";
    }

    L.circle([coor[1],coor[0]], {
      fillOpacity: 0.75,
      color: "black",
      fillColor: color,
      // Adjust radius
      radius: 10000 * mag
    }).bindPopup("<h3>" + place +
      "</h3><hr><p>" + new Date(time) + "</p>" +
      "</h3><hr><p>" + `Magnitude: ${mag} | Depth: ${depth}` + "</p>").addTo(myMap);
  }
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
  }
  legend.addTo(myMap);
})

// L.control.layers(null, overlays).addTo(map);

// // Create a legend to display information about our map
// var info = L.control({
//   position: "bottomright"
// });

// // When the layer control is added, insert a div with the class of "legend"
// info.onAdd = function() {
//   var div = L.DomUtil.create("div", "legend");
//   return div;
// };

// // Add the info legend to the map
// info.addTo(map);

// function updateLegend() {
//   document.querySelector(".legend").innerHTML = [
//     "<h5> Depth Legend",
//     "<p> White = 0-10 </p>",
//     "<p> Green = 10-30 </p>",
//     "<p> Yellow = 30-50 </p>",
//     "<p> Orange = 50-70 </p>",
//     "<p> Red = 70-90 </p>",
//     "<p> Black = 90+ </p>",
//   ].join("");
// }

