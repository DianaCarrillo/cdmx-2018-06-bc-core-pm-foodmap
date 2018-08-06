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

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (let i = 0; i < results.length; i++) {
            let place = results[i];
            createMarker(place);
            drawPlaces(place);
            drawModalPopUp(place);
            //   console.log(status);
        }
    }
}

function drawPlaces(place) {
    let nearByRestaurants = document.getElementById('contenedor-restaurantes-cercanos');
    // console.log(place);
    let tbodyElement = document.createElement('tbody');
    let trElement = document.createElement('tr');
    let tdElementRestaurante = document.createElement('td');
    let tdElementRating = document.createElement('td');

    trElement.appendChild(tdElementRestaurante);
    trElement.appendChild(tdElementRating);
    tbodyElement.appendChild(trElement);
    nearByRestaurants.appendChild(tbodyElement);

    tdElementRestaurante.innerHTML = place.name;
    tdElementRating.innerHTML = place.rating;
    if (place.rating === undefined) {
        tdElementRating.innerHTML = ('-');
    } else if (place.rating < 3) {
    tdElementRating.classList = 'badRestaurant';
    } else if (place.rating >= 4.5) {
    // tdElementRating.classList = 'goodRestaurant';
    let iconStar = document.createElement('i');
    iconStar.classList = 'tiny material-icons goldStar';
    iconStar.innerHTML = 'star';
    tdElementRestaurante.appendChild(iconStar);
    // tdElementR.classList = 'star';
    }
tdElementRestaurante.addEventListener('click', drawModalPopUp);
}

function drawModalPopUp(place) {
// console.log(place);

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
}