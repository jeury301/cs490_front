/*
Author: Jeury Mejia
This function attempts a login by making an ajax call to local php script
*/

document.querySelector("#form_login").addEventListener("submit", function(e){
	e.preventDefault(); 
	userLogin() 
});

document.querySelector("#user").addEventListener("invalid", function(){
	if(String(this.value).length==0)
		this.setCustomValidity("Missing username...");
	else{
		this.setCustomValidity("");
	}
});

document.querySelector("#pass").addEventListener("invalid", function(e){
	if(String(this.value).length==0)
		this.setCustomValidity("Missing password...");
	else{
		this.setCustomValidity("");
	}
});


function userLogin(){
	var user_name = document.getElementById('user');
	var password = document.getElementById('pass');

	makeAjaxCall(user_name.value, password.value);
}

/*
This function makes an ejax call to local php script
*/
function makeAjaxCall(user_name, password){
	
	var data = 'json_string={"username":"'+user_name+'","plaintext_password":"'+password+'"}'

	//setting up ajax request
	var request = new XMLHttpRequest();
	request.open('POST', '../../controllers/login/login.php', true);
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

	//ajax request successful
	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			var resp = request.responseText;
			loginAjaxHandler(resp)
		} else {
			var error = {"error":"Something Failed"}
			loginAjaxHandler(error)
		}
	};

	//ajax request failed
	request.onerror = function() {
		console.log("Something went wrong")
	};

	request.send(data);

}

function loginAjaxHandler(response){
	var message = ""
	var parsed_resposne = JSON.parse(response)
	if ('error' in parsed_resposne){
		message = parsed_resposne['error']
		console.log(parsed_resposne)
	}
	else{
		var njit_response = parsed_resposne['njitLoginSuccess'];
		var db_response = parsed_resposne['dbLoginSuccess'];
		var color = "#01BC9F"
		var check_mark = '<div style="font-size: 200%; width: 50px; float: left;">&#x2713;&nbsp;</div>'
		var error_mark = '<div style="font-size: 300%; width: 50px; float: left; margin-top:10px">&#xd7;&nbsp;</div>'
		if (njit_response)
			message = check_mark+'<div style="font-size: 80%; width: 250px; float: left;">Welcome to your NJIT account!</div>'
		else if(db_response)
			message = check_mark+'<div style="font-size: 80%; width: 250px; float: left;">Welcome to our system!</div>'
		else{
			message = error_mark+'<div style="font-size: 80%; width: 250px; float: left;">User and password not found, please try again.</div>'
			color = "#F45F63"
		}
		console.log("NJIT Response: "+njit_response)
		console.log("DB Response: "+db_response)
	}
	flash(message, color);
	
}

function flash(message, color) {
    var login_body = document.getElementById("login")
    var flash = document.getElementById("flash")
    
    if(flash){
    	login_body.removeChild(flash);
    }
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
    login_body.prepend(new_flash)
    
    setTimeout(function(){
    	fade(new_flash);
    }, 4000);
      
}


function fade(element) {
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





























