<?php include('icarus.php'); 

class template extends icarus
{
	function __construct($configFile){
		session_start();
		parent::__construct($configFile);
		if(strpos($_SERVER['PHP_SELF'],'index.php')!==false){
			unset($this->jMenuBar);
		}
		else{
			if(!empty($_COOKIE['PHPSESSID'])){
				$this->user=$_SESSION[$this->config['progID']];
				if(!empty($this->user)){
					$this->menubar_restrictions='A';
				}
				else{}
			}
		}
	}
}