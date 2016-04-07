<?php include('vendor/autoload.php');

ini_set('display_errors','on');
use bsc\api\APIException;

try{
	$api=new bsc\api\api();
}
catch(apiException $e){
	header('HTTP/1.1 '.$e->getHttpCode().' '.$e->getMessage());
	exit;
}