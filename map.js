function processStatus(response) {
	if (response.status === 200 || response.status === 0) {
		return Promise.resolve(response)
	} else {
		return Promise.reject(new Error(response.statusText))
	}
}

function start() {
	fetch("coordinate.json")
		.then(processStatus)
		.then(response => response.json())
		.then(json => initHtml(json));
}

function initHtml(json) {
	initMap(25.150860, 121.772653, false);
	let dropdownMenuLink = document.getElementById("navbarDropdownMenuLink");
	let locations = document.getElementById("locations");

	// Inner dropdown items to HTML.
	json.forEach((value, index) => {
		locations.innerHTML += '<a class="dropdown-item" id="p' + index + '" href="#">' + value.name + '</a>';
	});

	document.getElementById("overview").addEventListener("click", function() {
		initMap(25.150860, 121.772653, false);
		dropdownMenuLink.innerHTML = "海洋大學全覽";
	});

	// Add listeners to locations.
	json.forEach((value, index) => {
		document.getElementById("p" + index).addEventListener("click", function() {
			initMap(value.lat, value.lng, true, value.name);
			dropdownMenuLink.innerHTML = value.name;
		});
	});

	// Add fade in animation after body loaded.
	document.body.className += " loaded";
}

function initMap(lat, lng, marker, msg) {
	if (marker) {
		let place = {lat: lat, lng: lng};
		let map = new google.maps.Map(document.getElementById("map"), {
			zoom: 16.7,
			center: place
		});
		let marker = new google.maps.Marker({
			position: place,
			map: map
		});
		let infowindow = new google.maps.InfoWindow({
			content: msg
		});

		marker.addListener("click", () => {
				map.setCenter(marker.getPosition());
				map.setZoom(20);
				infowindow.open(marker.get("map"), marker);
		});
	} else {
		let place = {lat: lat, lng: lng};
		let map = new google.maps.Map(document.getElementById("map"), {
			zoom: 15.5,
			center: place,
		});
	}		
}

window.addEventListener("load", start, false);