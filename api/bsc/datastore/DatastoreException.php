<?php
namespace bsc\datastore;

class DatastoreException extends \bsc\bscException
{
    public function __construct($message, $code) {
        parent::__construct($message, $code);
    }

}