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


function remove(array, element) {
    const index = array.indexOf(element);
    array.splice(index, 1);
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
