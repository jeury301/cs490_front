/*
**Author: Jeury Mejia
**Last Updated: 10/15/2017
**Purpose: This file contains the functions to access the question resources from the middle.
*/

window.onload=function(){
	var student_id = window.localStorage.getItem('user_key')
	var fields = {
		"student_id":student_id,
		"scores_released":1
	}
	loadGeneral();
	ajaxCallStudentExams("list", JSON.stringify(fields), "", "", "");

}; 



function studentExamsList(response){
	console.log("STUDENT EXAMS: "+JSON.stringify(response))
}



/*
The following function makes an ajax call to the questions resources to grab the list of questions
*/
function ajaxCallStudentExams(action, fields, primary_key, order, order_by){
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
	request.open('POST', '../../controllers/test_score/test_score_front.php', true);
	//setting up the content type in the header to 'x-wwww-form-urlencoded'
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	//making ajax request.
	request.send(data);

	//ajax request was successful
	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			//console.log(request.responseText)
			var resp = JSON.parse(request.responseText);
			//console.log(resp['status'])
			if(resp['status']=="success")
				studentExamsList(resp)
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