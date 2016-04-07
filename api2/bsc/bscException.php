<?php namespace bsc;

class bscException extends \Exception
{
    public function __construct($message, $code = 0) {
        parent::__construct($message,$code,null);
    }

    public function getHttpCode(){
    	switch($this->getCode()){
    		case 1:
    			return '404';
    		break;
    		case 2:
    			return '500';
    		break;
    		case 3:
    			return '401';
    		break;
    		case 4:
    			return '409';
    		break;
    		case 5:
    			return '400';
    		break;
    		case 6:
    			return '405';
    		break;
    	}
    }
}