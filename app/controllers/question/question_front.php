<?php
/*
**Author: Jeury Mejia
**Last Upated: 09/23/2017
**Purpose: This php makes a curl request to the middle (question_middle.php) to access question resources
*/

//initializing curl object
$curl = curl_init();

$rawjson = $_POST["json_string"];

$data = array(
  "json_string" => $rawjson,
);

$post_data = http_build_query($data);

//creaing curl object.
curl_setopt_array($curl, array(
  CURLOPT_URL => "https://web.njit.edu/~mga25/cs_490/app/controllers/question/question_middle.php",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => $post_data,
  //CURLOPT_POSTFIELDS => "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"json_string\"\r\n\r\n" . $_POST['json_string'] . "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--",
  CURLOPT_HTTPHEADER => array(),
));

//executing curl call.
$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

//checking for errors and echoing back response to caller. 
if ($err) {
  echo "CURL Error #:" . $err;
} else {
  echo $response;
}
?>