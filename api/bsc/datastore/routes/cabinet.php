<?php
namespace bsc\datastore\routes;
use bsc\datastore\DatastoreException;
use bsc\datastore;

class cabinet extends \bsc\datastore\datastore{
	public function __construct($jwt){
		parent::__construct($jwt);
	}

	public function getCabinetById($pkey){
		if(!is_numeric($pkey)){throw new DatastoreException('Invalid ID supplied',5);}
		try{
			$this->__authenticateUser();
			$pstmt=$this->db->prepare('SELECT * FROM cabinet WHERE pkey=?');
			$pstmt->execute([$pkey]);
			if($pstmt->rowCount()>0){
				$rs=$pstmt->fetch(\PDO::FETCH_ASSOC);
				return(json_encode($rs,JSON_NUMERIC_CHECK));
			}
			else{throw new DatastoreException('Cabinet not found',1);}
		}
		catch(\PDOException $e){
			throw new DatastoreException('Database Error',2);
			$this->__logError($e->getMessage(),__FUNCTION__);
		}
	}

	public function addEditCabinet($data,$pkey,$mode){
		if(empty($data['serial_number'])){throw new DatastoreException('Invalid Serial Number',1);}
		if(empty($data['location'])){throw new DatastoreException('Invalid Location',1);}
		$data=$this->_sanitize($data);
		$pstmt=$this->db->prepare('SELECT pkey FROM elcid.locations WHERE pkey=? LIMIT 1');
		$pstmt->execute([$data['location']]);
		if($pstmt->rowCount()<1){throw new DatastoreException('Location does not exist',1);}

		if($mode=='Add'){
			$qry=$this->db->buildQuery('cabinet',$data,'','I');
		}
		if($mode=='Edit'){
			if(empty($pkey)){throw new DatastoreException('Invalid Cabinet pkey',1);}
			$qry=$this->db->buildQuery('cabinet',$data,['pkey'=>$pkey],'U');
		}
		$pstmt=$this->db->prepare($qry[0]);
		try{
			$pstmt->execute($qry[1]);
		}
		catch(\PDOException $e){
			throw new DatastoreException('Unable to save cabinet',2);
		}
	}

	public function deleteCabinet($pkey){
		$pstmt=$this->db->prepare('SELECT pkey FROM cabinet WHERE pkey=?');
		$pstmt2=$this->db->prepare('DELETE FROM cabinet WHERE pkey=?');
		try{
			$pstmt->execute([$pkey]);
			if($pstmt->rowCount()<1){throw new DatastoreException('Cabinet not found',1);}
			$pstmt2->execute([$pkey]);
		}
		catch(\PDOException $e){
			throw new DatastoreException('Database Error',2);
		}
	}

}