icarusApp.controller('MainController',function(AjaxService,AlertModalService,EditUserModal,$cookies,JWT){
	var mCtrl=this;
	var jwt=JWT.parseJWT($cookies.get('jwt'));
	mCtrl.stocks=[];

	if($cookies.get('jwt')==""||$cookies.get('jwt')==null){
		AlertModalService.open('Authentication Token not found',"danger");
		//window.location="#/";
	}

	AjaxService.getUserStocks(jwt['user']).then(
		function(response){
			mCtrl.stocks=response.data;
		},
		function(errmsg){
			AlertModalService.open(errmsg.statusText,"danger");
		}
	);

	mCtrl.editUser=function(){
		EditUserModal.open();
	}
	mCtrl.logout=function(){
		AjaxService.logout().then(
			function(response){
				$cookies.put('jwt','');
				AlertModalService.open("Logout Complete","success");
				window.location="#/";
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
  		AjaxService.login(lCtrl.email,lCtrl.password).then(
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

icarusApp.controller('EditUserController',function($uibModalInstance,EditUserModal,AlertModalService,JWT,$cookies,AjaxService){
	var euCtrl=this;
	var jwt=JWT.parseJWT($cookies.get('jwt'));
 	AjaxService.getUser(jwt['user']).then(
		function(response){
			euCtrl.fname=response.data['fname'];
			euCtrl.lname=response.data['lname'];
			euCtrl.email=response.data['email'];
		},
		function(errmsg){
			AlertModalService.open(errmsg.statusText,"danger");
		}
	);

	euCtrl.close=function(){
		$uibModalInstance.dismiss('cancel');
	};
	euCtrl.save=function(){
		var save=EditUserModal.save(jwt['user'],euCtrl.fname,euCtrl.lname,euCtrl.email);
 			save.then(
			function(response){
				AlertModalService.open("Profile successfully updated","success");
				$uibModalInstance.dismiss('cancel');
			},
			function(errmsg){
				AlertModalService.open(errmsg.statusText,"danger");
			}
		);
	};
});