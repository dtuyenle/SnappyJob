



<?
 header("Access-Control-Allow-Origin: *");
//We use already made Twitter OAuth library
//https://github.com/mynetx/codebird-php
require_once ('codebird.php');

//Twitter OAuth Settings
$CONSUMER_KEY = 'JCdi5ohXvJ63ZZ3K2G1hOCh5X';
$CONSUMER_SECRET = 'CPRHhmcdNSuPwqTV3UgnMvoqusIrlT8PttCYHNYPVmjnegVJP4';
$ACCESS_TOKEN = '1273859522-ItR30I1OBMN7PiyFeKp7mZboHVLbmIuHt7X8ajM';
$ACCESS_TOKEN_SECRET = 'S84M7fzmqONwRXlBU4QpOCn2tbb2I4ouw6ZlC7mDoZHc2';

//Get authenticated
Codebird::setConsumerKey($CONSUMER_KEY, $CONSUMER_SECRET);
$cb = Codebird::getInstance();
$cb->setToken($ACCESS_TOKEN, $ACCESS_TOKEN_SECRET);


//retrieve posts
$q = $_GET['q'];
$count = $_GET['count'];
$api = $_GET['api'];

//https://dev.twitter.com/docs/api/1.1/get/statuses/user_timeline
//https://dev.twitter.com/docs/api/1.1/get/search/tweets
$params = array(
	'screen_name' => $q,
	'q' => $q,
	'count' => $count
);

//Make the REST call
$data = (array) $cb->$api($params);

//Output result in JSON, getting it ready for jQuery to process
header('Content-Type: application/json');
echo json_encode($data);

?>