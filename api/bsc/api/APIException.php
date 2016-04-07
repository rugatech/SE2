<?php
namespace bsc\api;

class APIException extends \bsc\bscException
{
    public function __construct($message, $code) {
        parent::__construct($message, $code);
    }

}