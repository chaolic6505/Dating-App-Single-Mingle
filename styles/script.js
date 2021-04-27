function toRad(Value) {
	return (Value * Math.PI) / 180;
}
function calcCrow(lat1, lon1, lat2, lon2) {
	var R = 6371; // km
	var dLat = toRad(lat2 - lat1);
	var dLon = toRad(lon2 - lon1);
	var lat1 = toRad(lat1);
	var lat2 = toRad(lat2);

	var a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;
	//console.log(Math.round(d));
	let show_distance_target = document.querySelector('#displaydistance');

	show_distance_target.innerHTML = show_distance_target = Math.round(d);

	return Math.round(d);
}

loadFile = (event, id) => {
	var reader = new FileReader();
	//console.log(id)

	reader.onload = function () {
		var output = document.getElementById(id);

		//console.log(reader.result);

		//output.backgroundImage = `url(${reader.result})`;
		output.src = reader.result;
	};
	//console.log(event.target);
	reader.readAsDataURL(event.target.files[0]);
};

function getVals() {
	// Get slider values
	var parent = this.parentNode;
	var slides = parent.getElementsByTagName('input');
	var slide1 = parseFloat(slides[0].value);
	var slide2 = parseFloat(slides[1].value);
	// Neither slider will clip the other, so make sure we determine which is larger
	if (slide1 > slide2) {
		var tmp = slide2;
		slide2 = slide1;
		slide1 = tmp;
	}

	// var displayElement = parent.getElementsByClassName('rangeValues')[0];
	displayElement2 = document.querySelector('.rangeValues');
	displayElement2.innerHTML = slide1 + ' - ' + slide2;
}

window.onload = function () {
	// Initialize Sliders
	var sliderSections = document.getElementsByClassName('range-slider');
	for (var x = 0; x < sliderSections.length; x++) {
		var sliders = sliderSections[x].getElementsByTagName('input');
		for (var y = 0; y < sliders.length; y++) {
			if (sliders[y].type === 'range') {
				sliders[y].oninput = getVals;
				// Manually trigger event first time to display values
				sliders[y].oninput();
			}
		}
	}
};
sideBarMove = (state) => {
	if (state == 1) {
		document.querySelector('.sidebar-menu').style.left = '0%';
	} else if (state == 0) {
		document.querySelector('.sidebar-menu').style.left = '-200%';
	}
};









