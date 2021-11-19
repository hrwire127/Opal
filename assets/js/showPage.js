mapboxgl.accessToken = mapToken;
console.log(estate.geometry.coordinates)
const map = new mapboxgl.Map({

    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: estate.geometry.coordinates, // starting position [lng, lat]
    zoom: 4 // starting zoom
});


new mapboxgl.Marker()
    .setLngLat(estate.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h6>${estate.title}</h6>`
            )
    )
    .addTo(map)