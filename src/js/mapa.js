(function(){
    // const lat = 25.54389;
    // const lng = -103.41898;
     //tomamos las coordenadas que selecciono el usuario y si no selecciono nada ponemos las coord default
     const lat = document.querySelector('#lat').value || 25.54389;
     const lng = document.querySelector('#lng').value ||-103.41898;
    let marker;

    //
    const geocodeService = L.esri.Geocoding.geocodeService()

    // L.map('mapa'): Crea un mapa utilizando la biblioteca Leaflet. Se asume que hay un elemento HTML con el id mapa donde se va a renderizar el mapa.
    // .setView([lat, lng], 16): Establece la vista del mapa en las coordenadas especificadas (lat, lng) con un nivel de zoom de 16.
    const mapa = L.map('mapa').setView([lat,lng],16);
 // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'): Crea una capa de tiles utilizando los mapas de OpenStreetMap. La URL de los tiles contiene {s}, {z}, {x}, y {y}, que son placeholders para el subdominio del servidor, el nivel de zoom, y las coordenadas del tile.
    // { attribution: ... }: Proporciona la atribución requerida por OpenStreetMap, que es un enlace al sitio web y a los derechos de autor.
    // .addTo(mapa): Añade esta capa de tiles al mapa creado anteriormente (mapa).
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);



    //pin to select some place in the map
     // el pin para seleccionar un lugar en especifico del mapa
     marker = new L.marker([lat,lng],{
        draggable:true,
        autoPan:true
    })
    .addTo(mapa)

    //check the movement of the spin and get the coordinates
    marker.on('moveend', function(event ){
        marker = event.target
        const posicion = marker.getLatLng();
        mapa.panTo(new L.LatLng(posicion.lat,posicion.lng))
                //obtener la informacion de las calles 
                geocodeService.reverse().latlng(posicion,13).run(function(error,resultado){
                    //show message with name stree above of sppin
                    marker.bindPopup(resultado.address.LongLabel).openPopup();    

                    //put the stree , lat and lng in the field text
                    document.querySelector('.calle').textContent = resultado?.address?.Address ?? '';
                    document.querySelector('#calle').value = resultado?.address?.Address ?? '';
                    document.querySelector('#lat').value = resultado?.latlng?.lat ?? '';
                    document.querySelector('#lng').value = resultado?.latlng?.lng ?? '';
                })
            })

})()