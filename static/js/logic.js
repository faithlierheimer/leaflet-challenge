//Define URL to get data from
var usgs = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

//Define color fxn to change color based on depth of earthquake
function getColor(d){
  if(d<10){
    return "#ffffb2"
  } else if (d > 10 && d < 20 ){
    return "#fed976"
  } else if (d > 20 && d < 50){
    return "#feb24c"
  } else if (d > 50 && d < 100){
    return "#fd8d3c"
  } else if (d > 100 && d < 200){
    return "#fc4e2a"
  } else if (d > 200 && d < 300){
    return "#e31a1c"
  } else if (d > 300 && d < 450){
    return "#b10026"
  } else {
    return "blue"
  };
}
//define layer group to hold depth and magnitude data 
var depthMagnitude = new L.LayerGroup(depthMagnitude) 

//define styling rules for circle markers that will be diff size/color 
//based on magnitude and depth
function styleInfo(feature){
  return {
      color: "#A9A9A9",
      fillColor: getColor(feature.geometry.coordinates[2]),
      fillOpacity: 0.75,
      radius: feature.properties.mag*5 //update w/magnitude later
  }
}

//bring in usgs data from above to work with 
d3.json(usgs, function(data){
  //send data.features object to createFeatures fxn
  createFeatures(data.features);

  //set up layer and styling info for magnitude/depth data, add to depthMagnitude layer
  L.geoJson(data, {
    pointToLayer: function(feature, latlng){
      return L.circleMarker(latlng)
    },
    style: styleInfo

 
  }).addTo(depthMagnitude);
});

//add depthMagnitude to the map
depthMagnitude.addTo(myMap);


//define function to make markers with earthquake data & locations
 function createFeatures(usgsData){
 
 
  var markers = L.markerClusterGroup();
  var magnitude = [];

 //loop through data to make markers for each earthquake & collapse into marker clusters
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

  
  };
var mag = L.layerGroup(magnitude);
  // map.addLayer(markers)
   //now put earthquakes layer into the createmap fxn
  //  createMap(earthquakes);
  createMap(markers, mag);
 }

 //build actual map with street & dark layers, and overlays
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

    
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes,
      "Depth and Magnitude" : depthMagnitude
    };
    
      // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });
//control layer to toggle on/off overlays
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
