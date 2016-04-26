<?php
namespace bsc\model;

use NumPHP\Core\NumArray;
use NumPHP\LinAlg\LinAlg;

class baynes{

	public $forecast=[];

	public function __construct($stock){
		$trainingData=[];
		$testData=[];
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, 'http://www.rugatech.com/se2/api/stock/historical/'.$stock);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$output = curl_exec($ch);
		curl_close($ch);
		$json=json_decode($output,TRUE);
		$y=count($json)-1;
		foreach($json as $key=>$val){
			if($key>($y-1)){
				$testData[]=[($key+1),$val['close_price']];
			}
			else{$trainingData[]=[($key+1),$val['close_price']];}
		}
		$this->forecast=$this->__trainModel($trainingData,$testData);
	}

	public function getForecast(){
		return $this->forecast;
	}

	protected function __getMatrixACell($x,$pow){
		$sum=0;
		foreach($x as $key=>$val){
			$sum+=$val**$pow;
		}
		return $sum;
	}

	protected function __getMatrixBCell($x,$y,$pow){
		$sum=0;
		foreach($x as $key=>$val){
			$sum+=($val**$pow)*$y[$key];
		}
		return $sum;
	}

	protected function __trainModel($data,$test_data){
		$N=6;
		$minmae=[];
		$coeffArray=[];
		for($N=3;$N<=10;$N++){
			$x=[];$y=[];$matrixA=[];$matrixB=[];$sumX=[];$sumY=[];$actual=[];$areA=0;$areB=0;
			foreach($data as $key=>$val){
				$x[]=trim($val[0]);
				$y[]=trim($val[1]);
				$maxX=trim($val[0]);
			}
			for($i=0;$i<=$N*2;$i++){
				$sumX[$i]=$this->__getMatrixACell($x,$i);
			}
			for($i=0;$i<=$N;$i++){
				for($j=0;$j<=$N;$j++){
					$matrixA[$i][$j]=$sumX[($i+$j)];
				}
				$matrixB[]=$this->__getMatrixBCell($x,$y,$i);
			}
			$matrix1 = new NumArray($matrixA);
			$matrix2 = new NumArray($matrixB);
			$inv=LinAlg::inv($matrix1);
			$dot=$inv->dot($matrix2);
			$coeff=$dot->getData();
			$coeffArray[$N]=$coeff;
			$max=count($coeff);
			foreach($test_data as $key=>$val){
				$actual[trim($val[0])]=trim($val[1]);
			}

			for($i=1;$i<=1;$i++){
				$f=0;
				$x=$maxX+$i;
				for($j=0;$j<=$N;$j++){
					$f+=$coeff[$j]*pow($x,$j);
				}
				$predicted=Round($f,2);
				$areA+=abs($actual[$x]-$predicted);
				$areB+=$actual[$x];
			}
			$mae=Round(($areA/Count($actual)),2);
			$are=Round(($areA/$areB),2);
			$minmae[$N]=$mae;
			//echo "\r\nOrder=".$N;
			//echo "\r\nMean Absolute Error=".$mae;
			//echo "\r\nAverage Relative Error=".$are;
		}
		asort($minmae);
		foreach($minmae as $key=>$val){
			$order=$key;
			$ca=$coeffArray[$key];
			break;
		}
		for($i=1;$i<6;$i++){
			$f=0;
			$x=$maxX+$i;
			for($j=0;$j<=$order;$j++){
				$f+=$ca[$j]*pow($x,$j);
			}
			$retval[]=$f;
		}
		return ($retval);
	}
}