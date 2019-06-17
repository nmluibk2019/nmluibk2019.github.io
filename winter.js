let karte = L.map("map");

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


    layerControl.addOverlay(pistenGroup, '<img src="icons/skiing.png"> Pisten')
    layerControl.addOverlay(lifteGroup, '<img src="icons/skilifting.png"> Lifte')

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