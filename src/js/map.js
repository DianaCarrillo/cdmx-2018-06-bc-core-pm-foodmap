// NOTA IMPORTANTE: ALGUNAS FUNCIONES ESTÁN ESCRITAS EN ECMA 5 PARA PODER OBTENER CORRECTAMENT LOS DATOS DE LA API DE GOOGLE MAPSs
$('.modal').modal();

let map;
let service;
let infowindow;
let request;
let markers = [];
const dataPlaces = [];

let buttonRating = document.getElementById('button-rating');
let inputRating = document.getElementById('rating-input');
let nearByRestaurantsContainer = document.getElementById('contenedor-restaurantes-cercanos');


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
    dataPlaces.splice(0, dataPlaces.length -1);
    nearByRestaurantsContainer.innerHTML = '';
        for (let i = 0; i < results.length; i++) {
            let place = results[i];
            dataPlaces.push(results[i]);
            createMarker(place);
            drawPlace(place);
        }
    }

const drawPlace = (place)=>{
    let tbodyElement = document.createElement('tbody');
    let trElement = document.createElement('tr');
    let tdElementRestaurante = document.createElement('a');
    tdElementRestaurante.setAttribute('href', '#modal1-${place.id}')
    let tdElementRating = document.createElement('td');
   
    tdElementRestaurante.id = `td-element-${place.id}`;
    trElement.appendChild(tdElementRestaurante);
    trElement.appendChild(tdElementRating);
    tbodyElement.appendChild(trElement);
    nearByRestaurantsContainer.appendChild(tbodyElement);

    tdElementRestaurante.innerHTML = place.name;
    tdElementRating.innerHTML = place.rating;
    
    tdElementRestaurante.addEventListener('click', () => {
        console.log(place);
        
        // console.log(place.vicinity);
        let arrayphotos = place.photos;
        if (arrayphotos != null) {
            arrayphotos.forEach(element => {
                let photoPlace = element.html_attributions;
                console.log(photoPlace);

                let openNow = (place.opening_hours.open_now)
                let containerModal = document.getElementById('containerModal')
                if (openNow === true) {
                    let modal = `<div id='td-element-${place.id}'>
                                    <div class=" modal-content">
                                        <h4>${place.name}</h4>
                                        <p class = "address">${place.vicinity}</p>
                                        <p> <strong>Rating:</strong> ${place.rating}</p>
                                        <p>Abierto</p>
                                            ${photoPlace}
                                    </div>
                                </div>`
                    containerModal.innerHTML = modal;
                } else if (openNow === false) {
                    let modal = `<div class="  modal-content">
                                    <h4>${place.name}</h4>
                                    <p class = "address"> ${place.vicinity}</p>
                                    <p> <strong>Rating:</strong> ${place.rating}</p>
                                    <p>Cerrado</p>${photoPlace}          
                                </div>`
                    containerModal.innerHTML = modal;
                }
            })
        }
  
    })
}


const filterFunction = (array, search )=>{
    let valueInput = search.value.trim();
    console.log(valueInput);
 const arrayFilter = array.filter((place)=>{
     if(valueInput == ""){
        return place;
     } else{
        return place.rating == valueInput;
     }
     
    
 });
console.log(arrayFilter);
arrayFilter.forEach((element)=>{
drawPlace(element);

})
};

buttonRating.addEventListener('click', () => {
    nearByRestaurantsContainer.innerHTML = "";
    filterFunction(dataPlaces, inputRating);
    

})

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
