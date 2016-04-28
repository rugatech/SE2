<?php
namespace bsc\api;

use bsc\api\APIException;
use bsc\datastore\DatastoreException;
use bsc\datastore;
use bsc\model;

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

		$app->get('/user/logout',function($request, $response, $args){
			try{
				$retval=(new datastore\datastore($_SERVER['HTTP_AUTHORIZATION']))->logout();
				$response->write($retval);
				return $response;
			}
			catch(DatastoreException $e){
			    throw new apiException($e->getMessage(),$e->getCode());
			}
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

		$app->post('/user',function($request, $response, $args){
			try{
				$json=json_decode($request->getBody(),TRUE);
				if(!$json){
					throw new apiException('Malformed JSON request',5);
				}
				$retval=(new datastore\datastore($_SERVER['HTTP_AUTHORIZATION']))->addUser($json);
				$response->write($retval);
				return $response;
			}
			catch(DatastoreException $e){
			    throw new apiException($e->getMessage(),$e->getCode());
			}
		});

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

		$app->get('/user/{pkey}/stock',function($request, $response, $args){
			try{
				$retval=(new datastore\datastore($_SERVER['HTTP_AUTHORIZATION']))->getUserStock($args['pkey']);
				$response->write(json_encode($retval));
				return $response;
			}
			catch(DatastoreException $e){
			    throw new apiException($e->getMessage(),$e->getCode());
			}
		});

		$app->delete('/user/{pkey}/stock/{stock}',function($request, $response, $args){
			try{
				$retval=(new datastore\datastore($_SERVER['HTTP_AUTHORIZATION']))->deleteStock($args['pkey'],$args['stock']);
				$response->write(json_encode($retval));
				return $response;
			}
			catch(DatastoreException $e){
			    throw new apiException($e->getMessage(),$e->getCode());
			}
		});

		$app->post('/user/{pkey}/stock',function($request, $response, $args){
			try{
				$json=json_decode($request->getBody(),TRUE);
				if(!$json){
					throw new apiException('Malformed JSON request',5);
				}
				$retval=(new datastore\datastore($_SERVER['HTTP_AUTHORIZATION']))->addStock($args['pkey'],$json['stock']);
				$response->write(json_encode($retval));
				return $response;
			}
			catch(DatastoreException $e){
			    throw new apiException($e->getMessage(),$e->getCode());
			}
		});

		$app->get('/stock/{stock}/{term}/{algorithm}',function($request, $response, $args){
			try{
				$retval=[];
				switch($args['term']){
					case 's':
						$retval=(new datastore\datastore($_SERVER['HTTP_AUTHORIZATION']))->getCurrentStock($args['stock'],$args['algorithm']);
					break;
					case 'l':
						$retval=(new datastore\datastore($_SERVER['HTTP_AUTHORIZATION']))->getHistoricalStock($args['stock'],$args['algorithm']);
					break;
					default:
						throw new apiException('Invalid value for Term',1);
					break;
				}

				$response->write(json_encode($retval,JSON_NUMERIC_CHECK));
				return $response;
			}
			catch(DatastoreException $e){
			    throw new apiException($e->getMessage(),$e->getCode());
			}
		});

		$app->get('/stock/historical/{stock}',function($request, $response, $args){
			try{
				$retval=(new datastore\datastore(''))->getHistoricalStock($args['stock']);
				$response->write(json_encode($retval,JSON_NUMERIC_CHECK));
				return $response;
			}
			catch(DatastoreException $e){
			    throw new apiException($e->getMessage(),$e->getCode());
			}
		});

		unset($app->getContainer()['errorHandler']);
		$app->run();
	}
}