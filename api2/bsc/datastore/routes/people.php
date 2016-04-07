<?php
namespace bsc\datastore\routes;

use bsc\datastore;

class people extends \bsc\datastore\datastore{
	public function __construct($jwt){
		parent::__construct($jwt);
	}

	public function getPersonById($pkey){
		if(!is_numeric($pkey)){throw new DatastoreException('Invalid ID supplied',5);}
		try{
			$this->__authenticateUser();
			$pstmt=$this->db->prepare('SELECT * FROM people WHERE pkey=?');
			$pstmt->execute([$pkey]);
			if($pstmt->rowCount()>0){
				$rs=$pstmt->fetch(\PDO::FETCH_ASSOC);
				return(json_encode($rs,JSON_NUMERIC_CHECK));
			}
			else{throw new DatastoreException('Person not found',1);}
		}
		catch(\PDOException $e){
			throw new DatastoreException('Database Error',2);
			$this->__logError($e->getMessage(),__FUNCTION__);
		}
	}

	public function addPerson($data){
		if(empty($data['fname'])){throw new DatastoreException('Invalid First Name',1);}
		if(empty($data['lname'])){throw new DatastoreException('Invalid Last Name',1);}
		if(empty($data['email'])){throw new DatastoreException('Invalid E-Mail Address',1);}
		if(empty($data['user_type'])){throw new DatastoreException('Invalid User Type',1);}
		if (filter_var($data['email'], FILTER_VALIDATE_EMAIL) === false){throw new DatastoreException('Invalid E-Mail Address',1);}
		$data=$this->_sanitize($data);
		$pstmt=$this->db->prepare('INSERT INTO people (fname,lname,email,netid,elcid,user_type) VALUES (?,?,?,?,?,?)');
		try{
			$pstmt->execute([$data['fname'],$data['lname'],$data['email'],$data['netid'],$data['elcid'],$data['user_type']]);
		}
		catch(\PDOException $e){
			throw new DatastoreException('Unable to add person',2);
		}
	}

	public function editPerson($data,$pkey){
		if(empty($data['fname'])){throw new DatastoreException('Invalid First Name',1);}
		if(empty($data['lname'])){throw new DatastoreException('Invalid Last Name',1);}
		if(empty($data['email'])){throw new DatastoreException('Invalid E-Mail Address',1);}
		if(empty($data['user_type'])){throw new DatastoreException('Invalid User Type',1);}
		if(filter_var($data['email'], FILTER_VALIDATE_EMAIL) === false){throw new DatastoreException('Invalid E-Mail Address',1);}
		$data=$this->_sanitize($data);
		$pstmt=$this->db->prepare('SELECT pkey FROM people WHERE pkey=?');
		$pstmt2=$this->db->prepare('UPDATE people SET fname=?,lname=?,email=?,netid=?,elcid=?,user_type=? WHERE pkey=?');
		try{
			$pstmt->execute([$pkey]);
			if($pstmt->rowCount()<1){throw new DatastoreException('Person not found',1);}
			$pstmt2->execute([$data['fname'],$data['lname'],$data['email'],$data['netid'],$data['elcid'],$data['user_type'],$pkey]);
		}
		catch(\PDOException $e){
			throw new DatastoreException('Unable to save person',2);
		}
	}

	public function deletePerson($pkey){
		$pstmt=$this->db->prepare('SELECT pkey FROM people WHERE pkey=?');
		$pstmt2=$this->db->prepare('DELETE FROM people WHERE pkey=?');
		try{
			$pstmt->execute([$pkey]);
			if($pstmt->rowCount()<1){throw new DatastoreException('Person not found',1);}
			$pstmt2->execute([$pkey]);
		}
		catch(\PDOException $e){
			throw new DatastoreException('Database Error',2);
		}
	}
}