// // initial map setup 
// var myMap = L.map("map").setView([37.0902, -95.7129], 2);

// // //set initial tile layer using api key
// L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//   tileSize: 512,
//   maxZoom: 18,
//   zoomOffset: -1,
//   id: "mapbox/streets-v11",
//   accessToken: API_KEY
// }).addTo(myMap);

//attempt to import geojson data 
var usgs = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

d3.json(usgs, function(data){
  //send data.features object to createFeatures fxn
  createFeatures(data.features);
});
 //define createFeatures fxn to run once on each feature
 //give it a test popup?

 function createFeatures(usgsData){
  //  function onEachFeature(feature, layer){
  //   layer.bindPopup("<h3>"+ feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  //  }

   //make geojson layer that has features array on earthquake data object
   //run onEachFeature fxn once for each piece of data in the array
  //  var earthquakes = L.geoJSON(usgsData, {
  //    onEachFeature: onEachFeature
  //  });
  console.log(usgsData.place);
  var markers = L.markerClusterGroup();
  for (var i = 0; i < usgsData.length; i++){
    var latlng = usgsData[i].geometry.coordinates;
    // console.log(latlng);
    var m = L.marker([latlng[1], latlng[0]], {title: "test"});
    m.bindPopup("<h3>" + usgsData[i].properties.place + "</h3>")
    markers.addLayer(m)
    // markers.bindPopup("<h3>" + usgsData[i].properties.place + "</h3>")
  };
  // map.addLayer(markers)
   //now put earthquakes layer into the createmap fxn
  //  createMap(earthquakes);
  createMap(markers);
 }

function createMap(earthquakes){
  //need street map & darkmap layers--tho i think we could take these out
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };

    // var clusters = L.markerClusterGroup();
    // clusters.addLayer(earthquakes);
    // map.addLayer(clusters);
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes,
    };
    
      // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });
//control layer
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
