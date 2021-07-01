function reqListener() {
    setupPage(this.responseText);
}

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       setupPage(xhttp.responseText);
    }
};
xhttp.open("GET", "https://evancramb.github.io/ctc_brightsign/data.json",true);
xhttp.send();

classes = null;
function setupPage(data) {
    //var testPapa = Papa.parse(data,{header: true});
    //console.log(testPapa);
    //var json_data = testPapa //JSON.parse(data);
    //console.log(json_data);
    json_data = JSON.parse(data);
    current_datetime = new Date(Date.now());
	if (current_datetime.getHours() >= 15) {
		classes = $.grep(json_data, function(row, i) {
			var d = new Date(row.date + ' ' + row.time);
			return d.getHours() >= 15 && d.getDate() == current_datetime.getDate();
		});

    }
    else {
		classes = $.grep(json_data, function(row, i) {
			var d = new Date(row.date + ' ' + row.time);
			return d.getHours() < 15 && d.getDate() == current_datetime.getDate();
		});
    }
    drawPage();
    colorNumbers();
    setHeader();
    var seconds = 0;
    setInterval(function() {
	seconds = seconds + 1;
	changeSlide();
    }, 10000);
}

function drawPage() {
    var html = '<table id="slide0">';
    var width = 50;
    var classesPerSlide = 2;
    numSlides = 0;

    for (i = 0; i < classes.length; i++) {
	if (i > 0 && i % classesPerSlide == 0) {
	    numSlides += 1;
	    html += '</table><table id="slide' + numSlides + '">';
	}
	var classTime = new Date(classes[i].date + ' ' + classes[i].time);
	var building_level = '';
	if(Number(classes[i].room) < 200){
	    building_level = 'Basement';
	}
	else{
	    building_level = 'Room';
	}
	//for additional columns html += '<tr><td>' + String(i+1) + '.</td><td class="ar">' + classes[i].name + '</td><td class="room"> ' + building_level + ' ' + classes[i].room + '</td><td> ' + classes[i].date + '</td><td>' + classes[i].time + '</td></tr>'; + numSlides + '">';
	html += '<tr><td class="ar">' + classes[i].name + '</td><td class="room"> ' + building_level + ' ' + classes[i].room + '</td></tr>';
    }
    
    html += '</table>';
    document.getElementById('page_content').innerHTML = html;

    currentSlide = -1;
	changeSlide();
}

function changeSlide() {
    currentSlide += 1;
    if (currentSlide > numSlides) {
	currentSlide = 0;
    }
    for (i = 0; i <= numSlides; i++) {
	if (i != currentSlide) {
	    document.getElementById('slide' + i).setAttribute('style', 'display:none;');
	} else {
	    document.getElementById('slide' + i).setAttribute('style', '');
	}
    }
}

function colorNumbers(){
    var elements = $('.ar');
    var i = 0;
    while (i<elements.length){
	elements[i].innerHTML = elements[i].innerHTML.replace(/(\$?\d+)/g, '<span class="num">$1</span>');
	i+=1;
    }
}

function setHeader(){
    var now = new Date();
    var Weekday = new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
    var Month = new Array("January","February","March","April","May","June","July","August","September","October","November","December");
    //var value = Weekday[now.getDay()]+',&nbsp'+Month[now.getMonth()]+'&nbsp'+now.getDate()+',&nbsp'+'2021';
	var value = Weekday[now.getDay()]+ ', ' + Month[now.getMonth()] + ', '+ now.getDate().toString() +', ' +now.getFullYear().toString();
	//var value = "Today is 6/30/2021";

	document.getElementById('page_title').innerHTML = value;
    
}
