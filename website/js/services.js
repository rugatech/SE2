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

icarusApp.service('JWT',function($window){
	this.parseJWT=function(token){
  		var base64Url = token.split('.')[1];
  		var base64 = base64Url.replace('-', '+').replace('_', '/');
  		return (JSON.parse($window.atob(base64)));
	};
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

	this.editUser=function(user,fname,lname,email){
		var request = $http({
			method: 'PUT',
			url: "http://www.rugatech.com/se2/api/user/"+user,

			headers: {
	    	    'Authorization': 'Bearer '+$cookies.get('jwt'),
			}
		});
		return (request);
	}

	this.getUserStocks=function(user){
		var request = $http({
			method: 'GET',
			url: "http://www.rugatech.com/se2/api/user/"+user+"/stock",
			headers: {
	    	    'Authorization': 'Bearer '+$cookies.get('jwt'),
			}
		});
		return (request);
	}

	this.deleteStock=function(user,stock){
		var request = $http({
			method: 'DELETE',
			url: "http://www.rugatech.com/se2/api/user/"+user+"/stock/"+stock,
			headers: {
	    	    'Authorization': 'Bearer '+$cookies.get('jwt'),
			}
		});
		return (request);
	}

	this.addStock=function(user,stock){
		var request = $http({
			method: 'POST',
			url: "http://www.rugatech.com/se2/api/user/"+user+"/stock",
			data: {"stock":stock},
			headers: {
	    	    'Authorization': 'Bearer '+$cookies.get('jwt'),
			}
		});
		return (request);
	}

	this.downloadStock=function(stock){
		var request = $http({
			method: 'GET',
			url: "http://www.rugatech.com/se2/api/stock/"+stock,
			headers: {
	    	    'Authorization': 'Bearer '+$cookies.get('jwt'),
			}
		});
		return (request);
	}

	this.logout=function(){
		var request = $http({
			method: 'GET',
			url: "http://www.rugatech.com/se2/api/user/logout",
			headers: {
	    	    'Authorization': 'Bearer '+$cookies.get('jwt'),
			}
		});
		return (request);
	}

})

icarusApp.service("MyStockList",function(AjaxService,AlertModalService){
	var stockList;

	var addStockData=function(data){
		stockList=data;
	};
	var deleteStock=function(i){
		stockList.splice(i,1);
	};
	var addStock=function(stock){
		stockList.push(stock);
	};
	return{
		addStockData: addStockData,
		deleteStock: deleteStock,
		addStock: addStock
	}
});

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

icarusApp.service('CreateUserModal',function($uibModal,AjaxService,AlertModalService){
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

icarusApp.service('EditUserModal',function($uibModal,AjaxService,AlertModalService){
	this.open=function(){
		$uibModal.open({
			templateUrl:'partials/editUserModal.html',
			controller:'EditUserController as euCtrl',
			size: 'sm-400'
		});
	}

	this.save=function(user,fname,lname,email){
  		return(AjaxService.editUser(user,fname,lname,email));
	}
});

icarusApp.service('AddStockModal',function($uibModal,AjaxService,AlertModalService){
	this.open=function(){
		$uibModal.open({
			templateUrl:'partials/addStockModal.html',
			controller:'AddStockController as asCtrl',
			size: 'sm-400'
		});
	}

	this.save=function(user,stock){
  		return(AjaxService.addStock(user,stock));
	}
});