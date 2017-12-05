
window.onload=function(){
	console.log("Hello world")
	//var fields = {"primary_key":5}
	var fields = {}
	loadGeneral();
	var is_create = window.localStorage.getItem('is_create')
	if(is_create)
		ajaxCallQuestion("list", JSON.stringify(fields), "", "", "");


	var exam = window.localStorage.getItem("exam_to_delete")
	console.log("Exam to delete: "+exam)
	if(exam){
		var exam = JSON.parse(exam)['test_name'];
		document.getElementById("exam_to_remove").innerHTML = "E: "+exam
	}

}; 

var question_count = 0;
var questions_added = [];
var questions_map = {}
//Loading question bank
function questionList(response){
	var items = response['items']

	console.log(items.length)
	var table = document.getElementById("question_table");

	for (item in items){
		//console.log("ITEM: "+JSON.stringify(items[item]))
		var tr = document.createElement("tr");
		questions_map[items[item]['primary_key']] = items[item]
		//var question_id_td = document.createElement("td");
		//var question_id = document.createTextNode(items[item]['primary_key']);
		//question_id_td.appendChild(question_id);

		var difficulty_td = document.createElement("td");
		var difficulty = document.createTextNode(items[item]['difficulty']);
		difficulty_td.appendChild(difficulty);

		var topic_td = document.createElement("td");
		var topic = document.createTextNode(items[item]['topic']);
		topic_td.appendChild(topic);

		var question_name_td = document.createElement("td");
		question_name_td.id = "question_text_"+items[item]['primary_key']
		var question_name = document.createTextNode(items[item]['question_text']);
		
		question_name_td.appendChild(question_name);

		//var edit_td = document.createElement("td");
		//edit_td.innerHTML = '<div class="edit text-center"><input class="clean success" type="button" value="Edit" onClick="edit('+items[item]['primary_key']+')"></div>'
		var add_td = document.createElement("td");
		add_td.innerHTML = '<div class="text-center" ><input class="max-submit-button clean" type="button" value="Add" onClick="addQuestion('+items[item]['primary_key']+')" id="question_to_add_'+items[item]['primary_key']+'"></div>'

		tr.appendChild(difficulty_td);
		tr.appendChild(topic_td);

		tr.appendChild(question_name_td);
		//tr.appendChild(edit_td);
		tr.appendChild(add_td);

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


function fullyDeleteExam(){
	var question = window.localStorage.getItem("exam_to_delete")
	var primary_key =  JSON.parse(question)['primary_key'];
	console.log(primary_key)

	ajaxCallToDelete("delete", primary_key)


}



function ajaxCallToDelete(action, primary_key){
	//building string to send through an ajax call to the back of the front (question_middle.php) in the format required for 'x-www-form-urlencoded'
	var data = 'json_string={"action":"'+action+'", "primary_key":"'+primary_key+'", "fields":{}}'
	console.log(data)
	var request = new XMLHttpRequest();
	//opening request of type 'POST' to endpoint 'login.php' (back of the front)
	request.open('POST', '../../controllers/test/test_front.php', true);
	//setting up the content type in the header to 'x-wwww-form-urlencoded'
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	//making ajax request.
	request.send(data);

	//ajax request was successful
	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			try {
				console.log(request.responseText)
				var resp = JSON.parse(request.responseText);
				//console.log(resp['status'])
				if(resp['status']=="success"){
					window.localStorage.removeItem("exam_to_delete")
					goTo('professor_exams.html')
				}
				else{
					console.log("Internal error: "+request.responseText)
					flash(request.responseText, "#F45F63")
					enableScroll();
					loader.classList.remove("loader");

			}
			//console.log(JSON.stringify(response))
			//console.log(resp)
			} catch (e) {
				flash(request.responseText, "#F45F63")
				enableScroll();
				loader.classList.remove("loader");

			}

	} else {
		var resp = request.responseText;
		console.log("Something major happened!")
		flash(resp, "#F45F63")
		enableScroll();
		loader.classList.remove("loader");

		//console.log(JSON.stringify(resp))

	}
};

	//ajax request failed
	request.onerror = function() {
		console.log("Something went wrong")
		flash("Something went wrong", "#F45F63")
		enableScroll();
	};
	
}





function submitExam(event){
	event.preventDefault();

	var loader = document.getElementById("loader");
	loader.classList.add("loader");
	disableScroll();

	if(question_count == 0){
		loader.classList.remove("loader");
		flash("No questions have been added!", "#F45F63")
		enableScroll();
	}
	else{
		var professor_id = window.localStorage.getItem('user_key')
		var test_name = document.getElementById("test_name").value;
		//var start_date = document.getElementById("start_date").value;
		//var end_date = document.getElementById("end_date").value;

		var fields = {
			"professor_id":professor_id,
			"test_name":test_name,
			"finalized":1,
			"scores_released":0
		}	

		ajaxCallCreateTest("insert", JSON.stringify(fields), "", "", "")
		
	}

}



function addQuestionsToTest(response){
	//console.log("NEW EXAM HAS BEEN CREATED: "+JSON.stringify(response))
	var test_id = response['items'][0]['primary_key']

	for(var i=0; i < questions_added.length; i++){
		var fields = {
			"test_id":test_id,
			"question_id":questions_added[i],
			"point_value":document.getElementById("point_value_"+questions_added[i]).value
		}
		console.log(JSON.stringify(fields))
		ajaxCallCreateTestQuestion("insert", JSON.stringify(fields), "", "", "")
	}

}



function testQuestionCreated(response){
	question_count = question_count - 1
	console.log(question_count)

	if(question_count == 0)
		goTo('professor_exams.html')
}




function addQuestion(question_id){
	var question = questions_map[question_id]
	console.log(JSON.stringify(question))
	
	var default_point_value = question['default_point_value']
	var question_text = document.getElementById("question_text_"+question_id).innerText
	document.getElementById("question_to_add_"+question_id).disabled = true;
	var question_len = (question_text.length)*.6
	var question_block = document.getElementById("question-block")
	var new_div = document.createElement("div")
	new_div.classList.add("question-block")
	new_div.id = "question_id_"+question_id
	question_count = question_count + 1
	new_div.innerHTML = `<div class="left-block" style="width: 15%"> <label><input onClick="deleteQuestion(`+question_id+`)" class="delete-question" type="button" value="Delete" style="height: 30px; width: 100%"></label></div>
						 <div class="left-block" style="width: 53%;"> <label style="color:#5bc0de;" id="label_id_`+question_id+`">Q`+question_count+`: `+question_text+`</label></div>
						 <div class="left-block" style="width: 2%"></div>
						 <div class="left-block" style="width: 18%;" ><label id="point_value_id_`+question_id+`">Point Value:</label></div>
						 <div class="left-block" style="width: 1%"></div>
						 <div class="right-block other" style="width:11%;margin-bottom: `+question_len+`px;"> <input class="clean" type="text" id="point_value_`+question_id+`" value="`+default_point_value+`"></div>`
	console.log("question: "+question_text)

	questions_added.push(question_id)
	question_block.appendChild(new_div)

	console.log("CURRENT QUESTIONS: "+JSON.stringify(questions_added))
	
}



function deleteQuestion(question_id){
	var question_to_delete = document.getElementById('question_id_'+question_id)
	question_to_delete.remove()
	document.getElementById("question_to_add_"+question_id).disabled = false;
	question_count = question_count - 1;

	remove(questions_added, question_id);
	console.log("CURRENT QUESTIONS: "+JSON.stringify(questions_added))
}



/*
The following function makes an ajax call to the questions resources to grab the list of questions
*/
function ajaxCallCreateTestQuestion(action, fields, primary_key, order, order_by){
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
				testQuestionCreated(resp)
			else{
				console.log("Internal error: "+resp['internal_message'])
				flash(request.responseText, "#F45F63")
				enableScroll();
				loader.classList.remove("loader");
			}

		} else {
			var resp = request.responseText;
			console.log("Something major happened!")
			console.log(request.responseText)
			flash(request.responseText, "#F45F63")
			enableScroll();
			loader.classList.remove("loader");
		}
	};

	//ajax request failed
	request.onerror = function() {
		console.log("Something went VERY VERY wrong")
		flash("Something went VERY VERY wrong", "#F45F63")
		enableScroll();
		loader.classList.remove("loader");
	};
	
}




/*
The following function makes an ajax call to the questions resources to grab the list of questions
*/
function ajaxCallCreateTest(action, fields, primary_key, order, order_by){
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
	request.open('POST', '../../controllers/test/test_front.php', true);
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
				addQuestionsToTest(resp)
			else{
				console.log("Internal error: "+resp['internal_message'])
				flash(request.responseText, "#F45F63")
				enableScroll();
				loader.classList.remove("loader");
			}

		} else {
			var resp = request.responseText;
			console.log("Something major happened!")
			console.log(request.responseText)
			flash(request.responseText, "#F45F63")
			enableScroll();
			loader.classList.remove("loader");
		}
	};

	//ajax request failed
	request.onerror = function() {
		console.log("Something went VERY VERY wrong")
		flash("Something went VERY VERY wrong", "#F45F63")
		enableScroll();
		loader.classList.remove("loader");
	};
	
}



/*
The following function makes an ajax call to the questions resources to grab the list of questions
*/
function ajaxCallQuestion(action, fields, primary_key, order, order_by){
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
				questionList(resp)
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



function clearTable(table) {
  var rows = table.rows;
  var i = rows.length;
  while (--i) {
    rows[i].parentNode.removeChild(rows[i]);
    // or
    // table.deleteRow(i);
  }
}



function filterQuestions(){
	console.log("Filtering questions")
	var fields = {}
	var sorted_by_obj = document.getElementById("sorted_by")
	var sorted_by =  sorted_by_obj.options[sorted_by_obj.selectedIndex].value;

	var order_obj = document.getElementById("order")
	var order =  order_obj.options[order_obj.selectedIndex].value;

	if(sorted_by == "")
		order = ""

	var topic_obj = document.getElementById("topic")
	var topic =  topic_obj.options[topic_obj.selectedIndex].value;

	if(topic != "")
		fields["topic"] = topic

	var difficulty_obj = document.getElementById("difficulty")
	var difficulty =  difficulty_obj.options[difficulty_obj.selectedIndex].value;

	if(difficulty != "")
		fields["difficulty"] = difficulty

	console.log("Order: "+order);
	console.log("Sorted by: "+sorted_by);
	console.log("Filters: "+JSON.stringify(fields))

	var table = document.getElementById("question_table");
	clearTable(table)

	ajaxCallQuestion("list", JSON.stringify(fields), "", order, sorted_by);
}


function resetFilter(){
	var table = document.getElementById("question_table");
	clearTable(table)
   ajaxCallQuestion("list", JSON.stringify({}), "", "", "");

}


loadGeneral()