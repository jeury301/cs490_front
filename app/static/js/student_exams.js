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
var items = response['items']

	console.log(items.length)
	var table = document.getElementById("released_exams");

	for (item in items){
		//console.log("ITEM: "+JSON.stringify(items[item]))
		var tr = document.createElement("tr");
		
		var exam_name_td = document.createElement("td");
		exam_name_td.id = "test_name_"+items[item]['primary_key']
		var exam_name = document.createTextNode(items[item]['test_name']);
		exam_name_td.appendChild(exam_name);

		var exam_grade_td = document.createElement("td");
		exam_grade_td.id = "test_exam_"+items[item]['primary_key']
		var exam_grade = document.createTextNode(items[item]['grade']);
		exam_grade_td.appendChild(exam_grade);
		exam_grade_td.style.textAlign = "center"

		var view_td = document.createElement("td");
		view_td.innerHTML = '<div class="edit text-center"><input class="clean success" type="button" value="View Results" onClick="viewResults('+items[item]['primary_key']+', '+items[item]['test_id']+')"></div>'
		//var delete_td = document.createElement("td");
		//delete_td.innerHTML = '<div class="text-center delete"><input class="clean" type="button" value="Delete" onClick="deleteExam('+items[item]['primary_key']+')" id="exam_to_delete_'+items[item]['primary_key']+'"></div>'

		tr.appendChild(exam_name_td);
		tr.appendChild(exam_grade_td);
		tr.appendChild(view_td);
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



function viewResults(primary_key, test_id){
	var test_name = document.getElementById('test_name_'+primary_key).textContent
	var test_exam = document.getElementById('test_exam_'+primary_key).textContent
	window.localStorage.setItem('test_under_review', JSON.stringify({'test_name':test_name, 'test_id':test_id, 'test_score':test_exam}))
	console.log("TEST ID: "+primary_key)	
	console.log("TEST NAME: "+test_name)
	goTo('review_exam.html')
}














