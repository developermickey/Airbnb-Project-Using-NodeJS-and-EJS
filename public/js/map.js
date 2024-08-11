mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 12 // starting zoom
});

const marker = new mapboxgl.Marker({color: "red"})
.setLngLat(coordinates) // Listing Under geometry coordinates hai unko save karwa rahe hai  // Listing.geometry.coordinates
.setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<h4>${locations}</h4><p>Extact Location Provided After Booking</p>`))
.addTo(map);