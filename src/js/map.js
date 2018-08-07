// NOTA IMPORTANTE: ALGUNAS FUNCIONES ESTÁN ESCRITAS EN ECMA 5 PARA PODER OBTENER CORRECTAMENT LOS DATOS DE LA API DE GOOGLE MAPS
let map;
let service;
let infowindow;
let request;
let markers = [];

function initMap() {
    let mapCDMX = new google.maps.LatLng(19.370026, -99.1702881);
    map = new google.maps.Map(document.getElementById('map'), {
        center: mapCDMX,
        zoom: 15
    });

    request = {
        location: mapCDMX,
        radius: '500',
        type: ['restaurant']
    };
    infowindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
    google.maps.event.addListener(map, 'click', function (event) {
        map.setCenter(event.latLng);
        clearResults(markers);

        let request = {
            location: event.latLng,
            radius: '500',
            types: ['cafe']
        };
        service.nearbySearch(request, callback);
    });
}

function callback (results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (let i = 0; i < results.length; i++) {
            let place = results[i];
            createMarker(place);
            drawPlace(place);
        }
    }
}
const drawPlace = (place)=>{

 let nearByRestaurants = document.getElementById('contenedor-restaurantes-cercanos');
 let inputRating = document.getElementById('rating-input');
 let buttonRating = document.getElementById('button-rating');
    let tbodyElement = document.createElement('tbody');
    let trElement = document.createElement('tr');
    let tdElementRestaurante = document.createElement('td');
    let tdElementRating = document.createElement('td');
    // tdElementRestaurante.id = `td-element-${place.id}`;
    trElement.appendChild(tdElementRestaurante);
    trElement.appendChild(tdElementRating);
    tbodyElement.appendChild(trElement);
    nearByRestaurants.appendChild(tbodyElement);

    tdElementRestaurante.innerHTML = place.name;
    tdElementRating.innerHTML = place.rating;
    
    buttonRating.addEventListener('click', ()=>{
    let valueInput = inputRating.value;
    if (place.rating == valueInput){
    tdElementRating.classList = 'color';
    tdElementRestaurante.classList ='color';
    } else if(place.ratin != inputRating){ 
        trElement.classList ='hidding'
    }
})

    tdElementRestaurante.addEventListener('click', () => {
        // console.log(place.vicinity);
        let arrayphotos = place.photos;
        if (arrayphotos != null) {
            arrayphotos.forEach(element => {
                let photoPlace = element.html_attributions;
                console.log(photoPlace);

                let openNow = (place.opening_hours.open_now)
                let containerModal = document.getElementById('containerModal')
                if (openNow === true) {
                    let modal = `
                    <div class=" modal-content">
            <h4>${place.name}</h4>
            <p class = "address">${place.vicinity}</p>
            <p> <strong>Rating:</strong> ${place.rating}</p>
            <p>Abierto</p>
            ${photoPlace}     
            </div>`
                    containerModal.innerHTML = modal;
                } else if (openNow === false) {
                    let modal = `
                              
                    <div class="  modal-content">
            <h4>${place.name}</h4>
            <p class = "address"> ${place.vicinity}</p>
            <p> <strong>Rating:</strong> ${place.rating}</p>
            <p>Cerrado</p>
            ${photoPlace}          
            </div>`
                    containerModal.innerHTML = modal;
                }
            })
        }
  
    })
}


function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: placeLoc
    });
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    })
    return marker;
}

function clearResults(markers) {
    for (let marker in markers) {
        markers[marker].setMap(null)
    }
    markers = []
    console.log(markers);
}