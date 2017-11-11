window.onload=function(){
	loadGeneral();
	var exam_to_review = window.localStorage.getItem('exam_to_review')
	var exam_name = window.localStorage.getItem('test_name')
	var student_score = window.localStorage.getItem('student_grade')
	var student_key = window.localStorage.getItem('student_id_under_review')
	
	var fields = {"test_id":exam_to_review.test_id, "student_id":student_key}
	
	var score = Number(student_score)
	var color = "#d9534f"

	if(score <  70)
		color = "#d9534f"
	if(score >= 70 && score < 90)
		color = "#428bca"
	if(score >= 90)
		color = "#5cb85c"

	document.getElementById('your_final_score').innerHTML = 'Student final score: <strong style="color:'+color+'">&nbsp;'+score+'%</strong>'

	//ajaxCallGetQuestionAnswers("list", JSON.stringify(fields), "", "", "");
	document.getElementById('exam_name').innerHTML = exam_name
	
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
