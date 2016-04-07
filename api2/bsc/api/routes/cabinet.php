<?php
use bsc\datastore\routes as routes;
use bsc\api\APIException;
use bsc\datastore\DatastoreException;

$app->group('/cabinet',function(){
	$this->map(['POST'],'',function ($request, $response, $args){
		try{
			$json=json_decode($request->getBody(),TRUE);
			if(!$json){
				throw new apiException('Malformed JSON request',5);
			}
			$retval=(new routes\cabinet($_SERVER['HTTP_AUTHORIZATION']))->addEditCabinet($json,0,'Add');
			$response->write($retval);
			return $response;
		}
	    catch(DatastoreException $e){
	    	throw new apiException($e->getMessage(),$e->getCode());
	    }
	});
	$this->get('/{pkey}',function ($request, $response, $args){
		try{
			$retval=(new routes\cabinet($_SERVER['HTTP_AUTHORIZATION']))->getCabinetById($args['pkey']);
			$response->write($retval);
			return $response;
		}
	    catch(DatastoreException $e){
	    	throw new apiException($e->getMessage(),$e->getCode());
	    }
	});
	$this->delete('/{pkey}', function ($request, $response, $args){
		try{
			$retval=(new routes\cabinet($_SERVER['HTTP_AUTHORIZATION']))->deleteCabinet($args['pkey']);
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
			$retval=(new routes\cabinet($_SERVER['HTTP_AUTHORIZATION']))->addEditCabinet($json,$args['pkey'],'Edit');
			return $response;
		}
		catch(DatastoreException $e){
			throw new apiException($e->getMessage(),$e->getCode());
		}
	});
});