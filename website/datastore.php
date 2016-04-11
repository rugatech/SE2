<?php

class driver extends PDO
{
	public $error;

	function __construct($dbname){
		try{
			parent::__construct('mysql:host='.get_cfg_var('db_host').';dbname='.$dbname.';charset=UTF8',get_cfg_var('db_www_user'),get_cfg_var('db_www_user_pswd'));
			$this->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		}
		catch(PDOException $e){
			print_r($e);
			throw new Exception($e->getMessage());
		}
	}
}

class DatastoreException extends Exception
{
    public function __construct($message, $code = 0, Exception $previous = null) {
        parent::__construct($message, $code, $previous);
    }
}

class datastore
{
	public $db;
	public $error;
	public $authenticatedUser=[];

	public function __construct($dbname){
		try{
			$this->db=new driver($dbname);
		}
		catch(Exception $e){
			throw new DatastoreException('Unable to connect to database');
		}
	}

	private function __logError($error,$func){
		$pstmt=$this->db->prepare('INSERT INTO datastore_errors (error,func) VALUES (?,?)');
		$pstmt->execute([$error,$func]);
	}

	private function __authenticateUser($token){
		try{
			$pstmt=$this->db->prepare('SELECT person FROM session WHERE sessid=?');
			$pstmt->execute([$token]);
			if($pstmt->rowCount()==1){
				$rs=$pstmt->fetch(PDO::FETCH_ASSOC);
				$this->authenticatedUser=$rs;
			}
			else{throw new DatastoreException('User is not authenticated');}
		}
		catch(PDOException $e){throw new DatastoreException('ERROR, unable to authenication user');}

	}

	public function loginUser($email,$password,$token){
		$pstmt=$this->db->prepare('SELECT pkey,passwd FROM people WHERE email=? LIMIT 1');
		try{
			$pstmt->execute([$email]);
			if($pstmt->rowCount()<1){
				throw new DatastoreException('E-Mail Address not found');
			}
			else{
				$rs=$pstmt->fetch(PDO::FETCH_ASSOC);
				if(!password_verify($password, $rs['passwd'])){
					throw new DatastoreException('ERROR, Invalid password');
				}
			}
			$pstmt=$this->db->prepare('INSERT INTO session (sessid,person) VALUES (?,?)');
			$pstmt->execute([$token,$rs['pkey']]);
		}
		catch(PDOException $e){
			$this->__logError($e->getMessage(),__FUNCTION__);
			throw new DatastoreException('Unable to login');
		}
	}

	public function loginCASUser($netid,$castoken,$ip,$user_agent){
		$pstmt=$this->db->prepare('SELECT * FROM people WHERE netid=? AND lc="Y" LIMIT 1');
		try{
			$pstmt->execute([$netid]);
			if($pstmt->rowCount()<1){
				throw new DatastoreException('User not found');
			}
			$person=$pstmt->fetch(PDO::FETCH_ASSOC);
			$pstmt=$this->db->prepare('INSERT INTO sessions (`user`,`sessid`,`ip`,`user_agent`) VALUES (?,?,?,?)');
			$pstmt2=$this->db->prepare('DELETE FROM sessions WHERE sessid=?');
			$this->db->beginTransaction();
			$pstmt2->execute([$castoken]);
			$pstmt->execute([$person['pkey'],$castoken,$ip,$user_agent]);
			$this->db->commit();

		}
		catch(PDOException $e){
			$this->db->rollBack();
			$this->__logError($e->getMessage(),__FUNCTION__);
			throw new DatastoreException('Unable to login');
		}
	}

	public function searchRegistrations($netid,$email,$lname,$fname){
		$qry='SELECT * FROM `cohlit_registrations` WHERE ';
		$bv=[];
		if(!empty($netid)){
			$qry.='netid LIKE ?';
			$bv[]='%'.$netid.'%';
		}
		else{
			if(!empty($email)){
				$qry.='email LIKE ?';
				$bv[]='%'.$email.'%';
			}
			else{
				if(!empty($fname)){
					$qry.='fname LIKE ? AND ';
					$bv[]='%'.$fname.'%';
				}
				if(!empty($lname)){
					$qry.='lname LIKE ? AND ';
					$bv[]='%'.$lname.'%';
				}
				$qry=substr($qry,0,-5);
			}
		}
		$qry.=' ORDER BY fname,lname';
		if(empty($bv)){
			throw new DatastoreException('ERROR, you must provide a search criteria');
		}
		$stmt=$this->db->prepare($qry);
		try{
			$stmt->execute($bv);
			if($stmt->rowCount()>0){
				while($rs=$stmt->fetch(PDO::FETCH_ASSOC)){
					$retval[]=$rs;
				}
			}
			else{throw new DatastoreException('ERROR, no records found');}
		}
		catch(PDOException $e){
			$this->__logError($e->getMessage(),__FUNCTION__);
			throw new DatastoreException('ERROR, unable to search records');
		}
		return $retval;
	}

	public function searchParticipants($netid,$email,$lname,$fname){
		$qry='SELECT contacts.pkey,fname,lname,email,netid,permit_title,contacts.ts,contacts.create_ts FROM contacts INNER JOIN permits ON permits.pkey=contacts.permit WHERE ';
		$bv=[];
		if(!empty($netid)){
			$qry.='netid LIKE ?';
			$bv[]='%'.$netid.'%';
		}
		else{
			if(!empty($email)){
				$qry.='email LIKE ?';
				$bv[]='%'.$email.'%';
			}
			else{
				if(!empty($fname)){
					$qry.='fname LIKE ? AND ';
					$bv[]='%'.$fname.'%';
				}
				if(!empty($lname)){
					$qry.='lname LIKE ? AND ';
					$bv[]='%'.$lname.'%';
				}
				$qry=substr($qry,0,-5);
			}
		}
		$qry.=' ORDER BY fname,lname';
		if(empty($bv)){
			throw new DatastoreException('ERROR, you must provide a search criteria');
		}
		$stmt=$this->db->prepare($qry);
		try{
			$stmt->execute($bv);
			if($stmt->rowCount()>0){
				while($rs=$stmt->fetch(PDO::FETCH_ASSOC)){
					$retval[]=$rs;
				}
			}
			else{throw new DatastoreException('ERROR, no records found');}
		}
		catch(PDOException $e){
			$this->__logError($e->getMessage(),__FUNCTION__);
			throw new DatastoreException('ERROR, unable to search records');
		}
		return $retval;
	}

	public function getPerson($pkey){
		$stmt=$this->db->prepare('SELECT pkey,netid,email,fname,lname FROM contacts WHERE pkey=?');
		try{
			$stmt->execute([$pkey]);
			if($stmt->rowCount()>0){
				$retval=$stmt->fetch(PDO::FETCH_ASSOC);
			}
			else{throw new DatastoreException('ERROR, no records found');}
		}
		catch(PDOException $e){
			$this->__logError($e->getMessage(),__FUNCTION__);
			throw new DatastoreException('ERROR, unable to search records');
		}
		return $retval;
	}

	public function savePerson($pkey,$netid,$email){
		$pstmt=$this->db->prepare('UPDATE contacts SET email=?,netid=? WHERE pkey=?');
		try{
			$pstmt->execute([$email,$netid,$pkey]);
			$retval['results']=1;
		}
		catch(PDOException $e){
			$this->__logError($e->getMessage(),__FUNCTION__);
			throw new DatastoreException('ERROR, unable to save record');
		}
		return $retval;
	}
}