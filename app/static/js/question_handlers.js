window.onload=function(){
	//var fields = {"primary_key":5}
	var question = window.localStorage.getItem("question_to_delete")
	console.log("Question to delete: "+question)
	if(question){
		var question = JSON.parse(question)['question_text'];
		document.getElementById("question_to_remove").innerHTML = "Q: "+question
	}

	var fields = {}
	//ajaxCallQuestion("list", JSON.stringify(fields), "", "", "");
}; 


function fullyDeleteQuesiton(){
	var question = window.localStorage.getItem("question_to_delete")
	var primary_key =  JSON.parse(question)['primary_key'];
	console.log(primary_key)

	ajaxCallToDelete("delete", primary_key)


}




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

	var topic_obj = document.getElementById("topic")
	var topic =  topic_obj.options[topic_obj.selectedIndex].value;

	console.log("topic: "+topic)

	var difficulty_obj = document.getElementById("difficulty")
	var difficulty =  difficulty_obj.options[difficulty_obj.selectedIndex].value;

	console.log("difficulty: "+difficulty)

	var fields = {"question_text":question_text, "func_name":func_name, "param_names":param_names, "topic":topic, "difficulty":difficulty}

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
	fields = fields.replaceAll("+", "%2B")
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
			if(resp['status']=="success"){
				console.log("stop")
				submitTestCases(resp)
			}
			else{
				console.log("Internal error: "+resp['internal_message'])
				flash(request.responseText, "#F45F63")
				enableScroll();
				loader.classList.remove("loader");
			}
			//console.log(JSON.stringify(response))
			//console.log(resp)
		} else {
			var resp = request.responseText;
			console.log("Something major happened!")
			flash(resp, "#F45F63")
			enableScroll();
			loader.classList.remove("loader");

			//console.log(JSON.stringify(resp))

		}
	};

	//ajax request failed
	request.onerror = function() {
		console.log("Something went wrong")
		flash("Something went wrong", "#F45F63")
		enableScroll();
		loader.classList.remove("loader");

	};
	
}





function ajaxCallToDelete(action, primary_key){
	//building string to send through an ajax call to the back of the front (question_middle.php) in the format required for 'x-www-form-urlencoded'
	var data = 'json_string={"action":"'+action+'", "primary_key":"'+primary_key+'", "fields":{}}'
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
			try {
				console.log(request.responseText)
				var resp = JSON.parse(request.responseText);
				//console.log(resp['status'])
				if(resp['status']=="success"){
					window.localStorage.removeItem("question_to_delete")
					goTo('question_bank.html')
				}
				else{
					console.log("Internal error: "+request.responseText)
					
					flash(resp['user_message'], "#F45F63")
					enableScroll();
					loader.classList.remove("loader");

			}
			//console.log(JSON.stringify(response))
			//console.log(resp)
			} catch (e) {
				flash(request.responseText, "#F45F63")
				enableScroll();
				loader.classList.remove("loader");

			}

	} else {
		var resp = request.responseText;
		console.log("Something major happened!")
		flash(resp, "#F45F63")
		enableScroll();
		loader.classList.remove("loader");

		//console.log(JSON.stringify(resp))

	}
};

	//ajax request failed
	request.onerror = function() {
		console.log("Something went wrong")
		flash("Something went wrong", "#F45F63")
		enableScroll();
	};
	
}






/*
The following function makes an ajax call to the test case resources resources to insert a test case
*/
function ajaxCallInsertTestCase(action, fields){
	//building string to send through an ajax call to the back of the front (question_middle.php) in the format required for 'x-www-form-urlencoded'
	fields = fields.replaceAll("+", "%2B")
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
			try {
				console.log(request.responseText)
				var resp = JSON.parse(request.responseText);
				//console.log(resp['status'])
				if(resp['status']=="success")
					testCaseSubmitted(resp)
				else{
					console.log("Internal error: "+request.responseText)
					flash(request.responseText, "#F45F63")
					enableScroll();
					loader.classList.remove("loader");

			}
			//console.log(JSON.stringify(response))
			//console.log(resp)
			} catch (e) {
				flash(request.responseText, "#F45F63")
				enableScroll();
				loader.classList.remove("loader");

			}

	} else {
		var resp = request.responseText;
		console.log("Something major happened!")
		flash(resp, "#F45F63")
		enableScroll();
		loader.classList.remove("loader");

		//console.log(JSON.stringify(resp))

	}
};

	//ajax request failed
	request.onerror = function() {
		console.log("Something went wrong")
		flash("Something went wrong", "#F45F63")
		enableScroll();
	};
	
}


/*
The following function is called by loginAjaxHandler(). It creates, formats and displays a flash message on the login page. It recieves the message, 
and the background color of the message (red, green).
*/
function flash(message, color) {
    //getting login elements
    var login_body = document.getElementById("header")
    //login any current flash message
    var flash = document.getElementById("flash")
    
    if(flash){
    	//if a current flash message exists, remove it.
    	login_body.removeChild(flash);
    }
    //build new flash message
    var new_flash =  document.createElement("div");
    new_flash.setAttribute("id", "flash");
    new_flash.innerHTML = message    

    //applying css dynamically
    new_flash.style.position = "fixed"
	new_flash.style.zIndex =  '1';
	new_flash.style.textAlign = "center"
	new_flash.style.margin  = "auto"
	new_flash.style.marginLeft = "22%"
	new_flash.style.color = "#fff"
	new_flash.style.fontSize = "19px"
	new_flash.style.width = "50%"
	new_flash.style.padding = "20px"
	new_flash.style.MozBorderRadius = "5px"
	new_flash.style.WebkitBorderRadius = "5px"
	new_flash.style.borderRadius = "5px"
	new_flash.style.backgroundColor = color
	new_flash.style.fontFamily = "'Open Sans', Arial, sans-serif;"
    
    //handling multiple browsers...
    if(msieversion()){
    	//this is the way to display the flash message, if browser is IE or EDGE
    	console.log("This is IE")
    	login_body.insertBefore(new_flash,(login_body.hasChildNodes())
                            ? login_body.childNodes[0]
                            : null);
    }
    else{
    	//this is the way to display te flash message, if browser is not IE nor EDGE
    	console.log("This is not IE")
    	login_body.prepend(new_flash)

    }
    
    //remove flash message with a delay of 8 seconds and applying a fadeout animation.
    setTimeout(function(){
    	//fading out message
    	fade(new_flash);
    }, 8000);
      
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


/*
The following function is called by flash(). It recieves an element to fade, and it fades it away
from the screen. It does it by changing the opacity of the element at a rate of 50 miliseconds until
the opecity is less than or equal to 0.1, at which point is just removed entirely from screen by setting
'display' to 'none'.
*/
function fade(element) {
    //fading element away.
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 30);
}


/*
The following function is called by flash(). It checks the current browser, it returns true if browser is 
either 'IE' or 'EDGE', and false otherwise.
*/
function msieversion() 
{
	//is ie?
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    //is edge?
    var isEdge = !isIE && !!window.StyleMedia;

    //if IE or EDGE, return true, false otherwise
    if (isIE || isEdge) // If Internet Explorer, return version number
    {
        return true
    }
    return false;

}

String.prototype.replaceAll = function(str1, str2, ignore) 
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
} 

loadGeneral();