<?php

namespace bsc\api;

use bsc\api\APIException;
use bsc\datastore\DatastoreException;
use bsc\datastore;

class api
{
	public $app;

	public function __construct(){
		$this->__startAPI();
	}
	private function __startAPI(){
		//Override the default Not Found Handler
		$c = new \Slim\Container();
		$c['notFoundHandler'] = function ($c) {
		    return function ($request, $response) use ($c) {
		        return $c['response']
		            ->withStatus(404)
		            ->withHeader('Content-Type', 'text/html')
	            ->write('Page not found');
		    };
		};
		$app = new \Slim\App($c);
		$this->__buildRoutes($app);
	}

	private function __buildRoutes($app){
		$app->options('/',function($request,$response,$args){
		});

		$app->get('/user/{pkey}',function($request, $response, $args){
			try{
				$retval=(new datastore\datastore($_SERVER['HTTP_AUTHORIZATION']))->getUser($args['pkey']);
				$response->write($retval);
				return $response;
			}
			catch(DatastoreException $e){
			    throw new apiException($e->getMessage(),$e->getCode());
			}
		});

		//$app->post('/',function($request, $response, $args){
		//    $response->write('Welcome to Slim POST1');
		//    return $response;
		//});

		$app->post('/user/login',function($request, $response, $args){
			try{
				$json=json_decode($request->getBody(),TRUE);
				if(!$json){
					throw new apiException('Malformed JSON request',5);
				}
				$token=(new datastore\datastore($_SERVER['HTTP_AUTHORIZATION']))->login($json);
				unset($retval);
				$retval['jwt']=(string)$token;
				$response->write(json_encode($retval));
				return $response;
			}
			catch(DatastoreException $e){
			    throw new apiException($e->getMessage(),$e->getCode());
			}
		});

		$app->post('/user',function($request, $response, $args){
			try{
				$json=json_decode($request->getBody(),TRUE);
				if(!$json){
					throw new apiException('Malformed JSON request',5);
				}
				$retval=(new datastore\datastore($_SERVER['HTTP_AUTHORIZATION']))->addUser($json);
				return $response;
			}
			catch(DatastoreException $e){
			    throw new apiException($e->getMessage(),$e->getCode());
			}
		});

		$app->put('/user/{pkey}',function($request, $response, $args){
			try{
				$json=json_decode($request->getBody(),TRUE);
				if(!$json){
					throw new apiException('Malformed JSON request',5);
				}
				$retval=(new datastore\datastore($_SERVER['HTTP_AUTHORIZATION']))->editUser($json,$args['pkey']);
				return $response;
			}
			catch(DatastoreException $e){
			    throw new apiException($e->getMessage(),$e->getCode());
			}
		});

		//$app->group('/user',function(){
			//$this->get('/{pkey}',function ($request, $response, $args){
			//	print_r($args);
				//try{
				//	$retval=(new routes\people($_SERVER['HTTP_AUTHORIZATION']))->getPersonById($args['pkey']);
				//	$response->write($retval);
				//	return $response;
				//}
			    //catch(DatastoreException $e){
			    //	throw new apiException($e->getMessage(),$e->getCode());
			    //}
			//});
			//$this->map(['POST'],'',function ($request, $response, $args){
				//try{
				//	$json=json_decode($request->getBody(),TRUE);
				//	if(!$json){
				//		throw new apiException('Malformed JSON request',5);
				//	}
				//	print_r($json);exit;
				//	//$retval=new datastore->addUser($json);
					//$response->write($retval);
					//return $response;
				//}
			    //catch(DatastoreException $e){
			    //	throw new apiException($e->getMessage(),$e->getCode());
			    //}
			//});
			//$this->put('/{pkey}', function ($request, $response, $args){
			//	try{
			//		$json=json_decode($request->getBody(),TRUE);
			//		if(!$json){
			//			throw new apiException('Malformed JSON request',5);
			//		}
			//		$retval=(new routes\cabinet($_SERVER['HTTP_AUTHORIZATION']))->addEditCabinet($json,$args['pkey'],'Edit');
			//		return $response;
			//	}
			//	catch(DatastoreException $e){
			//		throw new apiException($e->getMessage(),$e->getCode());
			//	}
			//});
		//});
		unset($app->getContainer()['errorHandler']);
		$app->run();
	}
}