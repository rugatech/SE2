<?php
use bsc\datastore\routes as routes;

$app->group('/people',function() {
	$this->map(['POST'],'',function ($request, $response, $args){
		try{
			$json=json_decode($request->getBody(),TRUE);
			if(!$json){
				throw new apiException('Malformed JSON request',5);
			}
			(new routes\people($_SERVER['HTTP_AUTHORIZATION']))->addPerson($json);
			return $response;
		}
	    catch(DatastoreException $e){
	    	throw new apiException($e->getMessage(),$e->getCode());
	    }
	});
	$this->get('/{pkey}',function ($request, $response, $args){
		try{
			$retval=(new routes\people($_SERVER['HTTP_AUTHORIZATION']))->getPersonById($args['pkey']);
			$response->write($retval);
			return $response;
		}
	    catch(DatastoreException $e){
	    	throw new apiException($e->getMessage(),$e->getCode());
	    }
	});
	$this->delete('/{pkey}', function ($request, $response, $args){
		try{
			(new routes\people($_SERVER['HTTP_AUTHORIZATION']))->deletePerson($args['pkey']);
			$response->write($retval);
			return $response;
		}
		catch(DatastoreException $e){
			throw new apiException($e->getMessage(),$e->getCode());
		}
	});
	$this->put('/{pkey}', function ($request, $response, $args){
		try{
			$json=json_decode($request->getBody(),TRUE);
			if(!$json){
				throw new apiException('Malformed JSON request',5);
			}
			(new routes\people($_SERVER['HTTP_AUTHORIZATION']))->editPerson($json,$args['pkey']);
			return $response;
		}
		catch(DatastoreException $e){
			throw new apiException($e->getMessage(),$e->getCode());
		}
	});
}); ?>
