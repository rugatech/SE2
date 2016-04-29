<?php

class cron
{
	public $db;

	public function __construct(){

		##Connect to the MySQL database using the PHP-PDO database abstraction layer
		$this->db=new PDO('mysql:host=localhost;dbname=se2;charset=UTF8','se2','mit2016');
		$this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}

	##This function sends to request to Google Finance to retreive the stock prirce
	public function process(){

		##cURL is a library avaiable to most modern languages for the purposes of transmitting data via the HTTP protocol

		##The URL for querying the Google Finance API
		$url='http://www.google.com/finance/info?infotype=infoquoteall&q=NASDAQ:GOOG,NASDAQ:YHOO,NYSE:F,NASDAQ:ATVI,NYSE:BAC,NYSE:AA,NASDAQ:MSFT,NYSE:C,NASDAQ:AAPL,NASDAQ:SIRI';
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

		##Google prepends "//" to each JSON request which must be removed.
		$data = str_replace('// ','',curl_exec($ch));
		$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		curl_close($ch);

		##If the below statement is false the the google finance api returned a non-200 response (basically an error)
		if($httpcode>=200 && $httpcode<300){

			##Decode the JSON returned by the server
			$json=json_decode($data,TRUE);

			##Create a prepared statement for inserting the stock prices into the databaes
			$pstmt=$this->db->prepare('INSERT INTO current (symbol,price,ts) VALUES (?,?,?)');
			foreach($json as $key=>$val){
				try{
					$pstmt->execute([$val['t'],str_replace(',','',$val['l_cur']),$val['lt_dts']]);
					##prepare formatted data to output to the console.
					$retval.=str_pad($val['t'],7,' ',STR_PAD_RIGHT).str_pad('',10,' ',STR_PAD_RIGHT).str_pad($val['l_cur'],10,' ',STR_PAD_RIGHT).str_pad($val['lt_dts'],10,' ',STR_PAD_RIGHT)."\r\n";
				}
				catch(PDOException $e){

					##something when wrong the database insert query
					print_r($e);
				}
			}
			return($retval);
		}
		else{
			##there was an error retreiving data from the Yahoo API
			echo 'ERROR: '.$data;
		}
	}
}

$cron=new cron();

##Create an infinite loop which runs the process method once every 60 second.
##This script is turned on at 9:00AM and turned off at 4:30PM every business day by the Windows Task Managaer
while(true){
 	$results=$cron->process();
	echo "\r\n".$results."\r\n";
  	##sleep for 60 seconds
  	sleep(60);
}