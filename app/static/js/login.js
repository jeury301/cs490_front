/*
This function attempts a login by making an ajax call to local php script
*/
function attemptLogin(){
	//resetting the form
	resetForm();

	var user_name = document.getElementById('user_name');
	var password = document.getElementById('password');

	//validating fields
	if (user_name.value == ""){
		user_name.style.borderColor = "red";
		document.getElementById("alert_user_name").innerHTML='<div style="color: organge;"><p>Missing User Name</p></div>'
	}
	else{
		user_name.style.borderColor = "green";
	}
	if (password.value == ""){
		password.style.borderColor = "red";
		document.getElementById("alert_password").innerHTML= '<div style="color: organge;"><p>Missing Password</p></div>'
	}
	else{
		password.style.borderColor = "green";
	}

	makeAjaxCall(user_name.value, password.value);

}
/*
This function resets the form to its normal state
*/
function resetForm(){
	document.getElementById('user_name').style.borderColor = '';
	document.getElementById('password').style.borderColor = '';
	document.getElementById("alert_user_name").innerHTML = '';
	document.getElementById("alert_password").innerHTML = '';
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
		    console.log("Response: "+resp);
		} else {
			console.log("Something failed")
		}
	};

	//ajax request failed
	request.onerror = function() {
	    console.log("Something went wrong")
	};

	request.send(data);

}


