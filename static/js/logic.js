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
function getColor(d){
  if(d<10){
    return "#feedde"
  } else if (d > 10 && d < 20 ){
    return "#fdd0a2"
  } else if (d > 20 && d < 50){
    return "#fdae6b"
  } else if (d > 50 && d < 100){
    return "#fd8d3c"
  } else if (d > 100 && d < 200){
    return "#f16913"
  } else if (d > 200 && d < 300){
    return "#d94801"
  } else if (d > 300 && d < 450){
    return "#8c2d04"
  } else {
    return "blue"
  };
}

var testGroup = new L.LayerGroup(testGroup) 
var usgs = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
function styleInfo(feature){
  return {
      color: getColor(feature.geometry.coordinates[2]),
      fillColor: getColor(feature.geometry.coordinates[2]),
      fillOpacity: 0.75,
      radius: feature.properties.mag*5 //update w/magnitude later
  }
}
d3.json(usgs, function(data){
  //send data.features object to createFeatures fxn
  createFeatures(data.features);
  L.geoJson(data, {
    pointToLayer: function(feature, latlng){
      return L.circleMarker(latlng)
    },
    style: styleInfo

 
  }).addTo(testGroup);
});

testGroup.addTo(myMap);
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
  var depth = "black"
  var markers = L.markerClusterGroup();
  var magnitude = [];

 
  for (var i = 0; i < usgsData.length; i++){
    var latlng = usgsData[i].geometry.coordinates;
    // console.log(usgsData[i].properties.mag);
    // console.log(latlng);
    var size = (usgsData[i].properties.mag)*10000;
    // console.log(size);
    

    //this adds a marker and builds a marker cluster group for each earthquake
    var m = L.marker([latlng[1], latlng[0]], {title: "test"});
    m.bindPopup("<h3>" + usgsData[i].properties.place + "</h3><hr>" + "<h4> Magnitude: " + usgsData[i].properties.mag + "</h4>")
    markers.addLayer(m)

  //conditionals for depth color to add to circles
  // console.log(getColor(latlng[2]));
   //now try to add circles for each earthquake based on magnitude--it works! 
   magnitude.push(L.circle([latlng[1], latlng[0], {
     color: "black",
     fillColor: getColor(latlng[2]),
     fillOpacity: 0.75,
     radius: size
   }]));
  };
var mag = L.layerGroup(magnitude);
  // map.addLayer(markers)
   //now put earthquakes layer into the createmap fxn
  //  createMap(earthquakes);
  createMap(markers, mag);
 }

function createMap(earthquakes, mag){
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
      Magnitude: mag,
      Test: testGroup
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
