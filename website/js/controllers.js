google.charts.load('current', {'packages':['annotationchart']});

icarusApp.controller('MainController',function(AjaxService,AlertModalService,EditUserModal,AddStockModal,$cookies,JWT,MyStockList){
	var mCtrl=this;
	var jwt=JWT.parseJWT($cookies.get('jwt'));
	mCtrl.stocks=[];
	mCtrl.preloadDiv=false;
	mCtrl.chartTitle='';

	if($cookies.get('jwt')==""||$cookies.get('jwt')==null){
		AlertModalService.open('Authentication Token not found',"danger");
		window.location="#/";
	}

	AjaxService.getUserStocks(jwt['user']).then(
		function(response){
			mCtrl.stocks=response.data;
			MyStockList.addStockData(mCtrl.stocks);
		},
		function(errmsg){
			AlertModalService.open(errmsg.statusText,"danger");
		}
	);

	mCtrl.editUser=function(){
		EditUserModal.open();
	}

	mCtrl.addStock=function(){
		AddStockModal.open();
	}

	mCtrl.deleteStock=function(stock,i){
		AjaxService.deleteStock(jwt['user'],stock).then(
			function(response){
				MyStockList.deleteStock(i);
				AlertModalService.open("Stock Deleted","success");
			},
			function(errmsg){
				AlertModalService.open(errmsg.statusText,"danger");
			}
		)
	}

	mCtrl.downloadStock=function(stock){
		mCtrl.preloadDiv=true;
		AjaxService.downloadStock(stock).then(
			function(response){
				mCtrl.preloadDiv=false;
				mCtrl.chartTitle=response.data['title'];
				google.charts.setOnLoadCallback(drawChart);
				function drawChart() {
					var m=response.data['data'].length, d="", dataRows=[];
					var data = new google.visualization.DataTable();
					for(var i=0;i<m;i++){
						d=response.data['data'][i][1].split("-");
						dataRows.push([new Date(d[0],d[1],d[2]),response.data['data'][i][2]]);
					};
					data.addColumn('date', 'Date');
					data.addColumn('number', 'Closing Price');
					data.addRows(dataRows);
					var chart = new google.visualization.AnnotationChart(document.getElementById('chart_div'));
					var options = {displayAnnotations: true};
		        	chart.draw(data, options);
				}
			},
			function(errmsg){
				mCtrl.preloadDiv=false;
				AlertModalService.open(errmsg.statusText,"danger");
			}
		)
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

icarusApp.controller('AddStockController',function($uibModalInstance,AddStockModal,AlertModalService,JWT,$cookies,AjaxService,MyStockList){
	var asCtrl=this;
	var jwt=JWT.parseJWT($cookies.get('jwt'));

	asCtrl.close=function(){
		$uibModalInstance.dismiss('cancel');
	};
	asCtrl.save=function(){
		var save=AddStockModal.save(jwt['user'],asCtrl.stock);
 			save.then(
			function(response){
				AlertModalService.open("Stock successfully added","success");
				MyStockList.addStock({"stock":response.data["symbol"],"stock_name":response.data["stock_name"]});
				$uibModalInstance.dismiss('cancel');
			},
			function(errmsg){
				AlertModalService.open(errmsg.statusText,"danger");
			}
		);
	};
});