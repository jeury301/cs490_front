window.onload=function(){
	var exam_to_review = window.localStorage.getItem('exam_to_review')
	console.log("exam_to_review: "+exam_to_review)
	
	var test_name = window.localStorage.getItem('test_name')
	console.log("test_name: "+test_name)

	document.getElementById('exam_name').innerHTML = "Exam Name: "+test_name

	var exam_just_reviewed = window.localStorage.getItem("exam_just_reviewed")

	if(exam_just_reviewed=="yes"){
		flash("Exam successfully updated!", "#01BC9F")
		window.localStorage.removeItem("exam_just_reviewed")
	
	}

	var fields = {
		"test_id":exam_to_review
	}
	loadGeneral();
	ajaxCallTestScores("list", JSON.stringify(fields), "", "", "");


}; 

var test_scores = {}

function testScoresList(response){
	var items = response['items']

	//console.log(items.length)
	var table = document.getElementById("student_exams_table");

	for (item in items){
		//console.log("ITEM: "+JSON.stringify(items[item]))
		var tr = document.createElement("tr");
		test_scores[items[item]['student_id']] = items[item]['primary_key']
		var student_id_td = document.createElement("td");
		var student_id = document.createTextNode(items[item]['student_id']);
		student_id_td.appendChild(student_id);

		var student_name_td = document.createElement("td");
		student_name_td.id = "student_name_id_"+items[item]['student_id']
		var student_name = document.createTextNode(items[item]['student_name']);
		student_name_td.appendChild(student_name);

		var grade_td = document.createElement("td");
		grade_td.id = "student_grade_"+items[item]['student_id']
		var grade = document.createTextNode(items[item]['grade']);
		grade_td.appendChild(grade);

		var raw_score_td = document.createElement("td");
		var raw_score = document.createTextNode(items[item]['raw_points']+" / "+items[item]['max_points']);
		raw_score_td.appendChild(raw_score);

		//var edit_td = document.createElement("td");
		//edit_td.innerHTML = '<div class="edit text-center"><input class="clean success" type="button" value="Edit" onClick="edit('+items[item]['primary_key']+')"></div>'
		var review_td = document.createElement("td");
		review_td.innerHTML = '<div class="text-center edit"><input class="clean" type="button" value="Review" onClick="reviewExam('+items[item]['student_id']+')" id="exam_to_review_'+items[item]['student_id']+'"></div>'

		tr.appendChild(student_id_td);
		tr.appendChild(student_name_td);
		tr.appendChild(grade_td);
		tr.appendChild(raw_score_td);
		tr.appendChild(review_td);
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


function reviewExam(student_id){

	var grade = document.getElementById('student_grade_'+student_id).textContent

	var test_score = test_scores[student_id]

	window.localStorage.setItem("student_id_under_review", student_id)
	window.localStorage.setItem("student_grade", grade)
	window.localStorage.setItem("test_score", test_score)

	console.log("Test score: "+test_score)

	console.log(student_id)
	goTo('professor_review_exam.html')
}


function releaseScores(){
	var test_id = window.localStorage.getItem('exam_to_review')
	var test_name = window.localStorage.getItem('test_name')
	var test = {'primary_key':test_id, 'test_name':test_name}
	window.localStorage.setItem('test_to_release', JSON.stringify(test))
	goTo('../exams/release_score.html')
}


/*
The following function makes an ajax call to the questions resources to grab the list of questions
*/
function ajaxCallTestScores(action, fields, primary_key, order, order_by){
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
				testScoresList(resp)
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