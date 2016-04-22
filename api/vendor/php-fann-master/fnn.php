<?php include('pdodb.php');

ini_set('display_errors',TRUE);
define('LEARNING_RATE',1.2);
define('TARGET_ERROR',0.2);
define('MOMENTUM',0);

$db=new pdodb('se2');
$stmt=$db->query('SELECT close_price FROM historical WHERE symbol="C" LIMIT 50');
$a=$stmt->rowCount()-1;
$i=0;
while($rs=$stmt->fetch(PDO::FETCH_ASSOC)){
	if($i!=$a){$data[]=$rs['close_price'];}
	else{$real_target=$rs['close_price'];}
	$i++;
}
$normalize=ceil(log10($real_target))+1;
$target=$real_target/(pow(10,$normalize));
foreach($data as $key=>$val){
	$data[$key]=$val/(pow(10,$normalize));
}

function sigmoid($in){
	return((1/(1+exp(-1*$in))));
}

function rng(){
	return mt_rand(-500,500)/1000;
}

$m=count($data);

//Initialize the weights
for($i=0;$i<$m;$i++){
	for($j=0;$j<$m;$j++){
		$weight[$i.$j]=rng();
		$delta_weight[$i.$j]=0;
	}
	$weight[$i.'T']=rng();
}

for($z=0;$z<100;$z++){
	//Input to hidden node
	for($i=0;$i<$m;$i++){
		$node[$i]=0;
		for($j=0;$j<$m;$j++){
			$node[$i]+=$data[$j]*$weight[$j.$i];
		}
		$node[$i]=sigmoid($node[$i]);
	}
	//Input into output node
	$output_node=0;
	for($i=0;$i<$m;$i++){
		$output_node+=$node[$i]*$weight[$i.'T'];
	}
	$output_node=sigmoid($output_node);
	$output_error=($target-$output_node)*(1-$output_node)*$output_node;

	//New weights for output layer
	for($i=0;$i<$m;$i++){
		$weight[$i.'T']=$weight[$i.'T']+(LEARNING_RATE*$node[$i]*$output_error);
	}

	//Hidden Node Errors
	$epoch_error=ABS($output_error);
	for($i=0;$i<$m;$i++){
		$node_error[$i]=$output_error*$weight[$i.'T']*(1-$output_node)*$output_node;
		$epoch_error+=ABS($node_error);
	}

	//New input weights
	for($i=0;$i<$m;$i++){
		for($j=0;$j<$m;$j++){
			$dw=(LEARNING_RATE*$node_error[$i]*$data[$j]);
			$weight[$j.$i]=$weight[$j.$i]+$dw+($delta_weight[$i.$j]*MOMENTUM);
			$delta_weight[$i.$j]=$dw;
		}
	}
	//print_r($node);
	echo $z.' '.$target.' '.$output_node.' '.$epoch_error."\r\n";;
}

//print_r($weight);
//print_r($node_error);
//echo $output_node."\n";
//echo $error;
echo 'done';
?>