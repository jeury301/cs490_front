window.onload=function(){
	var student_id = window.localStorage.getItem('user_key')
	var fields = {
		"student_id":student_id,
		"scores_released":1
	}
	loadGeneral();
	//ajaxCallStudentExams("list", JSON.stringify(fields), "", "", "");

}; 