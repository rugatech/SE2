

icarusApp.controller('MainController',function(AjaxService,AlertModalService){
	var mCtrl=this;
	mCtrl.getUser=function(user){
  		AjaxService.getUser(user)
  		.then(
			function(response){
				console.log(response)
			},
			function(errmsg){
				AlertModalService.open(errmsg.statusText,"danger");
			}
		);
	}
});

icarusApp.controller('LoginController',function(AjaxService,AlertModalService,CreateUserModal,$cookies){
	var lCtrl=this;
	lCtrl.submitLogin=function(){
  		AjaxService.login(lCtrl.email,lCtrl.password)
  		.then(
			function(response){
				$cookies.put('jwt',response.data['jwt']);
				window.location="#/main";
			},
			function(errmsg){
				AlertModalService.open(errmsg.statusText,"danger");
			}
		);
	};
	lCtrl.createUser=function(){
		CreateUserModal.open();
	}
});

icarusApp.controller('AlertModalController',function($uibModalInstance,AlertModalService){
	var amCtrl=this;
	amCtrl.message=AlertModalService.getMessage();
	amCtrl.ok=function(){
		$uibModalInstance.dismiss('cancel');
	};
});

icarusApp.controller('CreateUserController',function($uibModalInstance,CreateUserModal,AlertModalService){
	var cuCtrl=this;
	cuCtrl.close=function(){
		$uibModalInstance.dismiss('cancel');
	};
	cuCtrl.save=function(){
		if(cuCtrl.password!=cuCtrl.password2){AlertModalService.open("Passwords do not match","danger");}
		else{
			var save=CreateUserModal.save(cuCtrl.fname,cuCtrl.lname,cuCtrl.email,cuCtrl.password);
  			save.then(
				function(response){
					AlertModalService.open("User Created, You may login now","success");
					$uibModalInstance.dismiss('cancel');
				},
				function(errmsg){
					AlertModalService.open(errmsg.statusText,"danger");
				}
			);
		}
	};
});