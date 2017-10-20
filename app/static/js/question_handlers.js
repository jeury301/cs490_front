var testCasesKeeper = 0

//This function create a new node for the test case
function addTestCase(){
	console.log("Adding a test case")
	testCasesKeeper = testCasesKeeper+ 1;
	var test_cases_node = document.getElementById("test_cases")
	var new_div = document.createElement("div");
	new_div.classList.add("super-block");
	new_div.id = "block_"+testCasesKeeper
	new_div.innerHTML = '<div class="left-block"><label>&nbsp;</label></div><div class="right-block"><div class="two-quarter" style="width: 40%"><input class="clean" type="text" id="input_'+testCasesKeeper+'" placeholder="Input..." required="Missing input"></div><div class="quarter" style="width: 5%">&nbsp;</div><div class="two-quarter" style="width: 40%;"><input class="clean" type="text" id="output_'+testCasesKeeper+'" placeholder="Expected output..." required="Missing expected output"></div><div class="quarter" style="width: 5%">&nbsp;</div><div class="quarter" style="width: 10%; float: right;" ><input class="clean" type="button" value="Delete" style="width:100%; background:#d9534f;" onClick="deleteTestCase('+testCasesKeeper+')"></div></div>'
	test_cases_node.appendChild(new_div);


	if(scrollBars()){
		document.getElementById("footer").style.position = "relative";
		document.getElementById("dropdown").style.position = "relative";
	}
	else{
		document.getElementById("footer").style.position = "fixed";
		document.getElementById("dropdown").style.position = "fixed";
		console.log("fixed")
	}
	console.log("Test Case count: "+testCasesKeeper)

}

//This function deletes a node from the test cases.
function deleteTestCase(caseNumber){
	console.log("Deleting a test case")
	var current_test_case = document.getElementById("block_"+caseNumber)
	current_test_case.remove();

	testCasesKeeper = testCasesKeeper - 1;
	if(scrollBars()){
		document.getElementById("footer").style.position = "relative";
		document.getElementById("dropdown").style.position = "relative";
	}
	else{
		document.getElementById("footer").style.position = "fixed";
		document.getElementById("dropdown").style.position = "fixed";
		console.log("fixed")
	}

	console.log("Test Case count: "+testCasesKeeper)
}


//Listening for form submission.
function submitQuestion(event){
	var loader = document.getElementById("loader");
	loader.classList.add("loader");
	event.preventDefault();
	//disabling scrolling
	disableScroll();
	//getting all the data needed for submitting a question
	var question_text = document.getElementById("question_text").value;
	console.log("question text: "+question_text)
	var func_name = document.getElementById("func_name").value;
	console.log("function name: "+func_name)
	var param_names = document.getElementById("param_names").value;
	console.log("function params: "+param_names)

	var fields = {"question_text":question_text, "func_name":func_name, "param_names":param_names}



	ajaxCallInsertQuestion("insert", JSON.stringify(fields))
}

//This function submit all the test cases after the question has been created!
function submitTestCases(question_key){
	var primary_key = question_key['items'][0]['primary_key']

	var fields = {"question_id":primary_key}
	for (var i=0;i<=testCasesKeeper;i++){
		var input = document.getElementById("input_"+i).value;
		var output = document.getElementById("output_"+i).value;

		var fields = {
			"question_id":primary_key,
			"input":input,
			"output":output
		}

		ajaxCallInsertTestCase("insert", JSON.stringify(fields))
	}
	//ajaxCallInsertTestCase("insert", )
	console.log("question key: "+primary_key)
}


//This function checks for the end of submission of test cases
function testCaseSubmitted(response){
	console.log("Test case submitted!")
	console.log("Response: "+JSON.stringify(response))
	testCasesKeeper = testCasesKeeper - 1;
	console.log("Test Cases Remaining: "+testCasesKeeper)

	if(testCasesKeeper == -1)
		window.location.replace("question_bank.html");
}


/*
The following function makes an ajax call to the questions resources to insert a question
*/
function ajaxCallInsertQuestion(action, fields){
	//building string to send through an ajax call to the back of the front (question_middle.php) in the format required for 'x-www-form-urlencoded'
	var data = 'json_string={"action":"'+action+'"'
	if(fields != '')
		data = data+',"fields":'+fields
	data = data + '}'
	console.log(data)
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
			console.log(request.responseText)
			var resp = JSON.parse(request.responseText);
			//console.log(resp['status'])
			if(resp['status']=="success")
				submitTestCases(resp)
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


/*
The following function makes an ajax call to the test case resources resources to insert a test case
*/
function ajaxCallInsertTestCase(action, fields){
	//building string to send through an ajax call to the back of the front (question_middle.php) in the format required for 'x-www-form-urlencoded'
	var data = 'json_string={"action":"'+action+'"'
	if(fields != '')
		data = data+',"fields":'+fields
	data = data + '}'
	console.log(data)
	var request = new XMLHttpRequest();
	//opening request of type 'POST' to endpoint 'login.php' (back of the front)
	request.open('POST', '../../controllers/test_case/test_case_front.php', true);
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
				testCaseSubmitted(resp)
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




if(scrollBars()){
	document.getElementById("footer").style.position = "relative";
	document.getElementById("dropdown").style.position = "relative";
}
else{
	document.getElementById("footer").style.position = "fixed";
	document.getElementById("dropdown").style.position = "fixed";
	console.log("fixed")
}

function scrollBars(){
	var body= document.getElementsByTagName("BODY")[0];
	console.log(body.scrollHeight)
	console.log(body.clientHeight)
	return body.scrollHeight>body.clientHeight;	
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

//These code is an attempt to disable scrolling!!!!
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;  
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
  if (window.addEventListener) // older FF
      window.addEventListener('DOMMouseScroll', preventDefault, false);
  window.onwheel = preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  window.ontouchmove  = preventDefault; // mobile
  document.onkeydown  = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null; 
    window.onwheel = null; 
    window.ontouchmove = null;  
    document.onkeydown = null;  
}

function logOut(){
	console.log("Logging Out");
	window.localStorage.removeItem('user_id');
	window.localStorage.removeItem('role')
	window.location.replace("../login/login.html");
}

function goTo(page){
	window.location.replace(page);
}

loadGeneral();