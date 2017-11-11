window.onload=function(){
	loadGeneral();
	var exam_to_review = window.localStorage.getItem('exam_to_review')
	var exam_name = window.localStorage.getItem('test_name')
	var student_score = window.localStorage.getItem('student_grade')
	var student_key = window.localStorage.getItem('student_id_under_review')
	
	var fields = {"test_id":exam_to_review, "student_id":student_key}
	
	var score = Number(student_score)
	var color = "#d9534f"

	if(score <  70)
		color = "#d9534f"
	if(score >= 70 && score < 90)
		color = "#428bca"
	if(score >= 90)
		color = "#5cb85c"

	document.getElementById('your_final_score').innerHTML = 'Student final score: <strong style="color:'+color+'">&nbsp;'+score+'%</strong>'

	ajaxCallGetQuestionAnswers("list", JSON.stringify(fields), "", "", "");
	document.getElementById('exam_name').innerHTML = "Exam Name: "+exam_name
	console.log("Exam name: "+exam_name)
	
	if(scrollBars()){
		document.getElementById("footer").style.position = "relative";
		document.getElementById("dropdown").style.position = "relative";
	}
	else{
		document.getElementById("footer").style.position = "fixed";
		document.getElementById("dropdown").style.position = "fixed";
		//console.log("fixed")
	}
}; 


var global_questions = []
var questions_length = 0

function listExamsToTake(response){
	
	var questions = response['items']
	//console.log(question)

	questions_length = questions.length


	var exam_node = document.getElementById("question_list")
	
	for(var i=0; i<questions.length;i++){
		var height = 750;
		var question = questions[i]
		global_questions.push(question)
		var new_div = document.createElement("div")
		new_div.id = "questions"
		var notes = JSON.parse(question['notes'])['comments']
		var comments = '<ul style="text-align:left!important;">'
		for(var j=0; j<notes.length;j++){
			comments += '<p style="width:100%"><li style="text-align:left!important;">'+notes[j]+'</li></p>'
			
		}
		comments += "</ul>"
		height += notes.length * 50
		new_div.innerHTML = `<div id="create-question">
								<form>
									<div class="question-block">
										<div class="left-block">
											<label>Question: </label>
										</div>
										<div class="right-block other" style="margin-bottom: 25px;">
											<label style="color:#5bc0de;">`+question['question_text']+`</label>
										</div>
									</div>
									<div class="question-block">
										<div class="left-block">
											<label>Grade: </label>
										</div>
										<div class="right-block other" style="margin-bottom: 25px;">
											<div class="left-block" style="width: 30%">
												<div class="left-block" style="width: 35%">
												<input  type="number"  min="0" max="`+question['point_value']+`" style="width: 100%" id="question_value_`+question['primary_key']+`" value="`+question['grade']+`">
												</div>
												<div class="right-block" style="width: 50%">
													<label style="color:#5bc0de;">/ `+question['point_value']+`</label>
												</div>
											</div>
											
										</div>
									</div>

									<div class="question-block">
										<div class="left-block">
											<label>System Comments: </label>
										</div>
										<div class="right-block other" style="margin-bottom: 25px;">
											<label style="color:#5bc0de;">`+comments+`</label>
										</div>
									</div>
									<div class="question-block">
										<div class="left-block"><label>Professor Comments: </label>
										</div>
										<div class="right-block other" style="margin-bottom: 25px;">
											<textarea rows="10" style="width: 100%; font-size: 16px;" placeholder="Use this space to provide additional feedback to student..." id="professor_notes_`+question['primary_key']+`">`+question['professor_notes']+`</textarea>
										</div>
									</div>
									<div class="question-block">
										<div class="left-block"><label>Answer: </label>
										</div>
										<div class="right-block other">
											<textarea rows="15" style="width: 100%; font-size: 16px;" readonly>`+question['answer_text']+`</textarea>
										</div>
									</div>
									<br>
									<div style="height: `+height+`px">
									</div>
								</form>
							</div>`
		exam_node.appendChild(new_div)

		var new_br = document.createElement("br")
		exam_node.appendChild(new_br)
	}

	
	if(scrollBars()){
		document.getElementById("footer").style.position = "relative";
		document.getElementById("dropdown").style.position = "relative";
	}
	else{
		document.getElementById("footer").style.position = "fixed";
		document.getElementById("dropdown").style.position = "fixed";
		//console.log("fixed")
	}

}


function updateExam(){
	var testId = window.localStorage.getItem('exam_to_review');
	var student_key = window.localStorage.getItem('student_id_under_review')
	
	//console.log(global_questions)
	
	for(var i=0; i<global_questions.length;i++){
		var question_answer_id = global_questions[i]['primary_key'] 
		console.log(question_answer_id)
		
		var new_grade = document.getElementById("question_value_"+question_answer_id).value
		var professor_notes = document.getElementById("professor_notes_"+question_answer_id).value

		var fields = {
			"professor_notes":professor_notes,
			"grade":Number(new_grade)
		}
		console.log("Fields for question: "+question_answer_id+" .Fields: "+JSON.stringify(fields))
		
		updateQuestionAnswer("edit", JSON.stringify(fields), question_answer_id, "", "")

	}
}



/*
The following function makes an ajax call to the questions resources to grab the list of questions
*/
function updateQuestionAnswer(action, fields, primary_key, order, order_by){
	//building string to send through an ajax call to the back of the front (question_middle.php) in the format required for 'x-www-form-urlencoded'
	fields = fields.replaceAll("+", "%2B")
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

	//data.replaceAll("+", "%2B")
	console.log("Replacement completed")
	console.log(data)
	//creating an ajax request object.
	
	var request = new XMLHttpRequest();
	//opening request of type 'POST' to endpoint 'login.php' (back of the front)
	request.open('POST', '../../controllers/question_answer/question_answer_front.php', true);
	//setting up the content type in the header to 'x-wwww-form-urlencoded'
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	//making ajax request.
	request.send(data);

	//ajax request was successful
	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			console.log("Response from Middle: "+request.responseText)
			var resp = JSON.parse(request.responseText);
			if(resp['status']=="success"){
				questionAnswerUpdated(resp)
				console.log("STOP")
			}
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

function questionAnswerUpdated(response){
	console.log(JSON.stringify(response))
	questions_length = questions_length -1
	console.log(questions_length)
	if(questions_length == 0){

		var exam_to_review = window.localStorage.getItem('test_score')

		var fields = {

		}
		console.log("Test score to update: "+exam_to_review)
		ajaxUpdateTestScore("edit", JSON.stringify(fields), exam_to_review, "", "")

	}
}



/*
The following function makes an ajax call to the questions resources to grab the list of questions
*/
function ajaxUpdateTestScore(action, fields, primary_key, order, order_by){
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
			console.log(request.responseText)
			var resp = JSON.parse(request.responseText);
			if(resp['status']=="success"){
				window.localStorage.setItem("exam_just_reviewed", "yes")
				goTo('review_exams.html')
			}
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
The following function makes an ajax call to the questions resources to grab the list of questions
*/
function ajaxCallGetQuestionAnswers(action, fields, primary_key, order, order_by){
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

	//console.log(data)
	//creating an ajax request object.
	
	var request = new XMLHttpRequest();
	//opening request of type 'POST' to endpoint 'login.php' (back of the front)
	request.open('POST', '../../controllers/question_answer/question_answer_front.php', true);
	//setting up the content type in the header to 'x-wwww-form-urlencoded'
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	//making ajax request.
	request.send(data);

	//ajax request was successful
	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			//console.log(request.responseText)
			var resp = JSON.parse(request.responseText);
			console.log(resp['status'])
			if(resp['status']=="success")
				listExamsToTake(resp)
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


String.prototype.replaceAll = function(str1, str2, ignore) 
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
} 