//Salzburg

const div = document.getElementById("map");
const breite = div.getAttribute("data-lat");
const laenge = div.getAttribute("data-lng");
const titel = div.getAttribute("data-title");


//console.log("Breite="breite,"Länge="laenge,"Titel=",title)

//Karte initialisieren
let karte = L.map("map");

//auf Ausschnitt zoomen
karte.setView([47.80949, 13.05501], 13);

//gewünschte Kartenlayer einbauen
const kartenLayer = {
    osm: L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
        subdomains: ["a", "b", "c"],
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }),
    geolandbasemap: L.tileLayer("https://{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
        attribution: 'Datenquelle: <a href="https://www.basemap.at">basemap.at</a>'
    }),
    bmapgrau: L.tileLayer("https://{s}.wien.gv.at/basemap/bmapgrau/normal/google3857/{z}/{y}/{x}.png", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
        attribution: 'Datenquelle: <a href="https://www.basemap.at">basemap.at</a>'
    }),
    bmaporthofoto30cm: L.tileLayer("https://{s}.wien.gv.at/basemap/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
        attribution: 'Datenquelle: <a href="https://www.basemap.at">basemap.at</a>'
    }),
    stamen_terrain: L.tileLayer("https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg", {
        subdomains: ["a", "b", "c"],
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
    }),
    stamen_watercolor: L.tileLayer("https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg", {
        subdomains: ["a", "b", "c"],
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
    })
};

//kartenlayer hinzufügen
kartenLayer.osm.addTo(karte);

//Auswahlleiste der Layer hinzufügen
const layerControl = L.control.layers({
    "Geoland Basemap": kartenLayer.geolandbasemap,
    "Geoland Basemap Grau": kartenLayer.bmapgrau,
    "Geoland Basemap Orthofoto": kartenLayer.bmaporthofoto30cm,
    "OpenStreetMap": kartenLayer.osm,
    "Stamen Terrain": kartenLayer.stamen_terrain,
    "Stamen Watercolor": kartenLayer.stamen_watercolor
}).addTo(karte);

//Fullscreen Plugin
karte.addControl(new L.Control.Fullscreen());


//Maßstab einbauen
const massstab = L.control.scale({
    imperial: false,
    metric: true,
});
karte.addControl(massstab);

//Koordinaten durch Klick anzeigen
var coords = new L.Control.Coordinates();
coords.addTo(karte);
karte.on('click', function (e) {
    coords.setCoordinates(e);
});

// https://github.com/Norkart/Leaflet-MiniMap
new L.Control.MiniMap(
    L.tileLayer("https://{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
    }), {
        zoomLevelOffset: -4,
        toggleDisplay: true
    }
).addTo(karte);

const badeGroup = L.featureGroup().addTo(karte);
const tourradGroup = L.featureGroup().addTo(karte);
const mountbkGroup = L.featureGroup().addTo(karte);

const badeLayer = L.geoJson(BADE, {
    onEachFeature: function (feature, layer) {
        console.log(feature)
    },
    style: function (geoJsonFeature) {
        return {
            color: "blue"
        }
    }
}).addTo(badeGroup);

//Search Plugin bezogen auf die Komponente Badestellen
const suchFeld = new L.Control.Search({
    layer: badeGroup,
    propertyName: "NAME",
    zoom: 17,
    initial: false
});
karte.addControl(suchFeld);


const tourradLayer = L.geoJson(TOURRAD, {
    onEachFeature: function (feature, layer) {
        console.log(feature)
    },
    style: function (geoJsonFeature) {
        return {
            color: "yellow"
        }
    }
}).addTo(tourradGroup);


const mountbkLayer = L.geoJson(MOUNTBK, {
    onEachFeature: function (feature, layer) {
        console.log(feature)
    },
    style: function (geoJsonFeature) {
        return {
            color: "red"
        }
    }
}).addTo(mountbkGroup);


layerControl.addOverlay(tourradGroup, '<img src="icons/rad.png"> Touristische Radrouten')
layerControl.addOverlay(mountbkGroup, '<img src="icons/bike.png"> Mountainbike Strecken')

karte.fitBounds(badeLayer.getBounds())



    L.geoJson(BADE)
//Funktion hinzufügen,damit verschiedene Attribute des Popup eingebunden werden können
.bindPopup(function(layer,properties){
    return`
    <h4>${layer.feature.properties.NAME}</h4><hr>
    Badestellenart: ${layer.feature.properties.TYP_BEZ}<br>
    `;
}).addTo(karte);


    let radverleih = L.marker([47.80298454, 13.0297052], {
        icon: L.icon({
            iconUrl: "icons/bikeinfo.png",
            iconSize: [30, 30],
            iconAnchor: [12, 12],
            popupAnchor: [0, 0]
        })

    }).addTo(karte).bindPopup(`<h4> Avelo Räder, E-Bikes, Service, Verleih <hr>
Standort: Willibald-Hauthaler-Str. 10<p>
Telefon: +43 (0)662 4355950 <hr> 
Email: avelo@aon.at 
</h4>`);


    let stationambahnhof = L.marker([47.81202821, 13.04644689], {
        icon: L.icon({
            iconUrl: "icons/bikeinfo.png",
            iconSize: [30, 30],
            iconAnchor: [12, 12],
            popupAnchor: [0, 0]
        })

    }).addTo(karte).bindPopup(`<h4>Self-Service-Station <hr> 
Standort: Bike & Ride Hauptbahnhof - Zugang Schallmoos
Telefon: +43 (0)662 8072 2735
</h4>`);

    let radverleiharenberg = L.marker([47.80096128, 13.06159699], {
        icon: L.icon({
            iconUrl: "icons/bikeinfo.png",
            iconSize: [30, 30],
            iconAnchor: [12, 12],
            popupAnchor: [0, 0]
        })
    }).addTo(karte).bindPopup(`<h4> Hotel Haus Arenberg / Movelo Pedelecverleih <hr>
Standort: Blumensteinstraße 8<p>
Telefon: +43(0)662 6400970 <hr>
Email: info@arenberg-salzburg.at
</h4>`);

