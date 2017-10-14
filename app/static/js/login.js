/*
**Author: Jeury Mejia
**Last Updated: 09/23/17
**Purpose: This file contains the functions that support the login mechanism from the login page. 
The login process consistsof validating the username/password fields, and making an ajax request 
to the back of the front, which is the login.php file.When a response in recieved from login.php, 
another set of functions will display a notification message indicating the statusof login, wether 
it failed or succeed.
*/


/*
The following event listener is binded to the "submit click" action for the login form. 
The default behaviour of an on submit is prevented and userLogin() is called.
*/
document.querySelector("#form_login").addEventListener("submit", function(e){
	//preventing default behaviour
	e.preventDefault(); 
	//making a call user userLogin()
	userLogin() 
});


/*
The following event listener is binded to a "required" field, and it changes the message
it displays when the "Username" field is empty. It removes the message and therefore validates
the field when length is greater than 0.
*/
document.querySelector("#user").addEventListener("invalid", function(){
	//checking for length of username
	if(String(this.value).length==0){
		//setting validation message to 'Missing username...'
		this.setCustomValidity("Missing username...");
	}
	else{
		//setting validation message to '' (which marks the field as valid)
		this.setCustomValidity("");
	}
});


/*
The following event listener is binded to a "required" field, and it changes the message
it displays when the "Password" field is empty. It removes the message and therefore validates
the field when length is greater than 0.
*/
document.querySelector("#pass").addEventListener("invalid", function(e){
	//checking for length of password
	if(String(this.value).length==0){
		//setting validation message to 'Missing password...'
		this.setCustomValidity("Missing password...");
	}
	else{
		//setting validation message to '' (which marks the field as valid)
		this.setCustomValidity("");
	}
});


/*
The following function is called by the event handler of the "click submit" action, when the user clicks
on the "Login" button, to attempt a login. This function retrieves the username and password, and calls the function
makeAjaxCall(username, password).
*/
function userLogin(){
	var user_name = document.getElementById('user');
	var password = document.getElementById('pass');
	var role = document.getElementById('professor').checked? "professor" : "student";
	
	console.log("role: "+role)
	makeAjaxCall(user_name.value, password.value, role);
}


/*
The following function is called by userLogin(), and it recieves the username and password entered on the login form.
It firsts creates a formatted string to make an ajax call to the back of the front (login.php). After the ajax call 
is completed, loginAjaxHandler(message) is called to hanlde the response recieved.
*/
function makeAjaxCall(user_name, password, role){
	
	//building string to send through an ajax call to the back of the front (login.php) in the format required for 'x-www-form-urlencoded'
	var data = 'json_string={"action":"login","username":"'+user_name+'","plaintext_password":"'+password+'","role":"'+role+'"}'

	//creating an ajax request object.
	var request = new XMLHttpRequest();
	//opening request of type 'POST' to endpoint 'login.php' (back of the front)
	request.open('POST', '../../controllers/login/login_front.php', true);
	//setting up the content type in the header to 'x-wwww-form-urlencoded'
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	//making ajax request.
	request.send(data);

	//ajax request was successful
	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			var resp = request.responseText;

			console.log(resp)
			//calling login ajax handler function
			loginAjaxHandler(resp)
		} else {
			var resp = request.responseText;
			console.log("Something major happened!")
			console.log(JSON.stringify(resp))
			//calling login ajax handler function
			loginAjaxHandler(error)
		}
	};

	//ajax request failed
	request.onerror = function() {
		console.log("Something went wrong")
	};

	
}



function loginAjaxHandler(response){
	var parsed_resposne = JSON.parse(response)
	if(parsed_resposne['status']=="error"){
		var user_message = parsed_resposne['user_message']
		var internal_message = 	parsed_resposne['internal_message']
		
		console.log("Internal Error: "+internal_message)
		var error_mark = '<div style="font-size: 300%; width: 50px; float: left; margin-top:10px">&#xd7;&nbsp;</div>'
		var message = error_mark+'<div style="font-size: 80%; width: 250px; float: left;">'+user_message+'</div>'

		flash(message, "#F45F63")
	}
	else{
		window.localStorage.setItem('user_id', parsed_resposne['items'][0].user_name);
		window.localStorage.setItem('role', parsed_resposne['role'])
		if(parsed_resposne['role']=="student"){
			console.log("Student")
			//window.location.replace("../main/student_main.html");
		}
		else{
			console.log("Professor")
			window.location.replace("../main/professor_main.html");
		}
	}
}




/*
The following function is called by makeAjaxCall(), and it recieves the response from the login ajax call. This function first
parses the response, looking for three key values: 'error', 'njitLoginSuccess', 'dbLoginSuccess'. If the 'error' key is found, 
an error is displayed as a flash message and printed to console. If no error is found, 'njitLoginSuccess' and 'dbLoginSuccess'
are parsed, and based on their truth values, one of three messages are diplayed as a flash notification. The messages cover 
the following cases: successful access to our dabatase, successfull access to njit website or uncessful access.
*/
function loginAjaxHandlerAlpha(response){
	
	var message = ""
	//parsing string response to a json object.
	var parsed_resposne = JSON.parse(response)
	
	if ('error' in parsed_resposne){
		//if error is found in json, an error message will be created
		message = parsed_resposne['error']
		console.log(parsed_resposne)
	}
	else{
		//if no errors is found, njitLoginSuccess and dbLoginSuccess are parsed from response.
		var njit_response = parsed_resposne['njitLoginSuccess'];
		var db_response = parsed_resposne['dbLoginSuccess'];

		//creating message based on wether the user was found on our system, njit website or not found
		var color = "#01BC9F"
		var check_mark = '<div style="font-size: 200%; width: 50px; float: left;">&#x2713;&nbsp;</div>'
		var error_mark = '<div style="font-size: 300%; width: 50px; float: left; margin-top:10px">&#xd7;&nbsp;</div>'
		if (njit_response)
			message = check_mark+'<div style="font-size: 80%; width: 250px; float: left;">Welcome to your NJIT account!</div>'
		else if(db_response)
			message = check_mark+'<div style="font-size: 80%; width: 250px; float: left;">Welcome to our system!</div>'
		else{
			message = error_mark+'<div style="font-size: 80%; width: 250px; float: left;">Invalid Username/Password combination. Please try again.</div>'
			color = "#F45F63"
		}
		console.log("NJIT Response: "+njit_response)
		console.log("DB Response: "+db_response)
	}
	//displaying a flash message to the user.
	flash(message, color);
	
}


/*
The following function is called by loginAjaxHandler(). It creates, formats and displays a flash message on the login page. It recieves the message, 
and the background color of the message (red, green).
*/
function flash(message, color) {
    //getting login elements
    var login_body = document.getElementById("login")
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
    new_flash.style.top = "60px"
	new_flash.style.zIndex =  '1';
	new_flash.style.textAlign = "left"
	new_flash.style.margin  = "auto"
	new_flash.style.color = "#fff"
	new_flash.style.fontSize = "19px"
	new_flash.style.width = "324px"
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





















