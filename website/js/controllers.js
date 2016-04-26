google.charts.load('current', {'packages':['annotationchart']});

icarusApp.controller('MainController',function(AjaxService,AlertModalService,EditUserModal,AddStockModal,$cookies,JWT,MyStockList){
	var mCtrl=this;

	if($cookies.get('jwt')==""||$cookies.get('jwt')==null){
		AlertModalService.open('Authentication Token not found',"danger");
		window.location="#/";
		return false;
	}
	else{var jwt=JWT.parseJWT($cookies.get('jwt'));}
	mCtrl.stocks=[];
	mCtrl.preloadDiv=false;
	mCtrl.chartTitle='';
	mCtrl.google='';

	AjaxService.getUserStocks(jwt['user']).then(
		function(response){
			mCtrl.stocks=response.data["stocks"];
			mCtrl.google=response.data["google"]
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
				mCtrl.chartTitle=response.data['historical']['title'];
				google.charts.setOnLoadCallback(drawChart);
				function drawChart() {
					var m=response.data['historical']['data'].length, d="", dataRows=[], lastDate="";
					var data = new google.visualization.DataTable();
					for(var i=0;i<m;i++){
						d=response.data['historical']['data'][i][1].split("-");
						dataRows.push([new Date(d[0],(d[1]-1),d[2]),response.data['historical']['data'][i][2],undefined,undefined,undefined,undefined,undefined]);
						if(i==0){lastDate=d;}
					};
					var forecast=response.data['forecast'];
					m=forecast.length;
					for(i=0;i<m;i++){
						forecast[i]=parseFloat(forecast[i].toFixed(2));
						dataRows.push([new Date(parseInt(lastDate[0]),(parseInt(lastDate[1])-1),(parseInt(lastDate[2])+i+1)),undefined,undefined,undefined,forecast[i],forecast[i].toString(),undefined]);
					};
					data.addColumn('date', 'Date'); // Implicit series 1 data col.
					data.addColumn('number', 'Historical Price'); // Implicit domain label col.
					data.addColumn({type:'string', role:'annotation'});
					data.addColumn({type:'string', role:'annotationText'});
					data.addColumn('number', 'Future Price'); // Implicit domain label col.
					data.addColumn({type:'string', role:'annotation'});
					data.addColumn({type:'string', role:'annotationText'});

					data.addRows(dataRows);
					var chart = new google.visualization.AnnotationChart(document.getElementById('chart_div'));
					var options = {
						displayAnnotations: true,
						allowHTML: true
					};
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