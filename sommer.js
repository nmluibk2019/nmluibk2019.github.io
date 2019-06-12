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
    bmapgelaende: L.tileLayer("https://{s}.wien.gv.at/basemap/bmapgelaende/grau/google3857/{z}/{y}/{x}.jpeg", {
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
    "Geoland Basemap Gelände": kartenLayer.bmapgelaende,
    "OpenStreetMap": kartenLayer.osm,
    "Stamen Terrain": kartenLayer.stamen_terrain,
    "Stamen Watercolor": kartenLayer.stamen_watercolor
}).addTo(karte);


const badeGroup = L.featureGroup().addTo(karte);
const tourradGroup = L.featureGroup().addTo(karte);
const mountbkGroup = L.featureGroup().addTo(karte);

const badeLayer = L.geoJson(BADE, {
    onEachFeature : function(feature, layer) {
        console.log(feature)
    },
    style: function (geoJsonFeature) {
        return {
            color: "blue"
        }
    }
}).addTo(badeGroup);

const suchFeld = new L.Control.Search({
    layer: badeGroup,
    propertyName: "NAME",
    zoom: 17,
    initial: false
});
karte.addControl(suchFeld);


const tourradLayer = L.geoJson(TOURRAD, {
onEachFeature : function(feature, layer) {
    console.log(feature)
},
style: function (geoJsonFeature) {
    return {
        color: "yellow"
    }
}
}).addTo(tourradGroup);


const mountbkLayer = L.geoJson (MOUNTBK, {
    onEachFeature : function(feature, layer) {
        console.log(feature)
    },
    style: function (geoJsonFeature) {
        return {
            color: "red"
        }
    }
}).addTo(mountbkGroup);

layerControl.addOverlay(badeGroup, "Badestellen")
layerControl.addOverlay(tourradGroup, "Touristische Radtouren")
layerControl.addOverlay(mountbkGroup, "Mountainbike Strecken")

karte.fitBounds(badeLayer.getBounds())

//Fullscreen Plugin
karte.addControl(new L.Control.Fullscreen());


//Maßstab einbauen
const massstab = L.control.scale({
    imperial: false,
    metric: true,
});
karte.addControl(massstab);

// https://github.com/Norkart/Leaflet-MiniMap
new L.Control.MiniMap(
    L.tileLayer("https://{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
    }), {
        zoomLevelOffset: -4,
        toggleDisplay: true
    }
).addTo(karte);




