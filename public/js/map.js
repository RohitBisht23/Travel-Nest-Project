mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container : "map",
    style : "mapbox://styles/mapbox/streets-v12", //dark-v11
    center : coordinates,
    zoom : 9,
});

//Marker
// coordinates = listing.geometry.coordinates;
console.log(coordinates);
const marker = new mapboxgl.Marker( {color : 'red'})
.setLngLat([coordinates[0],coordinates[1]])  //Listing.geometry.coordinates
.setPopup(new mapboxgl.Popup({offset : 25})
.setHTML(`<h4>${listing.title}</h4><p>Exact location will be proveded after booking</p>`))
.addTo(map);