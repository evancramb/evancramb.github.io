
function reqListener() {
	setupPage(this.responseText);
}

var oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("GET", "../data.json");
oReq.send();

classes = null;
function setupPage(data) {
	classes = JSON.parse(data);
	drawPage();
}

function drawPage() {
	//console.log(classes.filter(function(item) { return item.room === "227" }))
	var html = '<div id="slide0"><h1>Slide 0</h1>';
	var width = 50;
	var classesPerSlide = 5;
	numSlides = 0;


	for (i = 0; i < classes.length; i++) {
		var spacer = '';
		console.log(width - (classes[i].name.length + classes[i].room.toString().length + 2))
		for (c = 0; c < width - (classes[i].name.length + classes[i].room.toString().length + 2); c++) {
			spacer += '.';
			console.log(spacer);
		}
		console.log("Final:" + spacer);
		if (i > 0 && i % classesPerSlide == 0) {
			numSlides += 1;
			html += '</div><div id="slide' + numSlides + '"><h1>Slide ' + numSlides + '</h1>';
		}
		var classTime = new Date(classes[i].date + ' ' + classes[i].time);
		html += String(i).padStart(2, '0') + '. ' + classes[i].name + ' ' + spacer + ' ' + classes[i].room + ', ' + classes[i].date + ' @ ' + classes[i].time;
		console.log(classTime.getDate());
		console.log(new Date(Date.now()).getDate());
		console.log('Time: ' + classTime.getTime());
		if (classTime.getHours() > 15) {
			html += ' Afternoon ';
		} else {
			html += ' Morning ';
		}
		if (classTime.getDate() > new Date(Date.now()).getDate()) {
			html += ' (UPCOMING) ';
		} else if (classTime.getDate() < new Date(Date.now()).getDate()) {
			html += ' (PREVIOUS)';
		}

		html += '<br>';
	}
	html += '</div>';
	document.getElementById('page_content').innerHTML = html;

	currentSlide = 0;
	changeSlide();
}



function changeSlide() {
	if (currentSlide > numSlides) {
		currentSlide = 0;
	}
	for (i = 0; i <= numSlides; i++) {
		if (i != currentSlide) {
			document.getElementById('slide' + i).setAttribute('style', 'display:none;')
		} else {
			document.getElementById('slide' + i).setAttribute('style', '');
		}
	}
}

function incrementSlide() {
	currentSlide += 1;
	changeSlide();
}
