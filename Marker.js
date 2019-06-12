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




        function Liftemakemarker(feature, latlng) {
            const icon = L.icon({
                iconUrl: 'icons/icon_ski_alpin_schwarz_auf_weiss_250px.png',
                iconSize: [16, 16]
            });
            


            L.geoJson(lifteLayer, {
                pointToLayer: Liftemakemarker
            
            });
            karte.add
        }
    
        karte.addLayer(LifteCluster);