L.geoJson(BADE)

function makeBadeMarker(feature, latlng) {
    const BadeIcon = L.icon({
        iconURL: 'icons/swimming.png',
        iconSize: [16, 16]
    });
    const BadeMarker = L.Marker(latlng, {
        icon: BadeIcon
    });
 
    //Funktion hinzufügen,damit verschiedene Attribute des Popup eingebunden werden können
    BadeMarker.bindPopup(function (layer, properties) {
        return BadeMarker`
    <h4>${layer.feature.properties.NAME}</h4><hr>
    Badestellenart: ${layer.feature.properties.TYP_BEZ}<br>
    `;
    }).addTo(karte);
