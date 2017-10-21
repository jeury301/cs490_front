/*
**Author: Jeury Mejia
**Last Updated: 10/15/2017
**Purpose: This file contains the functions to access the question resources from the middle.
*/

window.onload=function(){
	console.log("Hello world")
	//var fields = {"primary_key":5}
	var fields = {}
	loadGeneral();
	ajaxCallExams("list", JSON.stringify(fields), "", "", "");

	window.localStorage.removeItem('is_create')

}; 


function examsList(response){
	var items = response['items']

	console.log(items.length)
	var table = document.getElementById("exams_table");

	for (item in items){
		//console.log("ITEM: "+JSON.stringify(items[item]))
		var tr = document.createElement("tr");
		
		var exam_id_td = document.createElement("td");
		var exam_id = document.createTextNode(items[item]['primary_key']);
		exam_id_td.appendChild(exam_id);

		var exam_name_td = document.createElement("td");
		exam_name_td.id = "test_name"+items[item]['primary_key']
		var exam_name = document.createTextNode(items[item]['test_name']);
		exam_name_td.appendChild(exam_name);

		var start_date_td = document.createElement("td");
		var start_date = document.createTextNode(items[item]['start_date']);
		start_date_td.appendChild(start_date);

		var end_date_td = document.createElement("td");
		var end_date = document.createTextNode(items[item]['end_date']);
		end_date_td.appendChild(end_date);

		var finalized = "Yes"

		if (items[item]['finalized'] == "0")
			finalized = "No"

		var finalized_td = document.createElement("td");
		var finalized_value = document.createTextNode(finalized);
		finalized_td.appendChild(finalized_value);

		//var edit_td = document.createElement("td");
		//edit_td.innerHTML = '<div class="edit text-center"><input class="clean success" type="button" value="Edit" onClick="edit('+items[item]['primary_key']+')"></div>'
		var delete_td = document.createElement("td");
		delete_td.innerHTML = '<div class="text-center delete"><input class="clean" type="button" value="Delete" onClick="deleteExame('+items[item]['primary_key']+')" id="exam_to_delete_'+items[item]['primary_key']+'"></div>'

		tr.appendChild(exam_id_td);
		tr.appendChild(exam_name_td);
		tr.appendChild(start_date_td);
		tr.appendChild(end_date_td);
		tr.appendChild(finalized_td);
		tr.appendChild(delete_td);
		table.appendChild(tr);
		
	}
	if(scrollBars()){
		document.getElementById("footer").style.position = "relative";
		document.getElementById("dropdown").style.position = "relative";
	}
	else{
		document.getElementById("footer").style.position = "fixed";
		document.getElementById("dropdown").style.position = "fixed";
		console.log("fixed")
	}

	
}

/*
The following function makes an ajax call to the questions resources to grab the list of questions
*/
function ajaxCallExams(action, fields, primary_key, order, order_by){
	//building string to send through an ajax call to the back of the front (question_middle.php) in the format required for 'x-www-form-urlencoded'
	var data = 'json_string={"action":"'+action+'"'
	if(fields != '')
		data = data+',"fields":'+fields
	if(primary_key != '')
		data = data+',"primary_key":"'+primary_key+'"'
	if(order!='')
		data = data+',"order":"'+order+'"'
	if(order_by!='')
		data = data+',"order_by":"'+order_by+'"'
	data = data + '}'

	console.log(data)
	//creating an ajax request object.
	
	var request = new XMLHttpRequest();
	//opening request of type 'POST' to endpoint 'login.php' (back of the front)
	request.open('POST', '../../controllers/test/test_front.php', true);
	//setting up the content type in the header to 'x-wwww-form-urlencoded'
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	//making ajax request.
	request.send(data);

	//ajax request was successful
	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			console.log(request.responseText)
			var resp = JSON.parse(request.responseText);
			//console.log(resp['status'])
			if(resp['status']=="success")
				examsList(resp)
			else
				console.log("Internal error: "+resp['internal_message'])
			//console.log(JSON.stringify(response))
			//console.log(resp)
		} else {
			var resp = request.responseText;
			console.log("Something major happened!")
			console.log(JSON.stringify(resp))

		}
	};

	//ajax request failed
	request.onerror = function() {
		console.log("Something went wrong")
	};
	
}


function loadGeneral(){
	var user_id = window.localStorage.getItem('user_id');
	if(user_id == null)
		window.location.replace("../login/login.html");
	
	var role = window.localStorage.getItem('role');
	document.getElementById("professor_id").innerHTML = jsUcfirst(role)+": "+user_id
}



function jsUcfirst(string) 
{
	return string.charAt(0).toUpperCase() + string.slice(1);
}



function logOut(){
	console.log("Logging Out");
	window.localStorage.removeItem('user_id');
	window.localStorage.removeItem('role')
	window.location.replace("../login/login.html");
}


function scrollBars(){
	var body= document.getElementsByTagName("BODY")[0];
	console.log(body.scrollHeight)
	console.log(body.clientHeight)
	return body.scrollHeight>body.clientHeight;	
}



function goTo(page, is_create){
	window.location.replace(page);
	
	if(is_create)
		window.localStorage.setItem('is_create', true);
}
