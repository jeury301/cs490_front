
window.onload=function(){
	console.log("Hello world")
	//var fields = {"primary_key":5}
	var fields = {}
	loadGeneral();
	var is_create = window.localStorage.getItem('is_create')
	if(is_create)
		ajaxCallQuestion("list", JSON.stringify(fields), "", "", "");


}; 



//Loading question bank
function questionList(response){
	var items = response['items']

	console.log(items.length)
	var table = document.getElementById("question_table");

	for (item in items){
		//console.log("ITEM: "+JSON.stringify(items[item]))
		var tr = document.createElement("tr");
		
		//var question_id_td = document.createElement("td");
		//var question_id = document.createTextNode(items[item]['primary_key']);
		//question_id_td.appendChild(question_id);

		var question_name_td = document.createElement("td");
		question_name_td.id = "question_text_"+items[item]['primary_key']
		var question_name = document.createTextNode(items[item]['question_text']);
		
		question_name_td.appendChild(question_name);

		//var edit_td = document.createElement("td");
		//edit_td.innerHTML = '<div class="edit text-center"><input class="clean success" type="button" value="Edit" onClick="edit('+items[item]['primary_key']+')"></div>'
		var add_td = document.createElement("td");
		add_td.innerHTML = '<div class="text-center"><input class="submit-button clean" type="button" value="Add" onClick="addQuestion('+items[item]['primary_key']+')"></div>'

		tr.appendChild(question_name_td);
		//tr.appendChild(edit_td);
		tr.appendChild(add_td);

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
function ajaxCallQuestion(action, fields, primary_key, order, order_by){
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
	request.open('POST', '../../controllers/question/question_front.php', true);
	//setting up the content type in the header to 'x-wwww-form-urlencoded'
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	//making ajax request.
	request.send(data);

	//ajax request was successful
	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			var resp = JSON.parse(request.responseText);
			//console.log(resp['status'])
			if(resp['status']=="success")
				questionList(resp)
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





//Helper functions!!!
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



function goTo(page){
	window.location.replace(page);
}

loadGeneral()