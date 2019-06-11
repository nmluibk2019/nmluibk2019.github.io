let karte = L.map("map");

const kartenlayer = {
    osm: L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
        subdomains: ["a", "b", "c"],
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }),
    geolandbasemap: L.tileLayer("https://{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
        attribution: 'Datenquelle: <a href="https//www.basemap.at">basemap.at</a>'
    }),
    bmapoverlay: L.tileLayer("https://{s}.wien.gv.at/basemap/bmapoverlay/normal/google3857/{z}/{y}/{x}.png", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
        attribution: 'Datenquelle: <a href="https//www.basemap.at">basemap.at</a>'
    }),
    bmaporthofoto30cm: L.tileLayer("https://{s}.wien.gv.at/basemap/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
        attribution: 'Datenquelle: <a href="https//www.basemap.at">basemap.at</a>'
    }),
    bmapgelaende: L.tileLayer("https://{s}.wien.gv.at/basemap/bmapgelaende/grau/google3857/{z}/{y}/{x}.jpeg", {
        subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
        attribution: 'Datenquelle: <a href="https//www.basemap.at">basemap.at</a>'
    }),
    stamen_relief: L.tileLayer("https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg", {
        subdomains: ["a", "b", "c"],
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
    }),
    stamen_watercolor: L.tileLayer("https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg", {
        subdomains: ["a", "b", "c"],
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>',
    }),


};

kartenlayer.geolandbasemap.addTo(karte);


const layerControl = L.control.layers({
    "Geoland Basemap": kartenlayer.geolandbasemap,
    "Geoland Basemap Orthofoto": kartenlayer.bmaporthofoto30cm,
    "Geoland Basemap Gelände": kartenlayer.bmapgelaende,
    "Stamen Relief": kartenlayer.stamen_relief,
    "Stamen Watercolor": kartenlayer.stamen_watercolor
}).addTo(karte);




const pistenGroup = L.featureGroup().addTo(karte);
const lifteGroup = L.featureGroup().addTo(karte);

console.log()
const pistenLayer = L.geoJSON(PISTEN, {}).addTo(pistenGroup);

const lifteLayer = L.geoJSON(LIFTE, {
    onEachFeature: function (feature, layer) {
        //console.log(feature)
    },
    style: function (geoJsonFeature) {
        return {
            color: "red"
        }
    }
}).addTo(lifteGroup);

const suchFeld = new L.Control.Search({
    layer: lifteGroup,
    propertyName: "Name",
    zoom: 17,
    initial: false
});
karte.addControl(suchFeld);

layerControl.addOverlay(pistenGroup, "Pisten")
layerControl.addOverlay(lifteGroup, "Lifte")

karte.fitBounds(lifteLayer.getBounds())

function Liftemakemarker(feature, latlng) {
    const icon = L.icon({
        iconUrl: 'icons/icon_ski_alpin_schwarz_auf_weiss_250px',
        iconSize: [16, 16]
    });
    const Liftemarker = L.marker(latlng, {
        icon: icon
    });

    Liftemarker.bindPopup(`
    <h2>${feature.properties.Name}</h2><br>
    <h3> ${feature.properties.Anlagenart}</h3><br>
    <p> ${feature.properties.Fahrbetrie}<p><br>
    <p> ${feature.properties.Saison}<p><br>
    <p> ${feature.properties.Status}<p><br>
    <hr>
    `);
    return Liftemarker
}
function loadLifte(lifteLayer) {
    L.geoJson(lifteLayer, {
        pointToLayer: Liftemakemarker
    });




    //PlugIns Fullscreen, Maßstab, Minimap, Suchfeld

    karte.addControl(new L.Control.Fullscreen());

    var coords = new L.Control.Coordinates();
    coords.addTo(karte);
    karte.on('click', function (e) {
        coords.setCoordinates(e);
    });

    const scale = L.control.scale({
        imperial: false,
        metric: true,
    });
    karte.addControl(scale);

    new L.Control.MiniMap(

        L.tileLayer("https://{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png", {
            subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
        }), {
            zoomLevelOffset: -4,
            toggleDisplay: true
        }

    ).addTo(karte)};

    loadLifte(lifteLayer);