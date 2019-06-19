const div = document.getElementById("map");
const breite = div.getAttribute("data-lat");
const laenge = div.getAttribute("data-lng");
const titel = div.getAttribute("data-title");

//console.log("Breite="breite,"Länge="laenge,"Titel=",title)

//Karte initialisieren
let karte = L.map("map");

//auf Ausschnitt zoomen
karte.setView([47.8006, 13.0432], 14);

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


//Wikipedia Layer
const wikipediaGruppe = L.featureGroup().addTo(karte);
layerControl.addOverlay(wikipediaGruppe, "Wikipedia Artikel");

async function wikipediaArtikelLaden(url) {
    console.log("Lade", url);
    const antwort = await fetch(url);
    const jsonDaten = await antwort.json();

    console.log(jsonDaten);
    for (let artikel of jsonDaten.geonames) {
        const wikipediaMarker = L.marker([artikel.lat, artikel.lng], { //geschwungene Klammer für icon)
            icon: L.icon({
                iconUrl: 'icons/wikipedia.png',
                iconSize: [30, 30]
            })
        }).addTo(wikipediaGruppe);

        //Marker einfügen
        wikipediaMarker.bindPopup(`
    <h3>${artikel.title}</h3>
     <hr>
    <p>${artikel.summary}</p>
    <footer><a target="_blank" href="https://${artikel.wikipediaUrl}">Weblink</a></footer>
     `);
    }
}
let letzteGeonamesUrl = null;
karte.on("load zoomend moveend", function () {
    //console.log("karte geladen", karte.getBounds());

    let ausschnitt = {
        n: karte.getBounds().getNorth(),
        s: karte.getBounds().getSouth(),
        o: karte.getBounds().getEast(),
        w: karte.getBounds().getWest()
    }
    //console.log(ausschnitt);
    const geonamesUrl = `https://secure.geonames.org/wikipediaBoundingBoxJSON?formatted=true&north=${ausschnitt.n}&south=${ausschnitt.s}&east=${ausschnitt.o}&west=${ausschnitt.w}&username=webmapping&style=full&maxRows=50&lang=de`;
    console.log(geonamesUrl);

    if (geonamesUrl != letzteGeonamesUrl) {
        //JSON-Artikel Laden
        wikipediaArtikelLaden(geonamesUrl);
        letzteGeonamesUrl = geonamesUrl;
    }
});

