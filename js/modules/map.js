// We are going to implement the map functionality.
// Load the content of the places.json
// Handle the user interaction the list of places.

import { fetchData } from "./fetch.js";
import { createCustomElement } from "../app.js";

export function initMapView() {
    console.log("Initializing the map");

    // 1) Create an Instance of the leaflet map, and set the initial view to Montreal
    const map = L.map('leaflet-map').setView(
        [45.508888, -73.561668]
        , 12
    );

    // 2) Set the map layer
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // 3) Load and display locations
    const locations = fetchLocation(map);
}

async function fetchLocation(map) {
    const resourceUri = "../../data/places.json";
    const locations = await fetchData(resourceUri);
    parseLocations(locations, map);
    return locations;
}

function parseLocations(locations, map) {
    console.log(locations);
    const locationList = document.getElementById("location-list");
    const list = createCustomElement(locationList, "ul", '');
    
    locations.places.forEach(location => {
        // Create list item with hover functionality
        const li = createCustomElement(list, 'li', '');
        li.innerHTML = `
            <div class="location-item">
                <span class="location-name">${location.name}</span>
                <div class="location-details" style="display: none;">
                    <p>Description: ${location.description}</p>
                    <p>Address: ${location.address}</p>
                    <p>Hours: ${location.time}</p>
                    <p>Phone: ${location.phone}</p>
                    <p>Email: ${location.email}</p>
                </div>
            </div>
        `;

        // Add hover event listeners
        li.addEventListener('mouseenter', () => {
            li.querySelector('.location-details').style.display = 'block';
        });
        li.addEventListener('mouseleave', () => {
            li.querySelector('.location-details').style.display = 'none';
        });

        // Find the matching category for the custom marker
        const category = locations.categories.find(
            category => category.id === location.categoryId 
        );
        
        const customMarker = L.icon({
            iconUrl: category.markerIcon,
            iconSize: [70, 70],
            shadowSize: [50, 64],
            iconAnchor: [22, 94],
            shadowAnchor: [4, 62],
            popupAnchor: [-3, -76]
        });

        const marker = L.marker(location.point.coordinates.split(','), {icon: customMarker}).addTo(map);
        const placeInfo = `<h6>${location.name}</h6>
        <p>${location.address}</p>
        <p>${location.time}</
        `;
        marker.bindPopup(placeInfo).openPopup();
    });
}