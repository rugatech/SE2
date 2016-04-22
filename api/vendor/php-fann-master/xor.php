<?php include('pdodb.php');

ini_set('display_errors',TRUE);
define('LEARNING_RATE',2.0);
define('TARGET_ERROR',0.0002);
define('MOMENTUM',0);

//$db=new pdodb('se2');
//$stmt=$db->query('SELECT close_price FROM historical WHERE symbol="C" LIMIT 50');
//$a=$stmt->rowCount()-1;
//$i=0;
//while($rs=$stmt->fetch(PDO::FETCH_ASSOC)){
//	if($i!=$a){$data[]=$rs['close_price'];}
//	else{$real_target=$rs['close_price'];}
//	$i++;
//}
//Calculates the Sigmoid
function sigmoid($in){
	return((1/(1+exp(-1*$in))));
}

//Generate Random numbers
function rng(){
	return mt_rand(-1000,1000)/1000;
}

//Training Data set
$data=[
	[0.01,0.5460,0.05424],
	[0.02,0.5424,0.5467],
	[0.03,0.5467,0.5533],
	[0.04,0.5533,0.05489],
	[0.05,0.05489,0.5484],
	[0.06,0.5484,0.5497],
	[0.07,0.5497,0.05424],
	[0.08,0.05424,0.5487],
	[0.09,0.5487,0.5455],
];
$m=count($data);
//Initialize the weights
$weight_ac=rng();
$weight_ad=rng();
$weight_bc=rng();
$weight_bd=rng();
$weight_co=rng();
$weight_do=rng();

$kill=500000;
echo 'Learning Rate='.LEARNING_RATE."\r\n";
echo 'Target Error='.TARGET_ERROR."\r\n";
echo "\r\nInitial Weights\r\n";
echo "Wac=".$weight_ac."\r\nWad=".$weight_ad."\r\nWbc=".$weight_bc."\r\nWbd=".$weight_bd."\r\nWco=".$weight_co."\r\nWdo=".$weight_do."\r\n";

//begin the training loop
while(1==1){
	//Initialize the change in weights and error for each node per batch
	$delta_weight_co=0;
	$delta_weight_do=0;
	$delta_weight_ac=0;
	$delta_weight_ad=0;
	$delta_weight_bc=0;
	$delta_weight_bd=0;
	$epoch_error=0;

	//Loop through the four training points
	for($x=0;$x<$m;$x++){
		//Calculate the output of each node based on its input
		$output_c=$data[$x][0]*$weight_ac+$data[$x][1]*$weight_bc;
		$output_c=sigmoid($output_c);
		$output_d=$data[$x][0]*$weight_ad+$data[$x][1]*$weight_bd;
		$output_d=sigmoid($output_d);
		$output_o=$output_c*$weight_co+$output_d*$weight_do;
		$output_o=sigmoid($output_o);

		//Calculate the error of each node
		$error_o=$output_o*(1-$output_o)*($data[$x][2]-$output_o);
		$error_c=$output_c*(1-$output_c)*$error_o*$weight_co;
		$error_d=$output_d*(1-$output_d)*$error_o*$weight_do;

		//Sum the error of nodes C,D,O for the epoch error
		$epoch_error+=abs($error_o)+abs($error_c)+abs($error_d);

		//calculate the change in weight of each node. Each node has 4 delta values
		$delta_weight_co+=(LEARNING_RATE*$output_c*$error_o);
		$delta_weight_do+=(LEARNING_RATE*$output_d*$error_o);
		$delta_weight_ac+=(LEARNING_RATE*$data[$x][0]*$error_c);
		$delta_weight_ad+=(LEARNING_RATE*$data[$x][0]*$error_d);
		$delta_weight_bc+=(LEARNING_RATE*$data[$x][1]*$error_c);
		$delta_weight_bd+=(LEARNING_RATE*$data[$x][1]*$error_d);
	}
	if($i==0){echo "\r\nFirst Batch Error=".$epoch_error."\r\n";}

	//Determine the new weight of each node
	$weight_co+=$delta_weight_co;
	$weight_do+=$delta_weight_do;
	$weight_ac+=$delta_weight_ac;
	$weight_ad+=$delta_weight_ad;
	$weight_bc+=$delta_weight_bc;
	$weight_bd+=$delta_weight_bd;
	$i++;

	//break loop if the kill value is reached or it epoch error is less then or equal to the TARGET_ERROR
	if($epoch_error<=TARGET_ERROR||$i==$kill){break;}
}

echo "\r\nFinal Weights\r\n";
echo "Wac=".$weight_ac."\r\nWad=".$weight_ad."\r\nWbc=".$weight_bc."\r\nWbd=".$weight_bd."\r\nWco=".$weight_co."\r\nWdo=".$weight_do."\r\n";
echo "\r\nFinal Error=".$epoch_error."\r\n";
echo "\r\nNumber of Batches Run=".$i."\r\n\r\n";

//Recalculate the data points with the calculated weights to verify that the XOR table is correct
echo "Verify Results\r\n";
for($x=0;$x<$m;$x++){
	$output_c=$data[$x][0]*$weight_ac+$data[$x][1]*$weight_bc;
	$output_c=sigmoid($output_c);
	$output_d=$data[$x][0]*$weight_ad+$data[$x][1]*$weight_bd;
	$output_d=sigmoid($output_d);
	$output_o=$output_c*$weight_co+$output_d*$weight_do;
	$output_o=sigmoid($output_o);
	echo $data[$x][0].' XOR '.$data[$x][1].' = '.$data[$x][2].' ('.$output_o.")\r\n";
}
