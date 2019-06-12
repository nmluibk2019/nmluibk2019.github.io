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

karte.setView([47.80949, 13.05501], 13);


const pistenGroup = L.featureGroup().addTo(karte);
const lifteGroup = L.featureGroup().addTo(karte);

//console.log()
const pistenLayer = L.geoJSON(PISTEN, {

}).addTo(pistenGroup);

var LifteCluster = L.markerClusterGroup();

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

function Liftemakemarker(feature, latlng) {
    const icon = L.icon({
        iconUrl: 'icons/icon_ski_alpin_schwarz_auf_weiss_250px.png',
        iconSize: [16, 16]
    });
     

LifteCluster.addLayer(lifteLayer);
karte.addLayer(LifteCluster);
karte.fitBounds(LifteCluster.getBounds());

    LifteCluster.bindPopup(function (layer) {
        const props_lifte = layer.feature.properties;
        const lifte_name = (props_lifte.Name)
        const popup_text = `
    <h1>${props_lifte.Name}</h1>
    <p> Anlagenart: ${props_lifte.Anlagenart}<p>
    <p> Fahrbetrieb: ${props_lifte.Fahrbetrie}<p>
    <p> Saison: ${props_lifte.Saison}<p>
    <p> Status: ${props_lifte.Status}<p>`;
        return popup_text;

    });

    L.geoJson(lifteLayer, {
        pointToLayer: Liftemakemarker
    
    });
    karte.add
}

karte.addLayer(LifteCluster);


        layerControl.addOverlay(pistenGroup, "Pisten")
        layerControl.addOverlay(lifteGroup, "Lifte")

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

        ).addTo(karte);