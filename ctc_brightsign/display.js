function reqListener() {
    setupPage(this.responseText);
}

var oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("GET", "data.json");
oReq.send();

classes = null;
function setupPage(data) {
    //var testPapa = Papa.parse(data,{header: true});
    //console.log(testPapa);
    //var json_data = testPapa //JSON.parse(data);
    //console.log(json_data);
    json_data = JSON.parse(data);
    current_datetime = new Date(Date.now());
    if (current_datetime.getHours() >= 15) {
	classes = json_data.filter(function(row) {
	    var d = new Date(row.date + ' ' + row.time); 
	    return d.getHours() >= 15 && d.getDate() == current_datetime.getDate();
	});

    }
    else {
	classes = json_data.filter(function(row) {
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
	console.log(seconds + " seconds have elapsed");
	changeSlide();
    }, 10000);
}

function drawPage() {
    var html = '<table id="slide0">';
    var width = 50;
    var classesPerSlide = 8;
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
	html += '<tr><td class="ar">' + classes[i].name + '</td><td class="room"> ' + building_level + ' ' + String(classes[i].room).padStart(3, '0') + '</td></tr>';
	console.log(String(classes[i].room).padStart(3, '0'));
    }
    
    html += '</table>';
    document.getElementById('page_content').innerHTML = html;

    currentSlide = 0;
}

function changeSlide() {
    currentSlide += 1;
    console.log(currentSlide+'/'+numSlides);
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

function colorNumbers(){
    var elements = document.getElementsByClassName('ar');
    var i = 0;
    while (i<elements.length){
	elements[i].innerHTML = elements[i].textContent.replace(/(\$?\d+)/g, '<span class="num">$1</span>');
	i+=1;
    }
}

function setHeader(){
    var now = new Date();
    var Weekday = new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
    var Month = new Array("January","February","March","April","May","June","July","August","September","October","November","December");
    var value = Weekday[now.getDay()]+',&nbsp'+Month[now.getMonth()]+'&nbsp'+now.getDate()+',&nbsp'+now.getFullYear();
    
    var title_text = 
	document.getElementById('date').innerHTML = value;
    
}
