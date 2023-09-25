mapboxgl.accessToken =
  "pk.eyJ1IjoiamFtZXNwb3J0ZXIyMSIsImEiOiJjbGxvN2lmazcwN3d4M2NuM2pnZHZsZTNwIn0.I70dWocAUtgPwOThih14DA";

var filterGroup = document.getElementById("ll");

var maxBounds = [
  [-74.27, 40.49], // Southwest coordinates
  [-73.68, 40.92], // Northeast coordinates
];

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/jamesporter21/clmx29w1a00wu01qneco67iyw",
  center: [-96.7853964, 32.7846839],
  zoom: 10,
  // maxBounds: maxBounds,
  preserveDrawingBuffer: true,
  customAttribution:
    'created by <a style="padding: 0 3px 0 3px; color:#FFFFFF; background-color: #bf7f46;" target="_blank" href=http://www.geocadder.bg/en/portfolio.html>GEOCADDER</a>',
});

var nav = new mapboxgl.NavigationControl({ showCompass: false });
map.addControl(nav, "top-left");

var markersAllIds = [];

var onlySelectedaccessibilityPoints = [];
var isinitialSelectedType = false;
var initialSelectedType = "";
var counter = 0;

var mainPointLatitude;
var mainPointLongitude;

var pointsForSearchArray = [];

var popup = new mapboxgl.Popup({
  closeButton: false,
});

map.on("load", () => {
  // map.on("click", (event) => {
  //   const features = map.queryRenderedFeatures(event.point, {
  //     layers: ["all-86q2b1"],
  //   });
  //   if (!features.length) {
  //     return;
  //   }
  //   const feature = features[0];
  //   console.log(feature);
  // });

  // map.on("click", function () {
  //   console.log(map.getZoom());
  // });

  map.addSource("counties", {
    type: "vector",
    url: "mapbox://jamesporter21.0jao2dyh",
    promoteId: { "all-86q2b1": "name" },
  });

  map.addLayer({
    id: "ACTIVE BLOCKS",
    type: "fill",
    "source-layer": "all-86q2b1",
    source: "counties",
    layout: {},
    paint: {
      "fill-color":
        // ["get", "color"],
        [
          "case",
          ["==", ["feature-state", "numUsers"], 2],
          "rgba(255, 0, 0, 0.0)",
          ["get", "color"],
          // "blue",
        ],
      "fill-opacity": 0.3,
    },
  });

  map.addLayer({
    id: "boxes-outline-layer",
    type: "line",
    visibility: "visible",
    "source-layer": "all-86q2b1",
    source: "counties",
    layout: {},
    paint: {
      "line-color":
        // "#ffffff",
        [
          "case",
          ["==", ["feature-state", "numUsers"], 2],
          "rgba(255, 0, 0, 0.0)",
          ["get", "color"],
        ],
      "line-width": 1,
    },
  });

  var zipsArray = [
    75217, 75216, 75232, 75220, 75227, 75203, 75212, 75228, 75244, 75241, 75253,
    75215, 75204, 75224, 75231, 75211, 75237, 75223, 75159, 75201, 75233, 75218,
    75238, 75229, 75235, 75226, 75210, 75202, 75209, 75219, 75205, 75001, 75006,
    75115, 75150, 75172, 75206, 75208, 75214, 75230, 75234, 75236, 75246, 75254,
  ];
  zipsArray.forEach(function (zipCode) {
    map.setFeatureState(
      { id: zipCode, source: "counties", sourceLayer: "all-86q2b1" },
      { numUsers: 2 }
    );
  });

  map.on("click", "ACTIVE BLOCKS", (e) => {
    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(e.features[0].properties.name)
      .addTo(map);
  });

  map.on("mouseenter", "ACTIVE BLOCKS", function (e) {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = "pointer";

    // Single out the first found feature.
    // var feature = e.features[0];

    // Display a popup with the name of the county
    // popup.setLngLat(e.lngLat).setText(feature.properties.name).addTo(map);
  });

  map.on("mouseleave", "ACTIVE BLOCKS", function () {
    map.getCanvas().style.cursor = "";
  });

  // Add DISD boundary
  map.addSource("disd-boundary", {
    type: "vector",
    url: "mapbox://jamesporter21.66qhulir",
    promoteId: { "disd-border-a2c95i": "layer" },
  });

  map.addLayer({
    id: "disd-outline-layer",
    type: "line",
    visibility: "visible",
    "source-layer": "disd-border-a2c95i",
    source: "disd-boundary",
    layout: {},
    paint: {
      "line-color": "#dd1db7",
      "line-width": 2,
    },
  });

  // var zipCodesArray = [];
  // const features = map.queryRenderedFeatures({
  //   layers: ["ACTIVE BLOCKS"],
  // });
  // features.forEach(function (feature) {
  //   console.log(feature.id);
  //   zipCodesArray.push(feature.id);
  // });
});

// popup toggling //
function togglePopup() {
  var popup = this._popup;

  if (!popup) return;
  else if (popup.isOpen()) popup.remove();
  else popup.addTo(this._map);
}
// end popup toggling//

//////////////// open/close dropdown menu for first type filter
var checkList = document.getElementById("list1");
checkList.getElementsByClassName("anchor")[0].onclick = function (evt) {
  if (checkList.classList.contains("visible"))
    checkList.classList.remove("visible");
  else checkList.classList.add("visible");
};
//////////////

$("input[type='checkbox'][name='filter-by-first-type-input']").click(
  function () {
    var currentCountry = $(this).val();
    if ($(this).is(":checked")) {
      map.setFeatureState(
        { id: currentCountry, source: "counties", sourceLayer: "all-86q2b1" },
        { numUsers: 1 }
      );
    } else {
      map.setFeatureState(
        { id: currentCountry, source: "counties", sourceLayer: "all-86q2b1" },
        { numUsers: 2 }
      );
    }
  }
);
