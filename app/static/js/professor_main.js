window.onload=function(){
	var fields = {}
	loadGeneral();
	loadExamsToReview("list_test_to_be_released", JSON.stringify(fields), "", "", "");
	
	var exam_to_review = window.localStorage.getItem('exam_to_review')

	if(exam_to_review)
		window.localStorage.removeItem('exam_to_review')
}; 


/*
The following function makes an ajax call to the questions resources to grab the list of questions
*/
function loadExamsToReview(action, fields, primary_key, order, order_by){
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
	request.open('POST', '../../controllers/test/test_front.php', true);
	//setting up the content type in the header to 'x-wwww-form-urlencoded'
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	//making ajax request.
	request.send(data);

	//ajax request was successful
	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			var resp = JSON.parse(request.responseText);
			console.log(resp['status'])
			if(resp['status']=="success")
				listExamsToRelease(resp)
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


function listExamsToRelease(response){
	var items = response['items']

	//console.log(items.length)
	var table = document.getElementById("pending_review_table");

	for (item in items){
		//console.log("ITEM: "+JSON.stringify(items[item]))
		var tr = document.createElement("tr");
		
		var exam_name_td = document.createElement("td");
		var exam_name = document.createTextNode(items[item]['test_name']);
		exam_name_td.appendChild(exam_name);
		exam_name_td.id = "test_id_"+items[item]['primary_key']

		var review_td = document.createElement("td");
		review_td.innerHTML = '<div class="edit text-center"><input class="clean" type="button" value="Review" onClick="reviewExams('+items[item]['primary_key']+')"></div>'
		
		var release_td = document.createElement("td");
		release_td.innerHTML = '<div class="info text-center"><input class="clean success" type="button" value="Release" onClick="releaseScore('+items[item]['primary_key']+')"></div>'
		

		//var delete_td = document.createElement("td");
		//delete_td.innerHTML = '<div class="text-center delete"><input class="clean" type="button" value="Delete" onClick="deleteExam('+items[item]['primary_key']+')" id="exam_to_delete_'+items[item]['primary_key']+'"></div>'

		tr.appendChild(exam_name_td);
		tr.appendChild(review_td);
		tr.appendChild(release_td);
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


function reviewExams(primary_key){
	window.localStorage.setItem("exam_to_review", primary_key)
	window.localStorage.setItem("test_name", document.getElementById('test_id_'+primary_key).textContent)
	goTo("../exams/review_exams.html")
}



function releaseScore(primary_key){
	var test = {'primary_key':primary_key, 'test_name':document.getElementById('test_id_'+primary_key).textContent}
	window.localStorage.setItem('test_to_release', JSON.stringify(test))
	goTo('../exams/release_score.html')
}

