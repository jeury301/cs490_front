/*
**Author: Jeury Mejia
**Last Updated: 10/15/2017
**Purpose: This file contains the functions to access the question resources from the middle.
*/

window.onload=function(){
	console.log("Hello world")
	//var fields = {"primary_key":5}
	
	window.localStorage.removeItem("question_to_delete")
	loadGeneral();
	var fields = {}
	ajaxCallQuestion("list", JSON.stringify(fields), "", "", "");
	console.log("Do you see me?")
	
}; 

var filterKeeper = 0


//This function create a new node for the test case
function addFilter(){
	console.log("Adding a filter")
	filterKeeper = filterKeeper+ 1;
	var test_cases_node = document.getElementById("filters")
	var new_div = document.createElement("div");
	new_div.classList.add("super-block");
	new_div.id = "block_"+filterKeeper
	new_div.innerHTML = '<div class="left-block" id="left_block_0"><label>&nbsp;</label></div><div class="right-block" id="right_block_0"><div class="two-quarter" style="width: 40%"><select class="styled-select blue semi-square" id="filter_'+filterKeeper+'"><option value="">Select Filter</option><option value="primary_key">Primary Key</option><option value="question_text">Question Text</option></select></div><div class="quarter" style="width: 5%">&nbsp;</div><div class="two-quarter" style="width: 40%;"><input class="clean" type="text" id="filter_value_'+filterKeeper+'" placeholder="Filter value..." required=""></div><div class="quarter" style="width: 5%">&nbsp;</div><div class="quarter" style="width: 10%; float: right;" ><input class="clean" type="button" value="Delete" style="width:100%; background:#d9534f;" onClick="deleteFilter('+filterKeeper+')"></div></div>'
	test_cases_node.appendChild(new_div);

	document.getElementById("filter_add").disabled = true;

	if(scrollBars()){
		document.getElementById("footer").style.position = "relative";
		document.getElementById("dropdown").style.position = "relative";
	}
	else{
		document.getElementById("footer").style.position = "fixed";
		document.getElementById("dropdown").style.position = "fixed";
		console.log("fixed")
	}
	console.log("Filter count: "+filterKeeper)

}

//This function deletes a node from the test cases.
function deleteFilter(caseNumber){
	console.log("Deleting a filter")
	var current_test_case = document.getElementById("block_"+caseNumber)
	current_test_case.remove();
	document.getElementById("filter_add").disabled = false;

	filterKeeper = filterKeeper - 1;
	if(scrollBars()){
		document.getElementById("footer").style.position = "relative";
		document.getElementById("dropdown").style.position = "relative";
	}
	else{
		document.getElementById("footer").style.position = "fixed";
		document.getElementById("dropdown").style.position = "fixed";
		console.log("fixed")
	}

	console.log("Filter count: "+filterKeeper)
}



function questionList(response){
	var items = response['items']

	console.log(items.length)
	var table = document.getElementById("question_table");

	for (item in items){
		//console.log("ITEM: "+JSON.stringify(items[item]))
		var tr = document.createElement("tr");
		
		var question_id_td = document.createElement("td");
		var question_id = document.createTextNode(items[item]['primary_key']);
		question_id_td.appendChild(question_id);

		var topic_td = document.createElement("td");
		var topic = document.createTextNode(items[item]['topic']);
		topic_td.appendChild(topic);

		var difficulty_td = document.createElement("td");
		var difficulty = document.createTextNode(items[item]['difficulty']);
		difficulty_td.appendChild(difficulty);

		var question_name_td = document.createElement("td");
		question_name_td.id = "question_text_"+items[item]['primary_key']
		var question_name = document.createTextNode(items[item]['question_text']);
		
		question_name_td.appendChild(question_name);

		//var edit_td = document.createElement("td");
		//edit_td.innerHTML = '<div class="edit text-center"><input class="clean success" type="button" value="Edit" onClick="edit('+items[item]['primary_key']+')"></div>'
		var delete_td = document.createElement("td");
		delete_td.innerHTML = '<div class="delete text-center"><input class="clean" type="button" value="Delete" onClick="deleteQuestion('+items[item]['primary_key']+')"></div>'

		tr.appendChild(question_id_td);
		tr.appendChild(topic_td);
		tr.appendChild(difficulty_td);

		tr.appendChild(question_name_td);
		//tr.appendChild(edit_td);
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


function deleteQuestion(primary_key){
	console.log("question_item: "+primary_key)
	var question_text = String(document.getElementById("question_text_"+primary_key).textContent)
	console.log("question_text: "+question_text)
	var question = {"primary_key":primary_key, "question_text":question_text}
	window.localStorage.setItem("question_to_delete", JSON.stringify(question))
	goTo("delete_question.html")
}



function clearTable(table) {
  var rows = table.rows;
  var i = rows.length;
  while (--i) {
    rows[i].parentNode.removeChild(rows[i]);
    // or
    // table.deleteRow(i);
  }
}



function filterQuestions(){
	console.log("Filtering questions")
	var fields = {}
	var sorted_by_obj = document.getElementById("sorted_by")
	var sorted_by =  sorted_by_obj.options[sorted_by_obj.selectedIndex].value;

	var order_obj = document.getElementById("order")
	var order =  order_obj.options[order_obj.selectedIndex].value;

	for(var i=0; i<=filterKeeper;i++){
		var filter_obj = document.getElementById("filter_"+i)
		var selected_filter = filter_obj.options[filter_obj.selectedIndex].value;
		var filter_value = document.getElementById("filter_value_"+i).value

		if(selected_filter != "" && filter_value!=""){
			if(selected_filter in fields)
				continue;
			else
				fields[selected_filter] = filter_value
		}
		
	}

	if(sorted_by == "")
		order = ""

	var topic_obj = document.getElementById("topic")
	var topic =  topic_obj.options[topic_obj.selectedIndex].value;

	if(topic != "")
		fields["topic"] = topic

	var difficulty_obj = document.getElementById("difficulty")
	var difficulty =  difficulty_obj.options[difficulty_obj.selectedIndex].value;

	if(difficulty != "")
		fields["difficulty"] = difficulty

	console.log("Order: "+order);
	console.log("Sorted by: "+sorted_by);
	console.log("Filters: "+JSON.stringify(fields))

	var table = document.getElementById("question_table");
	clearTable(table)

	ajaxCallQuestion("list", JSON.stringify(fields), "", order, sorted_by);
}







/*
The following function makes an ajax call to the questions resources to grab the list of questions
*/
function ajaxCallQuestion(action, fields, primary_key, order, order_by){
	//building string to send through an ajax call to the back of the front (question_middle.php) in the format required for 'x-www-form-urlencoded'
	fields = escapeThemAll(fields)
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

