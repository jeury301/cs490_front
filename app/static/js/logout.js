function logOut(){
	console.log("Logging Out");
	window.localStorage.removeItem('user_id');
	window.localStorage.removeItem('role')
	window.location.replace("../login/login.html");
}

window.onload=function(){
	console.log("Hello world")
	var user_id = window.localStorage.getItem('user_id');
	if(user_id == null)
		window.location.replace("../login/login.html");
	document.getElementById("professor_id").innerHTML = user_id
	console.log(user_id)
	var role = window.localStorage.getItem('role');
	document.getElementById("app_title").innerHTML = "Moodle Replacement - "+jsUcfirst(role)
	console.log(role)
}; 


function jsUcfirst(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function goTo(page){
	window.location.replace(page);
}