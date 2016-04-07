<?php

namespace bsc\api;

use bsc\api\APIException;
use bsc\datastore;
use bsc\datastore\routes as routes;

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

		$app->get('/', function ($request, $response, $args) {
		    $response->write('Welcome to Slim');
		    return $response;
		});

		$app->get('/help',function ($request, $response, $args){
		    header('Location: /dps_roster/swagger/index.html');
		    exit;
		});

		foreach( glob(__dir__.'\routes\*.php') as $file){require($file);}

		unset($app->getContainer()['errorHandler']);
		$app->run();
	}
}