function reqListener() {
    setupPage(this.responseText);
}

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       setupPage(xhttp.responseText);
    }
};
xhttp.open("GET", "https://evancramb.github.io/ctc_brightsign/data.csv",true);
xhttp.send();

classes = null;
current_datetime = new Date(Date.now());

function setupPage(data) {
    //var testPapa = Papa.parse(data,{header: true});
    //var json_data = testPapa.data //JSON.parse(data);
    //var json_data = JSON.parse(data);
	var json_data = csvJSON(data);
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
	html += '<tr><td class="ar">' + classes[i].name + '</td><td class="room"> ' + building_level + ' ' + padNumber(classes[i].room,3) + '</td></tr>';
	
    }
    
    html += '</table>';
    document.getElementById('page_content').innerHTML = html;

    currentSlide = -1;
	changeSlide();
}

function padNumber(aNumber, digits){
    var aNumberInt = Number(aNumber);
    var aNumberString = (aNumberInt).toString();
    var newString = '';
    newString += aNumberString;
    for(c = 0; c < digits-aNumberString.length; c++){
	newString = '0' + newString;
    }
    return newString;
    
}

function changeSlide() {
    currentSlide += 1;
    if (currentSlide > numSlides) {
	currentSlide = 0;
    }
    for (i = 0; i <= numSlides; i++) {
	if (i != currentSlide) {
	    //document.getElementById('slide' + i).setAttribute('style', 'display:none;');
		$("#slide"+i).css('display','none');
	} else {
	    //document.getElementById('slide' + i).setAttribute('style', '');
		$("#slide"+i).css('display','');
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
    var now = current_datetime;
    var Weekday = new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
    var Month = new Array("January","February","March","April","May","June","July","August","September","October","November","December");
    //var value = Weekday[now.getDay()]+',&nbsp'+Month[now.getMonth()]+'&nbsp'+now.getDate()+',&nbsp'+'2021';
	var value = Weekday[now.getDay()]+ ', ' + Month[now.getMonth()] + ' '+ now.getDate().toString() +', ' +now.getFullYear().toString();
	//var value = "Today is 6/30/2021";

	document.getElementById('page_title').innerHTML = value;
    
}

//var csv is the CSV file with headers
function csvJSON(csv){

  var lines=csv.split("\n");

  var result = [];

  var headers=lines[0].split(",");

  for(var i=1;i<lines.length;i++){

	  var obj = {};
	  var currentline=lines[i].split(",");

	  for(var j=0;j<headers.length;j++){
		  obj[headers[j]] = currentline[j];
	  }

	  result.push(obj);

  }
  
  return result; //JavaScript object
  //return JSON.stringify(result); //JSON
}

function incrementCurrentTime(){
console.log(current_datetime);
var h = 5;
current_datetime.setTime(current_datetime.getTime() + (h*60*60*1000));
setupPage(xhttp.responseText);
setHeader();
}
