// We are going to implement the map functionality.
// Load the content of the places.json
// Handle the user interaction the list of places.

import { fetchData } from "./fetch.js";
import { createCustomElement } from "../app.js";

export function initMapView() {
    console.log("Initializing the map");

    // 1) Create an Instance of the leaflet map, and set the initial view to a city of your choice
    // 45.508888, -73.561668
    const map = L.map('leaflet-map').setView(
        [45.508888, -73.561668]
        , 12
    );

    // 2) Set the map layer
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // 3) Creating a market and placing it on the map
    const marker = L.marker([45.49855290197278, -73.62444023643327]).addTo(map);
    // 45.49855290197278, -73.62444023643327

    // 4) Adding an info window (popup) to a marker
    const placeInfo = `<h6>Starbucks Coffe</h6>
        <p>The description goes here </p>
        <p>1234 St-croix A1B 2C3</p>
    `;
    marker.bindPopup(placeInfo).openPopup();

    // 5) Use the fetch module to load the content of the places.json
    // 5.a) loop through it and for each place create and place a marker on the map.
    // .places []
    // URI to be used: data/places.json

    const locations = fetchLocation(map);
}

async function fetchLocation(map) {
    const resourceUri = "../../data/places.json";
    const locations = await fetchData(resourceUri);
    //console.log(locations);
    parseLocations(locations, map);
    return locations;
}

function parseLocations(locations, map) {
    console.log(locations);
    const locationList = document.getElementById("location-list");
    const list = createCustomElement(locationList, "ul", '');
    locations.places.forEach(location => {
        const li = createCustomElement(list, 'li', location.name);

        // 5) adding the custom marker.
        // For the current place, we need to find the matching category (search by ID in the categories array)
        const category = locations.categories.find(
            category => category.id === location.categoryId 
            );
            console.log(category);
        const customMarker = L.icon ({
            iconUrl: category.markerIcon,
            iconSize:     [70, 70], // size of the icon
            shadowSize:   [50, 64], // size of the shadow
            iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
            shadowAnchor: [4, 62],  // the same for the shadow
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        const marker = L.marker(location.point.coordinates.split(','), {icon: customMarker}).addTo(map);
        const placeInfo = `<h6>${location.name}</h6>
        <p>${location.description} </p>
        <p>Address</p>
        `;
        marker.bindPopup(placeInfo).openPopup();
    });
}