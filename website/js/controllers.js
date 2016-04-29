google.charts.load('current', {'packages':['annotationchart']});

icarusApp.controller('MainController',function(AjaxService,AlertModalService,EditUserModal,AddStockModal,$cookies,JWT,MyStockList,DownloadModal){
	var mCtrl=this;

	if($cookies.get('jwt')==""||$cookies.get('jwt')==null){
		AlertModalService.open('Authentication Token not found',"danger");
		window.location="#/";
		return false;
	}
	else{var jwt=JWT.parseJWT($cookies.get('jwt'));}
	mCtrl.stocks=[];
	//mCtrl.preloadDiv=false;
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
		DownloadModal.open(stock);
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
				MyStockList.addStock({
					"stock":response.data["symbol"],
					"stock_name":response.data["stock_name"],
					"ten_day":response.data["ten_day"],
					"min_price":response.data["min_price"],
					"max_price":response.data["max_price"],
					"current_price":response.data["current_price"],
					"avg_price":response.data["avg_price"]
				});
				$uibModalInstance.dismiss('cancel');
			},
			function(errmsg){
				AlertModalService.open(errmsg.statusText,"danger");
			}
		);
	};
});

icarusApp.controller('DownloadController',function($uibModalInstance,DownloadModal,AlertModalService,JWT,$cookies,AjaxService){
	var dCtrl=this, errmsg="";
	var jwt=JWT.parseJWT($cookies.get('jwt'));

	dCtrl.close=function(){
		$uibModalInstance.dismiss('cancel');
	};
	dCtrl.save=function(){
		errmsg="";
		if(dCtrl.term==undefined){errmsg="You must select Short-Term or Long-Term";}
		if(dCtrl.alg==undefined){errmsg="You must select an Algorithm";}
		if(errmsg==""){
			var pd=document.getElementById('preload_div');
			pd.style.display='block';
			var save=DownloadModal.save(dCtrl.term,dCtrl.alg);
 			save.then(
			function(response){
				document.getElementById('chartTitle').innerHTML=response.data['title'];
				google.charts.setOnLoadCallback(drawChart);
				function drawChart() {
					var m=response.data['data'].length, d="", dataRows=[], lastDate="";
					var data = new google.visualization.DataTable();
					switch(dCtrl.term){
						case 'l':
							for(var i=0;i<m;i++){
								d=response.data['data'][i]["datee"].split("-");
								dataRows.push([new Date(d[0],(d[1]-1),d[2]),response.data['data'][i]["close_price"],undefined,undefined,undefined,undefined,undefined]);
								if(i==m-1){lastDate=d;}
							};
							if(response.data['forecast']!=null){
								var forecast=response.data['forecast'].split(" ");
								m=forecast.length;
								for(i=0;i<m;i++){
									forecast[i]=parseFloat(forecast[i]);
									dataRows.push([new Date(parseInt(lastDate[0]),(parseInt(lastDate[1])-1),(parseInt(lastDate[2])+i+1)),undefined,undefined,undefined,forecast[i],forecast[i].toString(),undefined]);
								};
							}
							if(response.data['moving_average']!=null){
								var ma=response.data['moving_average'];
								m=ma.length;
								for(i=0;i<m;i++){
									d=ma[i]["datee"].split("-");
									dataRows.push([new Date(d[0],(d[1]-1),d[2]),undefined,undefined,undefined,parseFloat(ma[i]["price"]),undefined,undefined]);
								}
							}
							data.addColumn('date', 'Date'); // Implicit series 1 data col.
							data.addColumn('number', 'Historical Price'); // Implicit domain label col.
							data.addColumn({type:'string', role:'annotation'});
							data.addColumn({type:'string', role:'annotationText'});
							if(response.data['forecast']!=null){
								data.addColumn('number', 'Future Price'); // Implicit domain label col.
							}
							else{
								data.addColumn('number', '30-Day Moving Average'); // Implicit domain label col.
							}
							data.addColumn({type:'string', role:'annotation'});
							data.addColumn({type:'string', role:'annotationText'});
							data.addRows(dataRows);
						break;
						case 's':
							var lastDate2='';
							for(var i=0;i<m;i++){
								d=response.data['data'][i]["datee"].split("T");
								d1=d[0].split("-");
								d2=d[1].split(":");
								dataRows.push([new Date(d1[0],(d1[1]-1),d1[2],d2[0],d2[1]),response.data['data'][i]["close_price"],undefined,undefined,undefined,undefined,undefined]);
								if(i==m-1){
									lastDate=d1;
									lastDate2=d2;
								}
							}
							if(response.data['forecast']!=null){
								var forecast=response.data['forecast'].split(" ");
								m=forecast.length;
								for(i=0;i<m;i++){
									forecast[i]=parseFloat(forecast[i]);
									lastDate2[1]=parseInt(lastDate2[1])+1+i;
									dataRows.push([new Date(parseInt(lastDate[0]),parseInt((lastDate[1]-1)),parseInt(lastDate[2]),parseInt(lastDate2[0]),lastDate2[1]),undefined,undefined,undefined,forecast[i],forecast[i].toString(),undefined]);
								};
							}
							data.addColumn('date', 'Date'); // Implicit series 1 data col.
							data.addColumn('number', 'Historical Price'); // Implicit domain label col.
							data.addColumn({type:'string', role:'annotation'});
							data.addColumn({type:'string', role:'annotationText'});
							data.addColumn('number', 'Future Price'); // Implicit domain label col.
							data.addColumn({type:'string', role:'annotation'});
							data.addColumn({type:'string', role:'annotationText'});
							data.addRows(dataRows);
						break;
					}

					var chart = new google.visualization.AnnotationChart(document.getElementById('chart_div'));
					var options = {
						displayAnnotations: true,
						allowHTML: true
					};
		        	chart.draw(data, options);
					pd.style.display='none';
				}



				$uibModalInstance.dismiss('cancel');
			},
			function(errmsg){
				AlertModalService.open(errmsg.statusText,"danger");
			}
		);

		}
		else{AlertModalService.open(errmsg,"danger");}
	};
});