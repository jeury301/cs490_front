<?php
//Author: Jeury Mejia
//Date: 09/16/2017
//Purpose: This php makes a curl request to the middle-man to authenticate the user

//this code was reproduced using POSTMAN
$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => "https://web.njit.edu/~mga25/cs_490/app/login/login_middle.php",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"json_string\"\r\n\r\n" . $_POST['json_string'] . "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--",
  CURLOPT_HTTPHEADER => array(
    "cache-control: no-cache",
    "content-type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
    "postman-token: 093db457-ce55-f649-c205-b2cbf97412e0"
  ),
));

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
}

?>