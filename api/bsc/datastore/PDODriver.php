<?php
namespace bsc\datastore;

class PDODriver extends \PDO
{
	public function __construct(){
		parent::__construct('mysql:host='.get_cfg_var('db_host').';dbname=bsc;charset=UTF8',get_cfg_var('db_www_user'),get_cfg_var('db_www_user_pswd'));
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
