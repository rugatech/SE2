<?php
namespace bsc\datastore;

class PDODriver extends \PDO
{
	public function __construct(){
		parent::__construct('mysql:host=localhost;dbname=se2;charset=utf8','www','48fgh38g64');
		$this->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
	}

	public function buildQuery($tbl,$flds,$where,$mode){
		$qry='';$qryB='';$qryC='';
		$bv=[];
		if($mode=='I'){
			$qry='INSERT INTO '.$tbl.'(';
			foreach($flds as $key=>$val){
				$qryB.=$key.',';
				$qryC.='?,';
				$bv[]=$val;
			}
			$retval=[$qry.substr($qryB,0,-1).') VALUES('.substr($qryC,0,-1).')',$bv];
		}
		if($mode=='U'){
			$qry='UPDATE '.$tbl.' SET ';
			foreach($flds as $key=>$val){
				$qryB.=$key.'=?,';
				$bv[]=$val;
			}
			foreach($where as $key=>$val){
				$qryC.=$key.'=?,';
				$bv[]=$val;
			}
			$retval=[$qry.substr($qryB,0,-1).' WHERE '.substr($qryC,0,-1),$bv];
		}
		return $retval;
	}
}
