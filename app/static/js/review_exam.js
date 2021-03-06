var question_count = 0
var question_ids_ultra = []

window.onload=function(){
	loadGeneral();
	var exam_to_review = JSON.parse(window.localStorage.getItem('test_under_review'));
	var student_key = window.localStorage.getItem('user_key')
	
	var fields = {"test_id":exam_to_review.test_id, "student_id":student_key}
	
	var score = Number(exam_to_review.test_score)
	var color = "#F45F63"

	if(score <  70)
		color = "#F45F63"
	if(score >= 70 && score < 90)
		color = "#428bca"
	if(score >= 90)
		color = "#01BC9F"

	document.getElementById('your_final_score').innerHTML = 'Your final score: <strong style="color:'+color+'">&nbsp;'+score+'%</strong>'

	ajaxCallGetQuestionAnswers("list", JSON.stringify(fields), "", "", "");
	document.getElementById('exam_name').innerHTML = exam_to_review.test_name
	
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



function listExamsToTake(response){
	
	var questions = response['items']
	//console.log(question)

	var exam_node = document.getElementById("question_list")
	
	for(var i=0; i<questions.length;i++){
		var height = 650;
		var question = questions[i]
		var new_div = document.createElement("div")
		new_div.id = "questions"
		var notes = JSON.parse(question['notes'])['comments']
		
		var parametersMatch = JSON.parse(question['notes'])['doParametersMatch']
		var functionNameMatches = JSON.parse(question['notes'])['doesFunctionNameMatch']

		var parameterMessage = "Function parameter name(s) do not match requirements. 1 point deducted."
		var functionNameMessage = "Function name does not match requirements. 1 point deducted."

		if(String(parametersMatch)=="true")
			parameterMessage = "Function parameter name(s) match requirements."

		if(String(functionNameMatches)=="true")
			functionNameMessage = "Function name matches requirements."

		var functionNameParameters = [
			{
				"message":parameterMessage,
				"match":String(parametersMatch)
			},
			{
				"message":functionNameMessage,
				"match":String(functionNameMatches)
			}
		]

		var question_cases = JSON.parse(question['notes'])['testCaseResults']
		console.log(question_cases)
		var testCaseTable = `<table style="width:100%;">
					<col width="50%">
					<col width="30%">
					<col width="15%">
					<col width="5%">
					<tr>
						<th>Expected</th>
						<th>Run</th>
						<th>Points Earned</th>
						<th>Check</th>
					</tr>`

		
		for(var row=0; row < question_cases.length; row++){
			var actualRow = '<tr><td>'+question_cases[row]['expected']+'</td>'
			actualRow+='<td>'+question_cases[row]['actual']+'</td>'
			actualRow+='<td class="text-center">'+question_cases[row]['pointsEarned']+'</td>'
			var color="#F45F63"
			var error="&#xd7;"
			if(String(question_cases[row]['didItPass'])==1){
				color="#01BC9F"
				error="&#x2713;"
			}
			actualRow+='<td class="text-center" bgcolor='+color+'>'+error+'</td>'
			testCaseTable+=actualRow
		}

		for(var row=0; row < functionNameParameters.length; row++){
			var actualRow = '<tr ><td colspan="3">'+functionNameParameters[row]['message']+'</td>'
			var color="#F45F63"
			var error="&#xd7;"
			if(String(functionNameParameters[row]['match'])=="true"){
				color="#01BC9F"
				error="&#x2713;"
			}
			actualRow+='<td class="text-center" bgcolor='+color+'>'+error+'</td>'
			testCaseTable+=actualRow
		}

		testCaseTable+="</table>"
		/*
		var comments = '<ul style="text-align:left!important;">'
		
		for(var j=0; j<notes.length;j++){
			comments += '<p style="width:100%"><li style="text-align:left!important;">'+notes[j]+'</li></p>'
			
		}*/
		//comments += "</ul>"
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
											<label style="color:#5bc0de;">`+question['grade']+" / "+question['point_value']+`</label>
										</div>
									</div>
									<div class="question-block">
										<div class="left-block">
											<label>System Comments: </label>
										</div>
										<div class="right-block other" style="margin-bottom: 25px;">
											`+testCaseTable+`
										</div>
									</div>
									<div class="question-block">
										<div class="left-block"><label>Professor Comments: </label>
										</div>
										<div class="right-block other" style="margin-bottom: 25px;">
											<textarea rows="10" style="width: 100%; font-size: 16px;" readonly>`+question['professor_notes']+`</textarea>
										</div>
									</div>
									<div class="question-block">
										<div class="left-block">
											<label>Answer: </label>
										</div>
									<div class="right-block other">
										<textarea rows="15" style="width: 100%; font-size: 16px;" readonly>`+question['answer_text']+`
										</textarea>
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


/*
The following function makes an ajax call to the questions resources to grab the list of questions
*/
function ajaxCallGetQuestionAnswers(action, fields, primary_key, order, order_by){
	//building string to send through an ajax call to the back of the front (question_middle.php) in the format required for 'x-www-form-urlencoded'
	fields = escapeThemAll(fields)
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
	request.open('POST', '../../controllers/question_answer/question_answer_front.php', true);
	//setting up the content type in the header to 'x-wwww-form-urlencoded'
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	//making ajax request.
	request.send(data);

	//ajax request was successful
	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			console.log(request.responseText)
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
