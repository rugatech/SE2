var icarusApp=angular.module('app',['ngAnimate','ui.router','ui.bootstrap','ngCookies']);

icarusApp.config(function ($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/');
	$stateProvider
		.state('/',{
			url: '/',
			templateUrl: 'partials/login.html',
			controller: 'LoginController as lCtrl'
		})
		.state('main',{
			url: '/main',
			templateUrl: 'partials/main.html',
			controller: 'MainController as mCtrl'
		});
});

icarusApp.service('AjaxService',function($http,$q,$cookies){
	this.login=function(email,password){
		var request = $http({
			method: 'POST',
			url: "http://www.rugatech.com/se2/api/user/login",
			data: {"email":email,"password":password}
		});
		return (request);
	}

	this.getUser=function(user){
		var request = $http({
			method: 'GET',
			url: "http://www.rugatech.com/se2/api/user/"+user,
			headers: {
	    	    'Authorization': 'Bearer '+$cookies.get('jwt'),
			}
		});
		return (request);
	}

	this.createUser=function(fname,lname,email,password){
		var request = $http({
			method: 'POST',
			url: "http://www.rugatech.com/se2/api/user",
			data: {"fname":fname,"lname":lname,"email":email,"password":password}
		});
		return (request);
	}

})

icarusApp.service('AlertModalService',function($uibModal){
	this.message="";
	this.open=function(message,modalType){
		this.message=message;
		$uibModal.open({
			template: '<div class="modal-body" style="font-size:15px"><uib-alert type="'+modalType+'"><span class="sr_only">&nbsp;{{amCtrl.message}}</span></uib-alert></div><div class="modal-footerzzz" style="width:100%;text-align:center;margin-bottom:10px"><button class="btn btn-info btn-sm" type="button" data-ng-click="amCtrl.ok()">OK</button></div>',
			controller:'AlertModalController as amCtrl',
		});
	};
	this.getMessage=function(){return this.message;}
});

icarusApp.service('CreateUserModal',function($uibModal,$q,AjaxService,AlertModalService){
	this.open=function(){
		$uibModal.open({
			templateUrl:'partials/createUserModal.html',
			controller:'CreateUserController as cuCtrl',
			size: 'sm-450'
		});
	}

	this.save=function(fname,lname,email,password){
  		return(AjaxService.createUser(fname,lname,email,password));
	}
});