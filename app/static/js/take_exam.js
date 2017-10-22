
var question_count = 0

window.onload=function(){
	loadGeneral();
	var exam_to_take = 	window.localStorage.getItem('exam_to_take');
	var fields = {"test_id":exam_to_take}
	
	console.log("Exam to take: "+exam_to_take)
	var student_key = window.localStorage.getItem('user_key')
	
	ajaxCallExamQuestions("list", JSON.stringify(fields), "", "", "");
	var exam_name = window.localStorage.getItem('exam_name')

	document.getElementById('exam_name').innerHTML = exam_name
	
}; 


function listQuestionsExam(response){
	var questionIds = response['items']

	for(var i=0; i<questionIds.length; i++){
		//console.log(questionIds[i].question_id)
		ajaxCallExamQuestionsFinal("list", JSON.stringify({"primary_key":questionIds[i].question_id}), "", "", "")
	}
}


function createQuestionNode(response){
	question_count = question_count + 1
	var question = response['items'][0]
	//console.log(question)

	var exam_node = document.getElementById("question_list")
	var new_div = document.createElement("div")
	new_div.id = "question_wrapper_"+question['primary_key']
	new_div.innerHTML = '<div id="questions"><div id="create-question"><form><div class="question-block"><div class="left-block"><label>Question: </label></div><div class="right-block other" style="margin-bottom: 25px;"><label style="color:#5bc0de;" id="question_name_"'+question['primary_key']+'>'+question['question_text']+'</label></div></div><div class="question-block"><div class="left-block"><label >Function Name: </label></div><div class="right-block other" style="margin-bottom: 25px;"><label style="color:#5bc0de;" id="func_name_"'+question['primary_key']+'>'+question['func_name']+'</label></div></div><div class="question-block"><div class="left-block"><label>Function Params: </label></div><div class="right-block other" style="margin-bottom: 25px;"><label style="color:#5bc0de;" id="param_names_"'+question['primary_key']+'>'+question['param_names']+'</label></div></div><div class="question-block"><div class="left-block"><label>Answer: </label></div><div class="right-block other"><textarea id="student_answer_'+question['primary_key']+'" rows="15" style="width: 100%; font-size: 16px;"></textarea></div></div><br><div style="height: 380px"></div></form></div></div><br>'
	exam_node.appendChild(new_div)

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


/*
The following function makes an ajax call to the questions resources to grab the list of questions
*/
function ajaxCallExamQuestions(action, fields, primary_key, order, order_by){
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
	request.open('POST', '../../controllers/test_question/test_question_front.php', true);
	//setting up the content type in the header to 'x-wwww-form-urlencoded'
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	//making ajax request.
	request.send(data);

	//ajax request was successful
	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			var resp = JSON.parse(request.responseText);
			//console.log(resp['status'])
			if(resp['status']=="success")
				listQuestionsExam(resp)
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



function ajaxCallExamQuestionsFinal(action, fields, primary_key, order, order_by){
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
	request.open('POST', '../../controllers/question/question_front.php', true);
	//setting up the content type in the header to 'x-wwww-form-urlencoded'
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	//making ajax request.
	request.send(data);

	//ajax request was successful
	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			var resp = JSON.parse(request.responseText);
			//console.log(resp['status'])
			if(resp['status']=="success")
				createQuestionNode(resp)
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